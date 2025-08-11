package com.odoo.Quickcourt.Dto.Booking;

// dto/booking/BookingResponse.java

import com.odoo.Quickcourt.Entities.Booking.Booking;
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
public class BookingResponse {
    private UUID id;
    private UUID userId;
    private UUID courtId;
    private UUID facilityId;
    private String facilityName;
    private String courtName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String currency = "INR";
    private BigDecimal totalPrice;
    private Booking.BookingStatus status;
    private LocalDateTime createdAt;
    private List<String> amenities;
    private int duration;

    private String sportType; // Assuming this is a string representation of the sport type
    private String facilityAddress;
    private String facilityPhone;
}
