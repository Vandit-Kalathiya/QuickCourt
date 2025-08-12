package com.odoo.Quickcourt.Controller;

import com.odoo.Quickcourt.Dto.PricingRule.PricingRuleRequest;
import com.odoo.Quickcourt.Dto.PricingRule.PricingRuleResponse;
import com.odoo.Quickcourt.Services.PricingRuleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/owner/pricing-rules")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
@Tag(name = "Pricing Rules", description = "Pricing rule management APIs")
public class PricingRuleController {

    private final PricingRuleService pricingRuleService;

    @PostMapping
    @Operation(summary = "Create a new pricing rule")
    public ResponseEntity<PricingRuleResponse> createPricingRule(@Valid @RequestBody PricingRuleRequest request) {
        PricingRuleResponse response = pricingRuleService.createPricingRule(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a pricing rule")
    public ResponseEntity<PricingRuleResponse> updatePricingRule(
            @PathVariable UUID id,
            @Valid @RequestBody PricingRuleRequest request) {
        PricingRuleResponse response = pricingRuleService.updatePricingRule(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a pricing rule")
    public ResponseEntity<String> deletePricingRule(@PathVariable UUID id) {
        pricingRuleService.deletePricingRule(id);
        return ResponseEntity.ok("Pricing rule deleted successfully");
    }

    @PostMapping("/{id}/toggle")
    @Operation(summary = "Toggle pricing rule active status")
    public ResponseEntity<PricingRuleResponse> togglePricingRule(@PathVariable UUID id) {
        PricingRuleResponse response = pricingRuleService.togglePricingRule(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/facility/{facilityId}")
    @Operation(summary = "Get all pricing rules for a facility")
    public ResponseEntity<List<PricingRuleResponse>> getFacilityPricingRules(@PathVariable UUID facilityId) {
        List<PricingRuleResponse> rules = pricingRuleService.getFacilityPricingRules(facilityId);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/court/{courtId}")
    @Operation(summary = "Get all pricing rules for a court")
    public ResponseEntity<List<PricingRuleResponse>> getCourtPricingRules(@PathVariable UUID courtId) {
        List<PricingRuleResponse> rules = pricingRuleService.getCourtPricingRules(courtId);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/calculate-price")
    @Operation(summary = "Calculate price for a booking")
    public ResponseEntity<BigDecimal> calculatePrice(
            @RequestParam UUID courtId,
            @RequestParam LocalDate date,
            @RequestParam LocalTime time,
            @RequestParam int durationHours) {
        BigDecimal price = pricingRuleService.calculatePrice(courtId, date, time, durationHours);
        return ResponseEntity.ok(price);
    }
}