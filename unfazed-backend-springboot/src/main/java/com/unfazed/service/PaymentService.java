package com.unfazed.service;

import com.unfazed.dto.DTOs.PaymentOrderResponse;
import com.unfazed.entity.Client;
import com.unfazed.entity.Payment;
import com.unfazed.entity.SessionBooking;
import com.unfazed.entity.Therapist;
import com.unfazed.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private NotificationService notificationService;

    public PaymentOrderResponse createPaymentOrder(Double amount) {
        String mockOrderId = "order_" + UUID.randomUUID().toString().substring(0, 14);
        return PaymentOrderResponse.builder()
                .orderId(mockOrderId)
                .amount(amount)
                .currency("INR")
                .razorpayKeyId(razorpayKeyId)
                .build();
    }

    public Payment recordPayment(Therapist therapist, Client client, SessionBooking booking, Double grossAmount, String paymentMethod, String txnId) {
        double gst = grossAmount * 0.18;
        double platformFee = grossAmount * 0.05;
        double net = grossAmount + gst;

        String invoiceNo = "INV-" + System.currentTimeMillis() / 1000;
        String transactionId = txnId != null ? txnId : "pay_" + UUID.randomUUID().toString().substring(0, 12);

        Payment payment = Payment.builder()
                .therapist(therapist)
                .client(client)
                .sessionBooking(booking)
                .gatewayTransactionId(transactionId)
                .grossAmount(grossAmount)
                .gstAmount(gst)
                .platformFee(platformFee)
                .netAmount(net)
                .invoiceNumber(invoiceNo)
                .status("SUCCESS")
                .paymentMethod(paymentMethod != null ? paymentMethod : "UPI")
                .build();

        Payment saved = paymentRepository.save(payment);
        logger.info("Payment recorded successfully with Invoice No: {}", invoiceNo);
        notificationService.sendPaymentSuccessNotification(client.getEmail(), invoiceNo, net);
        return saved;
    }
}
