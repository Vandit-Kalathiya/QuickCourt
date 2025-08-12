package com.odoo.Quickcourt.Dto.PricingRule;

import com.odoo.Quickcourt.Entities.PricingRule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingRuleResponse {

    private UUID id;
    private UUID facilityId;
    private UUID courtId;
    private String courtName;
    private String name;
    private PricingRule.RuleType type;
    private PricingRule.AdjustmentType adjustmentType;
    private BigDecimal adjustmentValue;
    private List<PricingRule.DayOfWeek> applicableDays;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean active;
    private Integer priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}