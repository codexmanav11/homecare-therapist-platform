package com.unfazed.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String gatewayTransactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    private Therapist therapist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "therapist"})
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "therapist", "client"})
    private SessionBooking sessionBooking;

    private Double grossAmount;
    private Double platformFee;
    private Double gstAmount;
    private Double netAmount;

    @Column(unique = true)
    private String invoiceNumber;

    private String status;
    private String paymentMethod;
    private LocalDateTime createdAt;

    public Payment() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "SUCCESS";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getGatewayTransactionId() { return gatewayTransactionId; }
    public void setGatewayTransactionId(String gatewayTransactionId) { this.gatewayTransactionId = gatewayTransactionId; }
    public Therapist getTherapist() { return therapist; }
    public void setTherapist(Therapist therapist) { this.therapist = therapist; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public SessionBooking getSessionBooking() { return sessionBooking; }
    public void setSessionBooking(SessionBooking sessionBooking) { this.sessionBooking = sessionBooking; }
    public Double getGrossAmount() { return grossAmount; }
    public void setGrossAmount(Double grossAmount) { this.grossAmount = grossAmount; }
    public Double getPlatformFee() { return platformFee; }
    public void setPlatformFee(Double platformFee) { this.platformFee = platformFee; }
    public Double getGstAmount() { return gstAmount; }
    public void setGstAmount(Double gstAmount) { this.gstAmount = gstAmount; }
    public Double getNetAmount() { return netAmount; }
    public void setNetAmount(Double netAmount) { this.netAmount = netAmount; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Payment p = new Payment();
        public Builder id(Long id) { p.id = id; return this; }
        public Builder gatewayTransactionId(String g) { p.gatewayTransactionId = g; return this; }
        public Builder therapist(Therapist t) { p.therapist = t; return this; }
        public Builder client(Client c) { p.client = c; return this; }
        public Builder sessionBooking(SessionBooking sb) { p.sessionBooking = sb; return this; }
        public Builder grossAmount(Double g) { p.grossAmount = g; return this; }
        public Builder platformFee(Double pf) { p.platformFee = pf; return this; }
        public Builder gstAmount(Double gst) { p.gstAmount = gst; return this; }
        public Builder netAmount(Double n) { p.netAmount = n; return this; }
        public Builder invoiceNumber(String inv) { p.invoiceNumber = inv; return this; }
        public Builder status(String s) { p.status = s; return this; }
        public Builder paymentMethod(String pm) { p.paymentMethod = pm; return this; }
        public Payment build() { return p; }
    }
}
