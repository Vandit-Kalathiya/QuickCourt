package com.odoo.Quickcourt.Entities;

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

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatus status = BookingStatus.CONFIRMED;

    private UUID payment;

    public enum BookingStatus {
        CONFIRMED, CANCELLED, COMPLETED
    }
}
