package com.odoo.Quickcourt.Auth.Controllers;
// controller/AuthController.java

import com.odoo.Quickcourt.Auth.Entities.User;
import com.odoo.Quickcourt.Auth.Payload.auth.*;
import com.odoo.Quickcourt.Auth.Repository.UserRepository;
import com.odoo.Quickcourt.Auth.Services.AuthService;
import com.odoo.Quickcourt.Auth.Services.OtpService;
import com.odoo.Quickcourt.Auth.Utills.JwtTokenProvider;
import com.odoo.Quickcourt.Auth.Utills.JwtUtils;
import com.odoo.Quickcourt.Services.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;
    private final OtpService otpService;
    private final JwtTokenProvider jwtHelper;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest,
                                          BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Validation failed", errors));
        }

        try {
            AuthResponse response = authService.signup(signUpRequest);
            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) throws BadRequestException {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/email/send")
    public ResponseEntity<String> sendEmailOtp(@RequestParam String email) {
        String otp = otpService.sendEmailOtp(email);
        return ResponseEntity.ok("OTP sent successfully to " + email + ". Please check your SMS.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@RequestBody OtpVerificationRequest request) throws BadRequestException {
        if(!otpService.verifyOtp(request.getEmail(),  request.getOtp()))
        {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Invalid OTP or OTP expired.")
                            .build());
        }
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("OTP verified successfully.")
                        .build()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        // Extract token from the Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7); // Remove "Bearer "

        // Extract username from token
        String username = jwtHelper.getUserIdFromToken(token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // Fetch user from DB
        User user = userRepository.findById(UUID.fromString(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(user);
    }

//    get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}

//
//import com.odoo.Quickcourt.Auth.Entities.User;
//import com.odoo.Quickcourt.Auth.Payload.auth.*;
//import com.odoo.Quickcourt.Auth.Repository.UserRepository;
//import com.odoo.Quickcourt.Auth.Services.AuthService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.validation.BindingResult;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/auth")
//@CrossOrigin(origins = "*", maxAge = 3600)
//public class AuthController {
//
//    @Autowired
//    private AuthService authService;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest,
//                                          BindingResult bindingResult) {
//        if (bindingResult.hasErrors()) {
//            List<String> errors = bindingResult.getFieldErrors()
//                    .stream()
//                    .map(error -> error.getDefaultMessage())
//                    .collect(Collectors.toList());
//            return ResponseEntity.badRequest()
//                    .body(new ApiResponse(false, "Validation failed", errors));
//        }
//
//        try {
//            AuthResponse response = authService.signup(signUpRequest);
//            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully", response));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(new ApiResponse(false, e.getMessage(), null));
//        }
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest,
//                                              BindingResult bindingResult) {
//        if (bindingResult.hasErrors()) {
//            List<String> errors = bindingResult.getFieldErrors()
//                    .stream()
//                    .map(error -> error.getDefaultMessage())
//                    .collect(Collectors.toList());
//            return ResponseEntity.badRequest()
//                    .body(new ApiResponse(false, "Validation failed", errors));
//        }
//
//        try {
//            AuthResponse response = authService.login(loginRequest);
//            return ResponseEntity.ok(new ApiResponse(true, "User logged in successfully", response));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(new ApiResponse(false, "Invalid credentials", null));
//        }
//    }
//
//    @GetMapping("/me")
////    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
//    public ResponseEntity<?> getCurrentUser() {
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        UserProfileResponse profile = new UserProfileResponse(
//                user.getId(),
//                "aehda",//username
//                user.getEmail(),
////                user.getDisplayName(),
//                "jhdsd",
//                user.getRole().name()
//        );
//
//
//
//        return ResponseEntity.ok(new ApiResponse(true, "User profile retrieved", profile));
//    }
//
//    @GetMapping("/getuser/{id}")
//    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
//
//        return ResponseEntity.ok(authService.getCurrentUserDetails());
//
//    }
//
//    @GetMapping("/admin")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<?> adminOnly() {
//        return ResponseEntity.ok(new ApiResponse(true, "Admin access granted", "Admin content"));
//    }
//
//    @GetMapping("/user")
//    @PreAuthorize("hasRole('USER')")
//    public ResponseEntity<?> userOnly() {
//        return ResponseEntity.ok(new ApiResponse(true, "User access granted", "User content"));
//    }
//
//    @GetMapping("/admin/users")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<?> getAllUsers() {
//        List<User> users = userRepository.findAll();
//        List<UserProfileResponse> userProfiles = users.stream()
//                .map(user -> new UserProfileResponse(
//                        user.getId(),
//                        user.getUsername(),
//                        user.getEmail(),
//                        user.getDisplayName(),
//                        user.getRole().name()
//                ))
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(new ApiResponse(true, "Users retrieved successfully", userProfiles));
//    }
//}