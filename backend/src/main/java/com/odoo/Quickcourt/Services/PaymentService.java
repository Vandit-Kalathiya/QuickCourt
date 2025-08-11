package com.odoo.Quickcourt.Services;

import com.odoo.Quickcourt.Auth.Entities.User;
import com.odoo.Quickcourt.Auth.Entities.UserPrincipal;
import com.odoo.Quickcourt.Auth.Repository.UserRepository;
import com.odoo.Quickcourt.Dto.Payment.CreateOrderRequest;
import com.odoo.Quickcourt.Dto.Payment.CreateOrderResponse;
import com.odoo.Quickcourt.Dto.Payment.PaymentResponse;
import com.odoo.Quickcourt.Dto.Payment.PaymentVerificationRequest;
import com.odoo.Quickcourt.Entities.Booking;
import com.odoo.Quickcourt.Exception.BadRequestException;
import com.odoo.Quickcourt.Exception.ResourceNotFoundException;
import com.odoo.Quickcourt.Repository.BookingRepository;
import com.odoo.Quickcourt.Repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RazorpayClient razorpayClient;
    private final EmailService emailService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @Value("${app.frontend.base.url}")
    private String frontendBaseUrl;

    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        try {
            UserPrincipal userPrincipal = getCurrentUser();

            // Validate booking
            Booking booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

            if (!booking.getUserId().equals(userPrincipal.getId())) {
                throw new BadRequestException("Not authorized for this booking");
            }

            // Check if payment already exists
            if (paymentRepository.findByBookingId(request.getBookingId()).isPresent()) {
                throw new BadRequestException("Payment already initiated for this booking");
            }

            // Get user details
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Create Razorpay order
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount().multiply(BigDecimal.valueOf(100)).intValue()); // Convert to paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + request.getBookingId());

            // Add notes
            JSONObject notes = new JSONObject();
            notes.put("booking_id", request.getBookingId().toString());
            notes.put("user_id", userPrincipal.getId().toString());
            orderRequest.put("notes", notes);

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            // Save payment record
            com.odoo.Quickcourt.Entities.Payment payment = com.odoo.Quickcourt.Entities.Payment.builder()
                    .bookingId(request.getBookingId())
                    .amount(request.getAmount())
                    .status(com.odoo.Quickcourt.Entities.Payment.PaymentStatus.CREATED)
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .customerEmail(user.getEmail())
                    .customerPhone(request.getCustomerPhone())
                    .build();

            paymentRepository.save(payment);

            log.info("Razorpay order created: {} for booking: {}", razorpayOrder.get("id"), request.getBookingId());

            return CreateOrderResponse.builder()
                    .orderId(razorpayOrder.get("id"))
                    .amount(request.getAmount())
                    .currency("INR")
                    .keyId(keyId)
                    .customerName(user.getName())
                    .customerEmail(user.getEmail())
                    .customerPhone(request.getCustomerPhone())
                    .description("Sports Facility Booking Payment")
                    .callbackUrl(frontendBaseUrl + "/payment/callback")
                    .build();

        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order", e);
            throw new BadRequestException("Failed to create payment order: " + e.getMessage());
        }
    }

    public PaymentResponse verifyPayment(PaymentVerificationRequest request) {
        try {
            // Verify signature
            if (!verifySignature(request)) {
                throw new BadRequestException("Invalid payment signature");
            }

            // Get payment record
            com.odoo.Quickcourt.Entities.Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

            // Fetch payment details from Razorpay
            Payment razorpayPayment = razorpayClient.payments.fetch(request.getRazorpayPaymentId());

            // Update payment record
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            payment.setStatus(com.odoo.Quickcourt.Entities.Payment.PaymentStatus.AUTHORIZED);
            payment.setPaymentMethod(razorpayPayment.get("method"));

            // Auto-capture the payment
            if ("authorized".equals(razorpayPayment.get("status"))) {
                JSONObject captureRequest = new JSONObject();
                Object amountObj = razorpayPayment.get("amount");
                if (amountObj instanceof Number) {
                    captureRequest.put("amount", ((Number) amountObj).longValue());
                } else {
                    throw new IllegalArgumentException("Amount is not a valid number");
                }

                captureRequest.put("currency", "INR");

                Payment capturedPayment = razorpayClient.payments.capture(request.getRazorpayPaymentId(), captureRequest);

                if ("captured".equals(capturedPayment.get("status"))) {
                    payment.setStatus(com.odoo.Quickcourt.Entities.Payment.PaymentStatus.COMPLETED);
                    payment.setPaidAt(LocalDateTime.now());

                    // Update booking status to CONFIRMED
                    Booking booking = bookingRepository.findById(payment.getBookingId())
                            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                    booking.setStatus(Booking.BookingStatus.CONFIRMED);
                    bookingRepository.save(booking);

                    // Send confirmation email
                    emailService.sendBookingConfirmationEmail(payment.getCustomerEmail(),
                            "Your booking has been confirmed. Payment ID: " + request.getRazorpayPaymentId());
                }
            }

            payment = paymentRepository.save(payment);

            log.info("Payment verified and captured: {} for order: {}",
                    request.getRazorpayPaymentId(), request.getRazorpayOrderId());

            return mapToResponse(payment);

        } catch (RazorpayException e) {
            log.error("Error verifying payment", e);
            throw new BadRequestException("Failed to verify payment: " + e.getMessage());
        }
    }

    public PaymentResponse handlePaymentFailure(String razorpayOrderId, String failureReason) {
        com.odoo.Quickcourt.Entities.Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setStatus(com.odoo.Quickcourt.Entities.Payment.PaymentStatus.FAILED);
        payment.setFailureReason(failureReason);

        // Update booking status to CANCELLED
        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        payment = paymentRepository.save(payment);

        // Send failure notification email
        emailService.sendBookingCancellationEmail(payment.getCustomerEmail(),
                "Your booking payment failed. Reason: " + failureReason);

        log.info("Payment marked as failed: {} for order: {}", failureReason, razorpayOrderId);

        return mapToResponse(payment);
    }

    public PaymentResponse processRefund(UUID bookingId) {
        com.odoo.Quickcourt.Entities.Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() != com.odoo.Quickcourt.Entities.Payment.PaymentStatus.COMPLETED) {
            throw new BadRequestException("Cannot refund non-captured payment");
        }

        try {
            // Create refund request
            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", payment.getAmount().multiply(BigDecimal.valueOf(100)).intValue());
            refundRequest.put("speed", "normal");

            JSONObject notes = new JSONObject();
            notes.put("reason", "Booking cancellation");
            notes.put("booking_id", bookingId.toString());
            refundRequest.put("notes", notes);

            // Process refund via Razorpay
            razorpayClient.payments.refund(payment.getRazorpayPaymentId(), refundRequest);

            // Update payment status
            payment.setStatus(com.odoo.Quickcourt.Entities.Payment.PaymentStatus.REFUNDED);
            payment = paymentRepository.save(payment);

            log.info("Refund processed for payment: {}", payment.getRazorpayPaymentId());

            return mapToResponse(payment);

        } catch (RazorpayException e) {
            log.error("Error processing refund", e);
            throw new BadRequestException("Failed to process refund: " + e.getMessage());
        }
    }

    public PaymentResponse getPaymentByBookingId(UUID bookingId) {
        com.odoo.Quickcourt.Entities.Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        return mapToResponse(payment);
    }

    // Webhook handler for payment status updates
    public void handleWebhook(String payload, String signature) {
        try {
            // Verify webhook signature
            if (!verifyWebhookSignature(payload, signature)) {
                throw new BadRequestException("Invalid webhook signature");
            }

            JSONObject webhook = new JSONObject(payload);
            String event = webhook.getString("event");
            JSONObject payloadData = webhook.getJSONObject("payload");
            JSONObject paymentEntity = payloadData.getJSONObject("payment").getJSONObject("entity");

            String razorpayPaymentId = paymentEntity.getString("id");

            // Find payment record
            com.odoo.Quickcourt.Entities.Payment payment = paymentRepository.findByRazorpayPaymentId(razorpayPaymentId)
                    .orElse(null);

            if (payment != null) {
                switch (event) {
                    case "payment.captured":
                        payment.setStatus(com.odoo.Quickcourt.Entities.Payment.PaymentStatus.COMPLETED);
                        payment.setPaidAt(LocalDateTime.now());
                        break;
                    case "payment.failed":
                        payment.setStatus(com.odoo.Quickcourt.Entities.Payment.PaymentStatus.FAILED);
                        payment.setFailureReason(paymentEntity.optString("error_description"));
                        break;
                    default:
                        log.info("Unhandled webhook event: {}", event);
                        return;
                }

                paymentRepository.save(payment);
                log.info("Payment status updated via webhook: {} - {}", razorpayPaymentId, event);
            }

        } catch (Exception e) {
            log.error("Error processing webhook", e);
        }
    }

    private boolean verifySignature(PaymentVerificationRequest request) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
            attributes.put("razorpay_signature", request.getRazorpaySignature());

            return Utils.verifyPaymentSignature(attributes, keySecret);
        } catch (RazorpayException e) {
            log.error("Error verifying signature", e);
            return false;
        }
    }

    private boolean verifyWebhookSignature(String payload, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);

            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return signature.equals(hexString.toString());
        } catch (Exception e) {
            log.error("Error verifying webhook signature", e);
            return false;
        }
    }

    private PaymentResponse mapToResponse(com.odoo.Quickcourt.Entities.Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBookingId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .paymentMethod(payment.getPaymentMethod())
                .paidAt(payment.getPaidAt())
                .failureReason(payment.getFailureReason())
                .build();
    }

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
