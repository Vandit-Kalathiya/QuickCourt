package com.odoo.Quickcourt.Dto.SlotHold;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class HoldSlotRequest {

    @NotNull
    private UUID courtId;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;
}


