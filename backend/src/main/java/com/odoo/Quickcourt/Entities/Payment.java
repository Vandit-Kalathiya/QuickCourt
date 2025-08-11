package com.odoo.Quickcourt.Entities;

// entity/Payment.java

import com.odoo.Quickcourt.Auth.Entities.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @NotNull
    @Column(nullable = false)
    private UUID bookingId;

    @NotNull
    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    private String paymentMethod;

    private String transactionId;

    // Razorpay specific fields
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private String failureReason;
    private LocalDateTime paidAt;

    // Additional metadata
    private String customerEmail;
    private String customerPhone;

    public enum PaymentStatus {
        PENDING, CREATED, AUTHORIZED, COMPLETED, FAILED, REFUNDED
    }
}

