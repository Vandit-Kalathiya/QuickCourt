package com.odoo.Quickcourt.Dto.Court;

// dto/court/CourtRequest.java

import com.odoo.Quickcourt.Entities.Facility;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
public class CourtRequest {
    @NotBlank
    private String name;

    @NotNull
    private String sportType;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal pricePerHour;

    @NotNull
    private LocalTime openingTime;

    @NotNull
    private LocalTime closingTime;
}
