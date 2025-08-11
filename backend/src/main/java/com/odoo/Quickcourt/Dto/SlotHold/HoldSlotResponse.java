package com.odoo.Quickcourt.Dto.SlotHold;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class HoldSlotResponse {
    private UUID holdId;
    private LocalDateTime expiresAt;
    private String message;
}