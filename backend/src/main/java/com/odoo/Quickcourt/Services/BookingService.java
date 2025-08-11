package com.odoo.Quickcourt.Services;
// service/BookingService.java


import com.odoo.Quickcourt.Auth.Entities.UserPrincipal;
import com.odoo.Quickcourt.Dto.Booking.BookingRequest;
import com.odoo.Quickcourt.Dto.Booking.BookingResponse;
import com.odoo.Quickcourt.Dto.Payment.CreateOrderRequest;
import com.odoo.Quickcourt.Dto.Payment.CreateOrderResponse;
import com.odoo.Quickcourt.Entities.Booking.Booking;
import com.odoo.Quickcourt.Entities.Court;
import com.odoo.Quickcourt.Entities.Facility;
import com.odoo.Quickcourt.Exception.ResourceNotFoundException;
import com.odoo.Quickcourt.Repository.BookingRepository;
import com.odoo.Quickcourt.Repository.CourtAvailabilityRepository;
import com.odoo.Quickcourt.Repository.CourtRepository;
import com.odoo.Quickcourt.Repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final FacilityRepository facilityRepository;
    private final CourtAvailabilityRepository availabilityRepository;
    private final PaymentService paymentService;

    public CreateOrderResponse createBooking(BookingRequest request) throws BadRequestException {
        UserPrincipal userPrincipal = getCurrentUser();

        Court court = courtRepository.findById(request.getCourtId())
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        Facility facility = facilityRepository.findById(court.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (facility.getStatus() != Facility.FacilityStatus.APPROVED) {
            throw new BadRequestException("Facility is not approved");
        }

        // Check if court is active
        if (!court.getActive()) {
            throw new BadRequestException("Court is not active");
        }

        // Validate booking time
        validateBookingTime(court, request);

        // Check for conflicts
        if (bookingRepository.existsConflictingBooking(
                request.getCourtId(), request.getDate(),
                request.getStartTime(), request.getEndTime())) {
            throw new BadRequestException("Time slot is already booked");
        }

        // Check availability
        if (isSlotBlocked(request)) {
            throw new BadRequestException("Time slot is blocked");
        }

        // Calculate price
        BigDecimal totalPrice = calculatePrice(court, request);

        // Create booking
        Booking booking = Booking.builder()
                .userId(userPrincipal.getId())
                .courtId(request.getCourtId())
                .facilityId(facility.getId())
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .totalPrice(totalPrice)
                .build();

        booking = bookingRepository.save(booking);

        // Process payment

//        return mapToResponse(booking, facility, court);
        return paymentService.createOrder(CreateOrderRequest.builder()
                .amount(totalPrice)
                .currency("INR")
                .userId(userPrincipal.getId().toString())
                .ownerId(facility.getOwnerId().toString())
                .description("Booking for court " + court.getName())
                .bookingId(booking.getId())
                .build());
    }

    public Page<BookingResponse> getUserBookings(Pageable pageable) {
        UserPrincipal userPrincipal = getCurrentUser();

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userPrincipal.getId(), pageable)
                .map(this::mapToResponse);
    }

    public void cancelBooking(UUID bookingId) throws BadRequestException {
        UserPrincipal userPrincipal = getCurrentUser();

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUserId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to cancel this booking");
        }

        if (booking.getStatus() != Booking.BookingStatus.CREATED) {
            throw new BadRequestException("Cannot cancel this booking");
        }

        // Check if booking is in the future
        LocalDateTime bookingDateTime = LocalDateTime.of(booking.getDate(), booking.getStartTime());
        if (bookingDateTime.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot cancel past bookings");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // Process refund
        paymentService.processRefund(booking.getId());
    }

    private void validateBookingTime(Court court, BookingRequest request) throws BadRequestException {
        if (request.getStartTime().isBefore(court.getOpeningTime()) ||
                request.getEndTime().isAfter(court.getClosingTime())) {
            throw new BadRequestException("Booking time is outside court operating hours");
        }

        if (request.getStartTime().isAfter(request.getEndTime()) ||
                request.getStartTime().equals(request.getEndTime())) {
            throw new BadRequestException("Invalid booking time");
        }

        // Minimum 1 hour booking
        if (Duration.between(request.getStartTime(), request.getEndTime()).toHours() < 1) {
            throw new BadRequestException("Minimum booking duration is 1 hour");
        }
    }

    private boolean isSlotBlocked(BookingRequest request) {
        return availabilityRepository.existsByCourtIdAndDateAndTimeRangeAndIsBlockedTrue(
                request.getCourtId(), request.getDate(),
                request.getStartTime(), request.getEndTime());
    }

    private BigDecimal calculatePrice(Court court, BookingRequest request) {
        long hours = Duration.between(request.getStartTime(), request.getEndTime()).toHours();
        return court.getPricePerHour().multiply(BigDecimal.valueOf(hours));
    }

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private BookingResponse mapToResponse(Booking booking) {
        Court court = courtRepository.findById(booking.getCourtId()).orElse(null);
        Facility facility = facilityRepository.findById(booking.getFacilityId()).orElse(null);
        return mapToResponse(booking, facility, court);
    }

    private BookingResponse mapToResponse(Booking booking, Facility facility, Court court) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .courtId(booking.getCourtId())
                .facilityId(booking.getFacilityId())
                .facilityName(facility != null ? facility.getName() : null)
                .courtName(court != null ? court.getName() : null)
                .date(booking.getDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .facilityAddress(facility.getAddress() != null ? facility.getAddress() : null)
                .facilityPhone(facility != null ? facility.getPhone() : null)
                .amenities(facility != null ? facility.getAmenities() : null)
                .duration((int) Duration.between(booking.getStartTime(), booking.getEndTime()).toHours())
                .sportType(court.getSportType().toString())
                .build();
    }
}
