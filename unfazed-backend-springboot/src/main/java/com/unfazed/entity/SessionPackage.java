package com.unfazed.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_packages")
public class SessionPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id", nullable = false)
    private Therapist therapist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    private Integer totalSessions;
    private Integer remainingSessions;
    private Double pricePerSession;
    private Double totalPrice;
    private String expiryDate;
    private LocalDateTime createdAt;

    public SessionPackage() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Therapist getTherapist() { return therapist; }
    public void setTherapist(Therapist therapist) { this.therapist = therapist; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public Integer getTotalSessions() { return totalSessions; }
    public void setTotalSessions(Integer totalSessions) { this.totalSessions = totalSessions; }
    public Integer getRemainingSessions() { return remainingSessions; }
    public void setRemainingSessions(Integer remainingSessions) { this.remainingSessions = remainingSessions; }
    public Double getPricePerSession() { return pricePerSession; }
    public void setPricePerSession(Double pricePerSession) { this.pricePerSession = pricePerSession; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private SessionPackage sp = new SessionPackage();
        public Builder id(Long id) { sp.id = id; return this; }
        public Builder therapist(Therapist t) { sp.therapist = t; return this; }
        public Builder client(Client c) { sp.client = c; return this; }
        public Builder totalSessions(Integer ts) { sp.totalSessions = ts; return this; }
        public Builder remainingSessions(Integer rs) { sp.remainingSessions = rs; return this; }
        public Builder pricePerSession(Double pps) { sp.pricePerSession = pps; return this; }
        public Builder totalPrice(Double tp) { sp.totalPrice = tp; return this; }
        public Builder expiryDate(String ed) { sp.expiryDate = ed; return this; }
        public SessionPackage build() { return sp; }
    }
}
