package com.odoo.Quickcourt.Services;

// service/EmailService.java

import com.odoo.Quickcourt.Auth.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

//    @Async
    public String sendOtpEmail(String toEmail) {
        try {
            SecureRandom random = new SecureRandom();
            StringBuilder otp = new StringBuilder();
            for (int i = 0; i < 6; i++) {
                otp.append(random.nextInt(10));
            }
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Sports Booking Platform - Verify Your Account");
            message.setText("Your OTP for account verification is: " + otp +
                    "\n\nThis OTP will expire in 5 minutes." +
                    "\n\nIf you didn't request this, please ignore this email.");

            mailSender.send(message);
            log.info("OTP email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", toEmail, e);
        }
        return toEmail;
    }

    @Async
    public void sendBookingConfirmationEmail(String toEmail, String bookingDetails) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Booking Confirmation - Sports Facility");
            message.setText("Your booking has been confirmed!\n\n" + bookingDetails);

            mailSender.send(message);
            log.info("Booking confirmation email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email to {}", toEmail, e);
        }
    }

    @Async
    public void sendBookingCancellationEmail(String toEmail, String bookingDetails) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Booking Cancellation - Sports Facility");
            message.setText("Your booking has been cancelled.\n\n" + bookingDetails);

            mailSender.send(message);
            log.info("Booking cancellation email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send booking cancellation email to {}", toEmail, e);
        }
    }

    @Async
    public void sendFacilityCreationNotificationToAdmins(String facilityName, String ownerName, String ownerEmail, String facilityAddress) {
        try {
            log.info("Sending facility creation notification for facility: {}", facilityName);
            
            String subject = "New Facility Pending Approval - QuickCourt";
            String emailBody = String.format(
                "Dear Admin,\n\n" +
                "A new facility has been created and is pending your approval.\n\n" +
                "Facility Details:\n" +
                "- Facility Name: %s\n" +
                "- Owner Name: %s\n" +
                "- Owner Email: %s\n" +
                "- Address: %s\n\n" +
                "Please log in to the admin panel to review and approve/reject this facility.\n\n" +
                "Best regards,\n" +
                "QuickCourt System",
                facilityName, ownerName, ownerEmail, facilityAddress
            );

            // Get all admin emails from database
            List<String> adminEmails = getAdminEmails();
            
            if (adminEmails.isEmpty()) {
                log.warn("No admin emails found. Facility creation notification not sent for: {}", facilityName);
                return;
            }
            
            log.info("Found {} admin(s) to notify", adminEmails.size());
            
            for (String adminEmail : adminEmails) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(adminEmail);
                message.setSubject(subject);
                message.setText(emailBody);

                mailSender.send(message);
                log.info("Facility creation notification email sent to admin: {}", adminEmail);
            }
            
            log.info("Successfully sent facility creation notifications for: {}", facilityName);
        } catch (Exception e) {
            log.error("Failed to send facility creation notification emails for facility: {}", facilityName, e);
        }
    }

    private List<String> getAdminEmails() {
        try {
            List<String> adminEmails = userRepository.findAllActiveAdmins()
                    .stream()
                    .map(user -> user.getEmail())
                    .toList();
            
            if (adminEmails.isEmpty()) {
                log.warn("No active admin users found in database");
            }
            
            return adminEmails;
        } catch (Exception e) {
            log.error("Error fetching admin emails from database", e);
            return List.of(); // Return empty list if there's an error
        }
    }

    // Method to test admin email functionality - can be called from a test endpoint
    public void testAdminEmailNotification() {
        log.info("Testing admin email notification system...");
        List<String> adminEmails = getAdminEmails();
        
        if (adminEmails.isEmpty()) {
            log.warn("No admin users found for testing. Please create an admin user first.");
            log.info("To create an admin user, insert a user with role='ADMIN' in the users table");
        } else {
            log.info("Found {} admin user(s): {}", adminEmails.size(), adminEmails);
            sendFacilityCreationNotificationToAdmins(
                "Test Facility", 
                "Test Owner", 
                "test@example.com", 
                "Test Address"
            );
        }
    }
}
