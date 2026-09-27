package com.unfazed.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    public void sendBookingConfirmationNotification(String clientName, String clientEmail, String bookingDate, String startTime, String therapistName) {
        logger.info("[NOTIFICATION EVENT] Booking Confirmation sent to Client: {} ({}) for session on {} at {} with {}",
                clientName, clientEmail, bookingDate, startTime, therapistName);
        logger.info("[WHATSAPP STUB] Queueing WhatsApp message to client: 'Hi {}, your therapy session with {} is confirmed for {} at {}.'",
                clientName, therapistName, bookingDate, startTime);
    }

    public void sendPaymentSuccessNotification(String clientEmail, String invoiceNumber, Double amount) {
        logger.info("[NOTIFICATION EVENT] Invoice & Payment Receipt {} (INR {}) dispatched to email: {}",
                invoiceNumber, amount, clientEmail);
    }
}
