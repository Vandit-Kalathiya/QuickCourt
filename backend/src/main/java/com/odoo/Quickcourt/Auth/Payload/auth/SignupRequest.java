package com.odoo.Quickcourt.Auth.Payload.auth;
//
//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.Size;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//// SignUp Request DTO
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class SignUpRequest {
//
//    @NotBlank(message = "Username is required")
//    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
//    private String username;
//
//    @NotBlank(message = "Email is required")
//    @Email(message = "Please provide a valid email address")
//    private String email;
//
//    @NotBlank(message = "Full name is required")
//    @Size(min = 2, max = 50, message = "Full name must be between 2 and 50 characters")
//    private String fullName;
//
//    @NotBlank(message = "Password is required")
//    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
//    private String password;
//}
// dto/auth/SignupRequest.java

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
    @Size(min = 6, max = 20)
    private String password;

    private User.Role role = User.Role.USER;
}
