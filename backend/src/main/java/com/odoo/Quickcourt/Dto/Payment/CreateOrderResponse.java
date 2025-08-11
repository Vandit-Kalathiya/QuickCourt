package com.odoo.Quickcourt.Dto.Payment;

// dto/payment/CreateOrderResponse.java
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderResponse {
    private String razorpayOrderId;
    private Long amount;
    private String currency;
    private String keyId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String transactionId;
    private String description;
    private String callbackUrl;
}

