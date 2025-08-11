package com.odoo.Quickcourt.Dto.Payment;

// dto/payment/PaymentResponse.java
import com.odoo.Quickcourt.Entities.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private UUID id;
    private UUID bookingId;
    private BigDecimal amount;
    private Payment.PaymentStatus status;
    private String razorpayOrderId;
    private String razorpaySignature;
    private String razorpayPaymentId;
    private String paymentMethod;
    private LocalDateTime paidAt;
    private String failureReason;
}
