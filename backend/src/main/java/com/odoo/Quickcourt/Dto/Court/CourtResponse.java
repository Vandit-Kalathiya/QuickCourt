package com.odoo.Quickcourt.Dto.Court;

// dto/court/CourtResponse.java

import com.odoo.Quickcourt.Entities.Facility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtResponse {
    private UUID id;
    private UUID facilityId;
    private String name;
    private Facility.Sport sportType;
    private BigDecimal pricePerHour;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private Boolean active;
}
