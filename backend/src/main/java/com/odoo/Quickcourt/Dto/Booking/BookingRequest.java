package com.odoo.Quickcourt.Dto.Booking;

// dto/booking/BookingRequest.java

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class BookingRequest {
    @NotNull
    private UUID courtId;

    @NotNull
    @FutureOrPresent
    private LocalDate date;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    private Long amount;
}
