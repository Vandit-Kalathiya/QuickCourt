package com.odoo.Quickcourt.Auth.Entities;
// entity/Otp.java

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Otp extends BaseEntity {

    @NotNull
    @Column(nullable = false)
    private UUID userId;

    @NotBlank
    @Column(nullable = false)
    private String code;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Builder.Default
    private Boolean used = false;
}
