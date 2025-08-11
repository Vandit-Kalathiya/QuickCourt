package com.odoo.Quickcourt.Entities.Booking;

// entity/Booking.java

import com.odoo.Quickcourt.Auth.Entities.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @NotNull
    @Column(nullable = false)
    private UUID userId;

    @NotNull
    @Column(nullable = false)
    private UUID courtId;

    @NotNull
    @Column(nullable = false)
    private UUID facilityId;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    @NotNull
    @Column(nullable = false)
    private LocalTime startTime;

    @NotNull
    @Column(nullable = false)
    private LocalTime endTime;

    @NotNull
    @Column(nullable = false)
    private BigDecimal totalPrice;

    private String razorpayOrderId;

    @Column(name = "status", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatus status = BookingStatus.CREATED;

    private UUID payment;

    public enum BookingStatus {
        CREATED, CANCELLED, COMPLETED
    }
}
