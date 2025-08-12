package com.odoo.Quickcourt.Controller;

// controller/BookingController.java

import com.odoo.Quickcourt.Dto.Booking.BookingRequest;
import com.odoo.Quickcourt.Dto.Booking.BookingResponse;
import com.odoo.Quickcourt.Dto.Payment.CreateOrderResponse;
import com.odoo.Quickcourt.Dto.Payment.PaymentResponse;
import com.odoo.Quickcourt.Dto.SlotHold.HoldSlotRequest;
import com.odoo.Quickcourt.Entities.Payment;
import com.odoo.Quickcourt.Repository.PaymentRepository;
import com.odoo.Quickcourt.Services.BookingService;
import com.odoo.Quickcourt.Services.CourtSlotHoldService;
import com.odoo.Quickcourt.Services.PaymentService;
import com.razorpay.Utils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.data.domain.Sort;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management APIs")
public class BookingController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final CourtSlotHoldService holdService;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Create a new booking")
    public ResponseEntity<CreateOrderResponse> createBooking(@Valid @RequestBody BookingRequest request) throws BadRequestException {
        holdService.holdSlot(HoldSlotRequest.builder()
                .courtId(request.getCourtId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .date(request.getDate())
                .build());

        CreateOrderResponse response = bookingService.createBooking(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/payment-callback", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> paymentCallback(
            @RequestParam("razorpay_order_id") String orderId,
            @RequestParam("razorpay_payment_id") String paymentId,
            @RequestParam("razorpay_signature") String signature) {
        Map<String, Object> response = new HashMap<>();
        try {
            String payload = orderId + "|" + paymentId;
            boolean isValid = Utils.verifySignature(payload, signature, keySecret);

            if (isValid) {
//                Order order = orderRepository.findByRazorpayOrderId(orderId);
                Payment payment = paymentService.getPaymentByRazorpayOrderId(orderId);
                System.out.println("Payment: " + payment);
                if (payment != null && Payment.PaymentStatus.CREATED.equals(payment.getStatus())) {
                    payment.setRazorpayPaymentId(paymentId);
                    payment.setRazorpaySignature(signature);
                    payment.setStatus(Payment.PaymentStatus.AUTHORIZED);
                    paymentRepository.save(payment);
                    response.put("success", true);
                    response.put("message", "Payment authorized, awaiting delivery");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Order not found or already processed");
                    return ResponseEntity.status(404).body(response);
                }
            } else {
                response.put("success", false);
                response.put("message", "Payment verification failed");
                return ResponseEntity.status(400).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error in payment callback: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping(value = "/verify-payment/{orderId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> verifyDelivery(
            @PathVariable("orderId") String orderId) {
        Map<String, Object> response = new HashMap<>();
        try {
            paymentService.verifyAndReleasePayment(orderId);
            response.put("success", true);
            response.put("message", "Delivery verified, payment released to farmer");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to verify delivery: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Get user's bookings")
    public ResponseEntity<Page<BookingResponse>> getUserBookings(Pageable pageable) throws BadRequestException {
        // Log original pageable for debugging

        // Map 'bookingDate' to 'createdAt' (optional fallback)
        Sort sort = pageable.getSort().stream()
                .map(order -> {
                    if ("bookingDate".equals(order.getProperty())) {
                        return new Sort.Order(order.getDirection(), "createdAt");
                    }
                    return order;
                })
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by));

        // Validate sort fields
        List<String> validSortFields = Arrays.asList("id", "status", "createdAt", "startTime", "endTime");
        for (Sort.Order order : sort) {
            String sortProperty = order.getProperty();
            if (!validSortFields.contains(sortProperty)) {
                throw new BadRequestException("Invalid sort field: " + sortProperty + ". Valid fields are: " + validSortFields);
            }
        }

        // Validate page and size
        if (pageable.getPageNumber() < 0) {
            throw new BadRequestException("Page number cannot be negative");
        }
        if (pageable.getPageSize() <= 0 || pageable.getPageSize() > 100) {
            throw new BadRequestException("Page size must be between 1 and 100");
        }

        Pageable validatedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        Page<BookingResponse> bookings = bookingService.getUserBookings(validatedPageable);
        return ResponseEntity.ok(bookings);
    }
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<String> cancelBooking(@PathVariable UUID id) throws BadRequestException {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    @GetMapping("/{ownerId}")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Get bookings for a specific owner")
    public ResponseEntity<Page<BookingResponse>> getBookingsByOwner(
            @PathVariable UUID ownerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws BadRequestException {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<BookingResponse> bookings = bookingService.getBookingsByOwner(ownerId, pageable);
        return ResponseEntity.ok(bookings);
    }
}
