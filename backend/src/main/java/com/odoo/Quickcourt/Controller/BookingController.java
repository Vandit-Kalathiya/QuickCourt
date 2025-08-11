package com.odoo.Quickcourt.Controller;

// controller/BookingController.java

import com.odoo.Quickcourt.Dto.Booking.BookingRequest;
import com.odoo.Quickcourt.Dto.Booking.BookingResponse;
import com.odoo.Quickcourt.Dto.Payment.CreateOrderResponse;
import com.odoo.Quickcourt.Dto.Payment.PaymentResponse;
import com.odoo.Quickcourt.Entities.Payment;
import com.odoo.Quickcourt.Repository.PaymentRepository;
import com.odoo.Quickcourt.Services.BookingService;
import com.odoo.Quickcourt.Services.PaymentService;
import com.razorpay.Utils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management APIs")
public class BookingController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Create a new booking")
    public ResponseEntity<CreateOrderResponse> createBooking(@Valid @RequestBody BookingRequest request) throws BadRequestException {
        CreateOrderResponse response = bookingService.createBooking(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/payment-callback", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> paymentCallback(
            @RequestParam("razorpay_order_id") String orderId,
            @RequestParam("razorpay_payment_id") String paymentId,
            @RequestParam("razorpay_signature") String signature) {
        Map<String, Object> response = new HashMap<>();
        try {
            String payload = orderId + "|" + paymentId;
            boolean isValid = Utils.verifySignature(payload, signature, keySecret);

            if (isValid) {
//                Order order = orderRepository.findByRazorpayOrderId(orderId);
                Payment payment = paymentService.getPaymentByRazorpayOrderId(orderId);
                System.out.println("Payment: " + payment);
                if (payment != null && Payment.PaymentStatus.CREATED.equals(payment.getStatus())) {
                    payment.setRazorpayPaymentId(paymentId);
                    payment.setRazorpaySignature(signature);
                    payment.setStatus(Payment.PaymentStatus.AUTHORIZED);
                    paymentRepository.save(payment);
                    response.put("success", true);
                    response.put("message", "Payment authorized, awaiting delivery");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Order not found or already processed");
                    return ResponseEntity.status(404).body(response);
                }
            } else {
                response.put("success", false);
                response.put("message", "Payment verification failed");
                return ResponseEntity.status(400).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error in payment callback: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping(value = "/verify-payment/{orderId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> verifyDelivery(
            @PathVariable("orderId") String orderId) {
        Map<String, Object> response = new HashMap<>();
        try {
            paymentService.verifyAndReleasePayment(orderId);
            response.put("success", true);
            response.put("message", "Delivery verified, payment released to farmer");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to verify delivery: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Get user's bookings")
    public ResponseEntity<Page<BookingResponse>> getUserBookings(Pageable pageable) {
        Page<BookingResponse> bookings = bookingService.getUserBookings(pageable);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<String> cancelBooking(@PathVariable UUID id) throws BadRequestException {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}
