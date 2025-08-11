package com.odoo.Quickcourt.Entities;
// entity/Court.java

import com.odoo.Quickcourt.Auth.Entities.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "courts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Court extends BaseEntity {

    @NotNull
    @Column(nullable = false)
    private UUID facilityId;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Facility.Sport sportType;

    @NotNull
    @DecimalMin("0.0")
    @Column(nullable = false)
    private BigDecimal pricePerHour;

    @NotNull
    @Column(nullable = false)
    private LocalTime openingTime;

    @NotNull
    @Column(nullable = false)
    private LocalTime closingTime;

    @Builder.Default
    private Boolean active = true;
}
