package com.unfazed.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_bookings")
public class SessionBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    private Therapist therapist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "therapist"})
    private Client client;

    @Column(nullable = false)
    private String bookingDate;

    @Column(nullable = false)
    private String startTime;

    @Column(nullable = false)
    private String endTime;

    @Column(nullable = false)
    private String status;

    private String clientTimezone;
    private Double amountPaid;
    private String meetingLink;
    private LocalDateTime createdAt;

    public SessionBooking() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "CONFIRMED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Therapist getTherapist() { return therapist; }
    public void setTherapist(Therapist therapist) { this.therapist = therapist; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getClientTimezone() { return clientTimezone; }
    public void setClientTimezone(String clientTimezone) { this.clientTimezone = clientTimezone; }
    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private SessionBooking sb = new SessionBooking();
        public Builder id(Long id) { sb.id = id; return this; }
        public Builder therapist(Therapist t) { sb.therapist = t; return this; }
        public Builder client(Client c) { sb.client = c; return this; }
        public Builder bookingDate(String bd) { sb.bookingDate = bd; return this; }
        public Builder startTime(String st) { sb.startTime = st; return this; }
        public Builder endTime(String et) { sb.endTime = et; return this; }
        public Builder status(String s) { sb.status = s; return this; }
        public Builder clientTimezone(String tz) { sb.clientTimezone = tz; return this; }
        public Builder amountPaid(Double a) { sb.amountPaid = a; return this; }
        public Builder meetingLink(String ml) { sb.meetingLink = ml; return this; }
        public SessionBooking build() { return sb; }
    }
}
