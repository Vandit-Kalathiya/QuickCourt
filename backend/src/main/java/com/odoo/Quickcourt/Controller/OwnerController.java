package com.odoo.Quickcourt.Controller;

// controller/OwnerController.java

import com.odoo.Quickcourt.Dto.Court.CourtRequest;
import com.odoo.Quickcourt.Dto.Court.CourtResponse;
import com.odoo.Quickcourt.Dto.Dashboard.OwnerDashboardResponse;
import com.odoo.Quickcourt.Dto.Facility.FacilityRequest;
import com.odoo.Quickcourt.Dto.Facility.FacilityResponse;
import com.odoo.Quickcourt.Services.CourtService;
import com.odoo.Quickcourt.Services.FacilityService;
import com.odoo.Quickcourt.Services.OwnerDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/owner")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
@Tag(name = "Owner", description = "Owner management APIs")
public class OwnerController {

    private final FacilityService facilityService;
    private final CourtService courtService;
    private final OwnerDashboardService dashboardService;

    // Facility Management
    @PostMapping("/facilities")
    @Operation(summary = "Create a new facility")
    public ResponseEntity<FacilityResponse> createFacility(
            @Valid @RequestPart FacilityRequest request,
            @RequestPart(required = false) List<MultipartFile> photos) {
        FacilityResponse facility = facilityService.createFacility(request, photos);
        return ResponseEntity.ok(facility);
    }

    @PutMapping("/facilities/{id}")
    @Operation(summary = "Update facility")
    public ResponseEntity<FacilityResponse> updateFacility(
            @PathVariable UUID id,
            @Valid @RequestPart FacilityRequest request,
            @RequestPart(required = false) List<MultipartFile> photos) {
        FacilityResponse facility = facilityService.updateFacility(id, request, photos);
        return ResponseEntity.ok(facility);
    }

    @GetMapping("/facilities")
    @Operation(summary = "Get owner's facilities")
    public ResponseEntity<List<FacilityResponse>> getOwnerFacilities() {
        List<FacilityResponse> facilities = facilityService.getOwnerFacilities();
        return ResponseEntity.ok(facilities);
    }

    // Court Management
    @PostMapping("/facilities/{facilityId}/courts")
    @Operation(summary = "Add court to facility")
    public ResponseEntity<CourtResponse> createCourt(
            @PathVariable UUID facilityId,
            @Valid @RequestBody CourtRequest request) {
        CourtResponse court = courtService.createCourt(facilityId, request);
        return ResponseEntity.ok(court);
    }

    @PutMapping("/courts/{id}")
    @Operation(summary = "Update court")
    public ResponseEntity<CourtResponse> updateCourt(
            @PathVariable UUID id,
            @Valid @RequestBody CourtRequest request) {
        CourtResponse court = courtService.updateCourt(id, request);
        return ResponseEntity.ok(court);
    }

    @GetMapping("/facilities/{facilityId}/courts")
    @Operation(summary = "Get facility courts")
    public ResponseEntity<List<CourtResponse>> getFacilityCourts(@PathVariable UUID facilityId) {
        List<CourtResponse> courts = courtService.getFacilityCourts(facilityId);
        return ResponseEntity.ok(courts);
    }

    // Availability Management
    @PostMapping("/courts/{courtId}/block")
    @Operation(summary = "Block time slot")
    public ResponseEntity<String> blockTimeSlot(
            @PathVariable UUID courtId,
            @RequestParam LocalDate date,
            @RequestParam LocalTime startTime,
            @RequestParam LocalTime endTime) {
        courtService.blockTimeSlot(courtId, date, startTime, endTime);
        return ResponseEntity.ok("Time slot blocked successfully");
    }

    @PostMapping("/courts/{courtId}/unblock")
    @Operation(summary = "Unblock time slot")
    public ResponseEntity<String> unblockTimeSlot(
            @PathVariable UUID courtId,
            @RequestParam LocalDate date) {
        courtService.unblockTimeSlot(courtId, date);
        return ResponseEntity.ok("Time slot unblocked successfully");
    }

    // Dashboard
    @GetMapping("/dashboard")
    @Operation(summary = "Get owner dashboard")
    public ResponseEntity<OwnerDashboardResponse> getOwnerDashboard() {
        OwnerDashboardResponse dashboard = dashboardService.getOwnerDashboard();
        return ResponseEntity.ok(dashboard);
    }
}
