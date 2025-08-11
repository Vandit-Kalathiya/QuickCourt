package com.odoo.Quickcourt.Controller;
// controller/VenueController.java

import com.odoo.Quickcourt.Dto.Facility.FacilityResponse;
import com.odoo.Quickcourt.Dto.Review.ReviewResponse;
import com.odoo.Quickcourt.Entities.Facility;
import com.odoo.Quickcourt.Services.FacilityService;
import com.odoo.Quickcourt.Services.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
@Tag(name = "Venues", description = "Public venue APIs")
public class VenueController {

    private final FacilityService facilityService;
    private final ReviewService reviewService;

    @GetMapping
    @Operation(summary = "Get all approved facilities")
    public ResponseEntity<Page<FacilityResponse>> getFacilities(
            @RequestParam(required = false) List<Facility.Sport> sports,
            @RequestParam(required = false) String name,
            Pageable pageable) {
        Page<FacilityResponse> facilities = facilityService.getApprovedFacilities(sports, name, pageable);
        return ResponseEntity.ok(facilities);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get facility details by ID")
    public ResponseEntity<FacilityResponse> getFacility(@PathVariable UUID id) {
        FacilityResponse facility = facilityService.getFacilityById(id);
        return ResponseEntity.ok(facility);
    }

    @GetMapping("/{id}/reviews")
    @Operation(summary = "Get facility reviews")
    public ResponseEntity<Page<ReviewResponse>> getFacilityReviews(
            @PathVariable UUID id,
            Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getFacilityReviews(id, pageable);
        return ResponseEntity.ok(reviews);
    }
}
