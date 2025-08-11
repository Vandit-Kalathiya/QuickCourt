package com.odoo.Quickcourt.Services;

// service/PaymentService.java

import com.odoo.Quickcourt.Entities.Payment;
import com.odoo.Quickcourt.Repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public Payment processPayment(UUID bookingId, BigDecimal amount) {
        // Simulate payment processing
        Payment payment = Payment.builder()
                .bookingId(bookingId)
                .amount(amount)
                .status(Payment.PaymentStatus.COMPLETED)
                .paymentMethod("CREDIT_CARD")
                .transactionId("TXN_" + UUID.randomUUID().toString().substring(0, 8))
                .build();

        payment = paymentRepository.save(payment);
        log.info("Payment processed successfully for booking {}, amount: {}", bookingId, amount);

        return payment;
    }

    public void processRefund(UUID bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking: " + bookingId));

        // Simulate refund processing
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        paymentRepository.save(payment);

        log.info("Refund processed successfully for booking {}", bookingId);
    }

    public Payment getPaymentByBookingId(UUID bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElse(null);
    }
}
