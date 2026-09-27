package com.unfazed.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    private Therapist therapist;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;
    private String status;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "client_tags", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @Column(length = 2000)
    private String presentingConcern;

    @Column(length = 2000)
    private String demographics;

    private Boolean consentSigned;
    private LocalDateTime consentTimestamp;
    private LocalDateTime createdAt;

    public Client() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "ACTIVE";
        if (consentSigned == null) consentSigned = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Therapist getTherapist() { return therapist; }
    public void setTherapist(Therapist therapist) { this.therapist = therapist; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getPresentingConcern() { return presentingConcern; }
    public void setPresentingConcern(String presentingConcern) { this.presentingConcern = presentingConcern; }
    public String getDemographics() { return demographics; }
    public void setDemographics(String demographics) { this.demographics = demographics; }
    public Boolean getConsentSigned() { return consentSigned; }
    public void setConsentSigned(Boolean consentSigned) { this.consentSigned = consentSigned; }
    public LocalDateTime getConsentTimestamp() { return consentTimestamp; }
    public void setConsentTimestamp(LocalDateTime consentTimestamp) { this.consentTimestamp = consentTimestamp; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Client c = new Client();
        public Builder id(Long id) { c.id = id; return this; }
        public Builder therapist(Therapist t) { c.therapist = t; return this; }
        public Builder name(String n) { c.name = n; return this; }
        public Builder email(String e) { c.email = e; return this; }
        public Builder phone(String p) { c.phone = p; return this; }
        public Builder status(String s) { c.status = s; return this; }
        public Builder tags(List<String> t) { c.tags = t; return this; }
        public Builder presentingConcern(String pc) { c.presentingConcern = pc; return this; }
        public Builder demographics(String d) { c.demographics = d; return this; }
        public Builder consentSigned(Boolean cs) { c.consentSigned = cs; return this; }
        public Builder consentTimestamp(LocalDateTime ct) { c.consentTimestamp = ct; return this; }
        public Client build() { return c; }
    }
}
