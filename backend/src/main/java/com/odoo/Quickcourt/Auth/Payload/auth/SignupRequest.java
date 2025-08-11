package com.odoo.Quickcourt.Auth.Payload.auth;

import com.odoo.Quickcourt.Auth.Entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 2, max = 50)
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String role;
}
