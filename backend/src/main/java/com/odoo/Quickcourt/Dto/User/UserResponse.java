package com.odoo.Quickcourt.Dto.User;

// dto/user/UserResponse.java

import com.odoo.Quickcourt.Auth.Entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private User.Role role;
    private Boolean verified;
    private Boolean banned;
    private LocalDateTime createdAt;
}
