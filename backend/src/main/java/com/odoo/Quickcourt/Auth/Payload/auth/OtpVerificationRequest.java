package com.odoo.Quickcourt.Auth.Payload.auth;
// dto/auth/OtpVerificationRequest.java

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OtpVerificationRequest {

    private String email;

    private String otp;
}
