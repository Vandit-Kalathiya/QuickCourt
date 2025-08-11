package com.odoo.Quickcourt.Services;

// service/EmailService.java

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

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
}
