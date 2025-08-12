package com.odoo.Quickcourt.Services;

import com.odoo.Quickcourt.Auth.Entities.UserPrincipal;
import com.odoo.Quickcourt.Dto.PricingRule.PricingRuleRequest;
import com.odoo.Quickcourt.Dto.PricingRule.PricingRuleResponse;
import com.odoo.Quickcourt.Entities.Court;
import com.odoo.Quickcourt.Entities.Facility;
import com.odoo.Quickcourt.Entities.PricingRule;
import com.odoo.Quickcourt.Exception.BadRequestException;
import com.odoo.Quickcourt.Exception.ResourceNotFoundException;
import com.odoo.Quickcourt.Repository.CourtRepository;
import com.odoo.Quickcourt.Repository.FacilityRepository;
import com.odoo.Quickcourt.Repository.PricingRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PricingRuleService {

    private final PricingRuleRepository pricingRuleRepository;
    private final CourtRepository courtRepository;
    private final FacilityRepository facilityRepository;

    public PricingRuleResponse createPricingRule(PricingRuleRequest request) {
        UserPrincipal userPrincipal = getCurrentUser();

        // Validate court ownership
        Court court = courtRepository.findById(request.getCourtId())
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        Facility facility = facilityRepository.findById(court.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to create pricing rules for this court");
        }

        // Validate rule data
        validatePricingRule(request);

        PricingRule pricingRule = PricingRule.builder()
                .facilityId(facility.getId())
                .courtId(request.getCourtId())
                .name(request.getName())
                .type(request.getType())
                .adjustmentType(request.getAdjustmentType())
                .adjustmentValue(request.getAdjustmentValue())
                .applicableDays(request.getApplicableDays())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .active(request.getActive() != null ? request.getActive() : true)
                .priority(request.getPriority())
                .build();

        pricingRule = pricingRuleRepository.save(pricingRule);
        return mapToResponse(pricingRule);
    }

    public PricingRuleResponse updatePricingRule(UUID ruleId, PricingRuleRequest request) {
        UserPrincipal userPrincipal = getCurrentUser();

        PricingRule pricingRule = pricingRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing rule not found"));

        // Validate ownership
        Facility facility = facilityRepository.findById(pricingRule.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to update this pricing rule");
        }

        // Validate rule data
        validatePricingRule(request);

        // Update fields
        pricingRule.setName(request.getName());
        pricingRule.setType(request.getType());
        pricingRule.setAdjustmentType(request.getAdjustmentType());
        pricingRule.setAdjustmentValue(request.getAdjustmentValue());
        pricingRule.setApplicableDays(request.getApplicableDays());
        pricingRule.setStartTime(request.getStartTime());
        pricingRule.setEndTime(request.getEndTime());
        pricingRule.setStartDate(request.getStartDate());
        pricingRule.setEndDate(request.getEndDate());
        pricingRule.setActive(request.getActive() != null ? request.getActive() : true);
        pricingRule.setPriority(request.getPriority());

        pricingRule = pricingRuleRepository.save(pricingRule);
        return mapToResponse(pricingRule);
    }

    public void deletePricingRule(UUID ruleId) {
        UserPrincipal userPrincipal = getCurrentUser();

        PricingRule pricingRule = pricingRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing rule not found"));

        // Validate ownership
        Facility facility = facilityRepository.findById(pricingRule.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to delete this pricing rule");
        }

        pricingRuleRepository.delete(pricingRule);
    }

    public PricingRuleResponse togglePricingRule(UUID ruleId) {
        UserPrincipal userPrincipal = getCurrentUser();

        PricingRule pricingRule = pricingRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing rule not found"));

        // Validate ownership
        Facility facility = facilityRepository.findById(pricingRule.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to toggle this pricing rule");
        }

        pricingRule.setActive(!pricingRule.getActive());
        pricingRule = pricingRuleRepository.save(pricingRule);
        return mapToResponse(pricingRule);
    }

    public List<PricingRuleResponse> getFacilityPricingRules(UUID facilityId) {
        UserPrincipal userPrincipal = getCurrentUser();

        // Validate ownership
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to view pricing rules for this facility");
        }

        return pricingRuleRepository.findByFacilityId(facilityId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PricingRuleResponse> getCourtPricingRules(UUID courtId) {
        UserPrincipal userPrincipal = getCurrentUser();

        // Validate court ownership
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        Facility facility = facilityRepository.findById(court.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to view pricing rules for this court");
        }

        return pricingRuleRepository.findByCourtId(courtId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BigDecimal calculatePrice(UUID courtId, LocalDate date, LocalTime time, int durationHours) {
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        BigDecimal basePrice = court.getPricePerHour().multiply(BigDecimal.valueOf(durationHours));

        // Convert LocalDate to DayOfWeek enum
        PricingRule.DayOfWeek dayOfWeek = convertToDayOfWeek(date.getDayOfWeek());

        // Get applicable pricing rules
        List<PricingRule> applicableRules = pricingRuleRepository.findApplicableRules(
                courtId, dayOfWeek, time, date);

        // Apply the first applicable rule (highest priority)
        if (!applicableRules.isEmpty()) {
            PricingRule rule = applicableRules.get(0);
            return applyPricingRule(basePrice, rule);
        }

        return basePrice;
    }

    private void validatePricingRule(PricingRuleRequest request) {
        if (request.getAdjustmentValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Adjustment value cannot be negative");
        }

        if (request.getAdjustmentType() == PricingRule.AdjustmentType.PERCENTAGE &&
            request.getAdjustmentValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new BadRequestException("Percentage adjustment cannot exceed 100%");
        }

        if (request.getStartTime() != null && request.getEndTime() != null &&
            request.getStartTime().isAfter(request.getEndTime())) {
            throw new BadRequestException("Start time cannot be after end time");
        }

        if (request.getStartDate() != null && request.getEndDate() != null &&
            request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }
    }

    private BigDecimal applyPricingRule(BigDecimal basePrice, PricingRule rule) {
        if (rule.getAdjustmentType() == PricingRule.AdjustmentType.PERCENTAGE) {
            BigDecimal percentage = rule.getAdjustmentValue().divide(BigDecimal.valueOf(100));
            return basePrice.add(basePrice.multiply(percentage));
        } else {
            return basePrice.add(rule.getAdjustmentValue());
        }
    }

    private PricingRule.DayOfWeek convertToDayOfWeek(java.time.DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> PricingRule.DayOfWeek.MONDAY;
            case TUESDAY -> PricingRule.DayOfWeek.TUESDAY;
            case WEDNESDAY -> PricingRule.DayOfWeek.WEDNESDAY;
            case THURSDAY -> PricingRule.DayOfWeek.THURSDAY;
            case FRIDAY -> PricingRule.DayOfWeek.FRIDAY;
            case SATURDAY -> PricingRule.DayOfWeek.SATURDAY;
            case SUNDAY -> PricingRule.DayOfWeek.SUNDAY;
        };
    }

    private PricingRuleResponse mapToResponse(PricingRule pricingRule) {
        Court court = courtRepository.findById(pricingRule.getCourtId()).orElse(null);

        return PricingRuleResponse.builder()
                .id(pricingRule.getId())
                .facilityId(pricingRule.getFacilityId())
                .courtId(pricingRule.getCourtId())
                .courtName(court != null ? court.getName() : null)
                .name(pricingRule.getName())
                .type(pricingRule.getType())
                .adjustmentType(pricingRule.getAdjustmentType())
                .adjustmentValue(pricingRule.getAdjustmentValue())
                .applicableDays(pricingRule.getApplicableDays())
                .startTime(pricingRule.getStartTime())
                .endTime(pricingRule.getEndTime())
                .startDate(pricingRule.getStartDate())
                .endDate(pricingRule.getEndDate())
                .active(pricingRule.getActive())
                .priority(pricingRule.getPriority())
                .createdAt(pricingRule.getCreatedAt())
                .updatedAt(pricingRule.getUpdatedAt())
                .build();
    }

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}