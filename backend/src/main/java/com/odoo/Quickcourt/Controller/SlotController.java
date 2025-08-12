package com.odoo.Quickcourt.Controller;

import com.odoo.Quickcourt.Services.Slot.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import java.util.UUID;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @GetMapping("/{courtId}/available-slots")
    public ResponseEntity<?> getAvailableSlots(
            @PathVariable UUID courtId,
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(slotService.getAvailableSlots(courtId, date));
    }

    @GetMapping("/{courtId}/blocked-slots")
    public ResponseEntity<?> getBlockedSlots(
            @PathVariable UUID courtId,
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(slotService.getBlockedSlots(courtId, date));
    }

    @GetMapping("/{courtId}/all-slots")
    public ResponseEntity<?> getAllSlots(
            @PathVariable UUID courtId,
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(slotService.getAllSlots(courtId, date));
    }
}
