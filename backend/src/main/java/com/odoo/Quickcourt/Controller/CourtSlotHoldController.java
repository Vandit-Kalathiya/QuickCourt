package com.odoo.Quickcourt.Controller;


import com.odoo.Quickcourt.Dto.SlotHold.HoldSlotRequest;
import com.odoo.Quickcourt.Dto.SlotHold.HoldSlotResponse;
import com.odoo.Quickcourt.Services.CourtSlotHoldService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class CourtSlotHoldController {

    private final CourtSlotHoldService holdService;

    @PostMapping("/hold")
    @Operation(summary = "Temporarily hold a slot for booking")
    public ResponseEntity<HoldSlotResponse> holdSlot(@RequestBody @Valid HoldSlotRequest request) {
        return ResponseEntity.ok(holdService.holdSlot(request));
    }

    @DeleteMapping("/hold/{holdId}")
    @Operation(summary = "Release a held slot manually")
    public ResponseEntity<String> releaseHold(@PathVariable UUID holdId) {
        holdService.releaseHold(holdId);
        return ResponseEntity.ok("Hold released");
    }
}
