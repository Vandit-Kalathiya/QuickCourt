package com.odoo.Quickcourt.Services;


import com.odoo.Quickcourt.Auth.Entities.UserPrincipal;
import com.odoo.Quickcourt.Dto.SlotHold.HoldSlotRequest;
import com.odoo.Quickcourt.Dto.SlotHold.HoldSlotResponse;
import com.odoo.Quickcourt.Entities.CourtSlotHold;
import com.odoo.Quickcourt.Exception.BadRequestException;
import com.odoo.Quickcourt.Repository.BookingRepository;
import com.odoo.Quickcourt.Repository.CourtAvailabilityRepository;
import com.odoo.Quickcourt.Repository.CourtSlotHoldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CourtSlotHoldService {

    private final CourtSlotHoldRepository holdRepository;
    private final BookingRepository bookingRepository;
    private final CourtAvailabilityRepository availabilityRepository;

    @Value("${app.booking.holdMinutes:2}")
    private int holdMinutes;

    public HoldSlotResponse holdSlot(HoldSlotRequest request) {
        UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Check if slot already booked
        if (bookingRepository.existsConflictingBooking(request.getCourtId(), request.getDate(), request.getStartTime(), request.getEndTime())) {
            throw new BadRequestException("Slot already booked");
        }

        // Check if slot is blocked by owner
        if (availabilityRepository.existsByCourtIdAndDateAndTimeRangeAndIsBlockedTrue(
                request.getCourtId(), request.getDate(), request.getStartTime(), request.getEndTime())) {
            throw new BadRequestException("Slot is blocked for maintenance");
        }

        // Check if already held by someone else
        if (holdRepository.existsActiveHold(request.getCourtId(), request.getDate(), request.getStartTime(), request.getEndTime())) {
            throw new BadRequestException("Slot is temporarily held by another user");
        }

        // Create hold
        CourtSlotHold hold = CourtSlotHold.builder()
                .courtId(request.getCourtId())
                .userId(currentUser.getId())
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .expiresAt(LocalDateTime.now().plusMinutes(holdMinutes))
                .createdAt(LocalDateTime.now())
                .build();

        holdRepository.save(hold);

        return createResponse(hold);
    }

    public void releaseHold(UUID holdId) {
        holdRepository.deleteById(holdId);
    }

    // Automatic cleanup for expired holds
    public int cleanupExpiredHolds() {
        var expired = holdRepository.findByExpiresAtBefore(LocalDateTime.now());
        holdRepository.deleteAll(expired);
        return expired.size();
    }

    private HoldSlotResponse createResponse(CourtSlotHold hold) {
        HoldSlotResponse res = new HoldSlotResponse();
        res.setHoldId(hold.getId());
        res.setExpiresAt(hold.getExpiresAt());
        res.setMessage("Slot is held for you until " + hold.getExpiresAt());
        return res;
    }
}
