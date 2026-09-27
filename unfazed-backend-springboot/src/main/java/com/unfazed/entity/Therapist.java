package com.unfazed.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "therapists")
public class Therapist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String title;

    @Column(length = 2000)
    private String bio;

    private Integer experienceYears;
    private Double consultationFee;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "therapist_specializations", joinColumns = @JoinColumn(name = "therapist_id"))
    @Column(name = "specialization")
    private List<String> specializations = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "therapist_languages", joinColumns = @JoinColumn(name = "therapist_id"))
    @Column(name = "language")
    private List<String> languages = new ArrayList<>();

    @Column(nullable = false)
    private String subscriptionTier;

    private String avatarUrl;
    private LocalDateTime createdAt;

    public Therapist() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (subscriptionTier == null) subscriptionTier = "STARTER";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public Double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Double consultationFee) { this.consultationFee = consultationFee; }
    public List<String> getSpecializations() { return specializations; }
    public void setSpecializations(List<String> specializations) { this.specializations = specializations; }
    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }
    public String getSubscriptionTier() { return subscriptionTier; }
    public void setSubscriptionTier(String subscriptionTier) { this.subscriptionTier = subscriptionTier; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Therapist t = new Therapist();
        public Builder id(Long id) { t.id = id; return this; }
        public Builder email(String e) { t.email = e; return this; }
        public Builder passwordHash(String p) { t.passwordHash = p; return this; }
        public Builder name(String n) { t.name = n; return this; }
        public Builder slug(String s) { t.slug = s; return this; }
        public Builder title(String ti) { t.title = ti; return this; }
        public Builder bio(String b) { t.bio = b; return this; }
        public Builder experienceYears(Integer ey) { t.experienceYears = ey; return this; }
        public Builder consultationFee(Double cf) { t.consultationFee = cf; return this; }
        public Builder specializations(List<String> s) { t.specializations = s; return this; }
        public Builder languages(List<String> l) { t.languages = l; return this; }
        public Builder subscriptionTier(String st) { t.subscriptionTier = st; return this; }
        public Builder avatarUrl(String a) { t.avatarUrl = a; return this; }
        public Therapist build() { return t; }
    }
}
