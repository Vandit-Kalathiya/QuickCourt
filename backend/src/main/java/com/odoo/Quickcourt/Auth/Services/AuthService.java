package com.odoo.Quickcourt.Auth.Services;
// service/AuthService.java

import com.odoo.Quickcourt.Auth.Entities.User;
import com.odoo.Quickcourt.Auth.Payload.auth.AuthResponse;
import com.odoo.Quickcourt.Auth.Payload.auth.LoginRequest;
import com.odoo.Quickcourt.Auth.Payload.auth.OtpVerificationRequest;
import com.odoo.Quickcourt.Auth.Payload.auth.SignupRequest;
import com.odoo.Quickcourt.Auth.Repository.UserRepository;
import com.odoo.Quickcourt.Auth.Utills.JwtTokenProvider;
import com.odoo.Quickcourt.Exception.ResourceNotFoundException;
import com.odoo.Quickcourt.Services.EmailService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    @Value("${app.otp.expiration}")
    private int otpExpirationMinutes;

    public AuthResponse signup(SignupRequest request) throws BadRequestException {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .verified(false)
                .banned(false)
                .build();

        user = userRepository.save(user);

        // Generate and send OTP
        generateAndSendOtp(user);
        return null;
    }

    public void verifyOtp(OtpVerificationRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

//        Otp otp = otpRepository.findByUserIdAndCodeAndUsedFalseAndExpiresAtAfter(
//                        user.getId(), request.getOtp(), LocalDateTime.now())
//                .orElseThrow(() -> new BadRequestException("Invalid or expired OTP"));
//
//        otp.setUsed(true);
//        user.setVerified(true);
//
//        otpRepository.save(otp);
//        userRepository.save(user);
//
//        // Clean up expired OTPs
//        otpRepository.deleteByUserId(user.getId());
    }

    public AuthResponse login(LoginRequest request) throws BadRequestException {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!user.getVerified()) {
            throw new BadRequestException("Account not verified");
        }

        if (user.getBanned()) {
            throw new BadRequestException("Account is banned");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .verified(user.getVerified())
                .build();
    }

    private void generateAndSendOtp(User user) {
        // Delete existing OTPs
//        otpRepository.deleteByUserId(user.getId());
//
//        // Generate new OTP
//        String code = String.format("%06d", new Random().nextInt(999999));
//
//        Otp otp = Otp.builder()
//                .userId(user.getId())
//                .code(code)
//                .expiresAt(LocalDateTime.now().plusMinutes(otpExpirationMinutes))
//                .used(false)
//                .build();
//
//        otpRepository.save(otp);
//
//        // Send OTP via email
//        emailService.sendOtpEmail(user.getEmail(), code);
    }
}

//
//import com.odoo.Quickcourt.Auth.Entities.User;
//import com.odoo.Quickcourt.Auth.Entities.UserRole;
//import com.odoo.Quickcourt.Auth.Payload.auth.AuthResponse;
//import com.odoo.Quickcourt.Auth.Payload.auth.LoginRequest;
//import com.odoo.Quickcourt.Auth.Payload.auth.SignUpRequest;
//import com.odoo.Quickcourt.Auth.Payload.auth.UserResponseDTO;
//import com.odoo.Quickcourt.Auth.Repository.UserRepository;
//import com.odoo.Quickcourt.Auth.Utills.JwtUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AuthService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Autowired
//    private AuthenticationManager authenticationManager;
//
//    @Autowired
//    private JwtUtils jwtUtils;
//
//    public AuthResponse signup(SignUpRequest request) {
//        // Check if username already exists
//        if (userRepository.existsByUsername(request.getUsername())) {
//            throw new RuntimeException("Username is already taken!");
//        }
//
//        // Check if email already exists
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new RuntimeException("Email is already in use!");
//        }
//
//        // Create new user
//        User user = new User();
//        user.setUsername(request.getUsername());
//        user.setEmail(request.getEmail());
//        user.setDisplayName(request.getFullName());
//        user.setPassword(passwordEncoder.encode(request.getPassword()));
//        user.setRole(UserRole.USER); // Default role
//
//        User savedUser = userRepository.save(user);
//
//        // Generate JWT token
//        String token = jwtUtils.generateToken(savedUser.getEmail());
//
//        return new AuthResponse(
//                token,
//                "Bearer",
//                savedUser.getUsername(),
//                savedUser.getEmail(),
//                savedUser.getDisplayName(),
//                savedUser.getRole().name(),
//                savedUser.getId()
//        );
//    }
//
//    public AuthResponse login(LoginRequest request) {
//        // Authenticate user
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(request.getLogin(), request.getPassword())
//        );
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        // Generate JWT token
//        String token = jwtUtils.generateToken(authentication);
//
//        // Get user details
//        User user = userRepository.findByUsernameOrEmail(request.getLogin(), request.getLogin())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        return new AuthResponse(
//                token,
//                "Bearer",
//                user.getUsername(),
//                user.getEmail(),
//                user.getDisplayName(),
//                user.getRole().name(),
//                user.getId()
//        );
//    }
//
//    public UserResponseDTO getCurrentUserDetails() {
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        System.out.println(email);
//        User user = userRepository.findByEmailOrUsername(email,email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        return mapToDto(user);
//    }
//
//    private UserResponseDTO mapToDto(User user) {
//        UserResponseDTO dto = new UserResponseDTO();
//        dto.setId(user.getId());
//        dto.setUsername(user.getUsername());
//        dto.setEmail(user.getEmail());
//        dto.setDisplayName(user.getDisplayName());
//        dto.setRole(user.getRole());
//        dto.setIsActive(user.getIsActive());
//        dto.setIsBanned(user.getIsBanned());
//        dto.setAvatarUrl(user.getAvatarUrl());
//        dto.setBio(user.getBio());
//        dto.setReputationScore(user.getReputationScore());
//        dto.setCreatedAt(user.getCreatedAt());
//        dto.setUpdatedAt(user.getUpdatedAt());
//        return dto;
//    }
//}