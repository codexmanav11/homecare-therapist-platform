package com.unfazed.controller;

import com.unfazed.dto.DTOs.PaymentOrderResponse;
import com.unfazed.entity.Payment;
import com.unfazed.repository.PaymentRepository;
import com.unfazed.service.InvoiceService;
import com.unfazed.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam Double amount) {
        PaymentOrderResponse response = paymentService.createPaymentOrder(amount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/therapist/{therapistId}")
    public ResponseEntity<?> getTherapistPayments(@PathVariable Long therapistId) {
        List<Payment> payments = paymentRepository.findByTherapistId(therapistId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/invoice/{paymentId}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) return ResponseEntity.notFound().build();

        byte[] pdfBytes = invoiceService.generateGstInvoicePdf(payment);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        String filename = (payment.getInvoiceNumber() != null ? payment.getInvoiceNumber() : "Invoice-" + paymentId) + ".pdf";
        headers.setContentDispositionFormData("attachment", filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}
