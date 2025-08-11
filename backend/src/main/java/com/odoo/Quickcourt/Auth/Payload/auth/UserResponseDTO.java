package com.odoo.Quickcourt.Auth.Payload.auth;

import com.odoo.Quickcourt.Auth.Entities.UserRole;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private UserRole role;
    private Boolean isActive;
    private Boolean isBanned;
    private String avatarUrl;
    private String bio;
    private Integer reputationScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}