package com.odoo.Quickcourt.Dto.Payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class CreateOrderRequest {
    @NotNull
    private UUID bookingId;

    @NotNull
    @DecimalMin("1.0")
    private BigDecimal amount;

    private String description;
    private String currency;
    private String userId;
    private String ownerId;
}

