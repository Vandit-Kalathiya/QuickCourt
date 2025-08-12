package com.odoo.Quickcourt.Dto.PricingRule;

import com.odoo.Quickcourt.Entities.PricingRule;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingRuleRequest {

    @NotNull
    private UUID courtId;

    @NotBlank
    private String name;

    @NotNull
    private PricingRule.RuleType type;

    @NotNull
    private PricingRule.AdjustmentType adjustmentType;

    @NotNull
    private BigDecimal adjustmentValue;

    private List<PricingRule.DayOfWeek> applicableDays;

    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate startDate;
    private LocalDate endDate;

    private Boolean active = true;
    private Integer priority;
}