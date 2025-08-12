package com.odoo.Quickcourt.Entities;

import com.odoo.Quickcourt.Auth.Entities.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pricing_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingRule extends BaseEntity {

    @NotNull
    @Column(nullable = false)
    private UUID facilityId;

    @NotNull
    @Column(nullable = false)
    private UUID courtId;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RuleType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdjustmentType adjustmentType;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal adjustmentValue;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<DayOfWeek> applicableDays;

    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate startDate;
    private LocalDate endDate;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    private Integer priority; // For rule precedence

    public enum RuleType {
        PEAK_HOURS, WEEKEND, SEASONAL, HOLIDAY, BULK_BOOKING, EARLY_BIRD, LATE_NIGHT
    }

    public enum AdjustmentType {
        PERCENTAGE, FIXED_AMOUNT
    }

    public enum DayOfWeek {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }
}