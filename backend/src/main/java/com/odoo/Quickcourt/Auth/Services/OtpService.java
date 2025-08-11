package com.odoo.Quickcourt.Auth.Services;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final int OTP_LENGTH = 4;
    private static final int OTP_EXPIRY_MINUTES = 5;

    // in-memory store: key = email, value = OtpData
    private final ConcurrentHashMap<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public String sendEmailOtp(String email) {
        String otp = generateOtp();

        otpStorage.put(email, new OtpData(otp, System.currentTimeMillis() + OTP_EXPIRY_MINUTES * 60 * 1000));

        scheduler.schedule(() -> otpStorage.remove(email), OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Your Verification Code");
            helper.setText("<p>Your OTP is: <b>" + otp + "</b></p><p>Expires in " + OTP_EXPIRY_MINUTES + " minutes.</p>", true);

            mailSender.send(message);
            return otp;
        } catch (Exception e) {
            otpStorage.remove(email);
            throw new RuntimeException("Failed to send email OTP: " + e.getMessage());
        }
    }

    public boolean verifyOtp(String email, String providedOtp) {
        OtpData stored = otpStorage.get(email);

        if (stored == null) {
            return false;
        }
        if (System.currentTimeMillis() > stored.expiryTime) {
            otpStorage.remove(email);
            return false;
        }
        if (stored.otp.equals(providedOtp)) {
            otpStorage.remove(email); // delete once verified
            System.out.println("true");
            return true;
        }
        System.out.println("false");
        return false;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    private static class OtpData {
        private final String otp;
        private final long expiryTime;

        public OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}

