package com.unfazed.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_notes")
public class SessionNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id", nullable = false)
    private Therapist therapist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private SessionBooking sessionBooking;

    @Column(nullable = false)
    private String noteType;

    private String templateType;

    @Column(length = 4000)
    private String bodyText;

    @Column(length = 2000)
    private String subjectiveContent;

    @Column(length = 2000)
    private String objectiveContent;

    @Column(length = 2000)
    private String assessmentContent;

    @Column(length = 2000)
    private String planContent;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SessionNote() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (noteType == null) noteType = "PRIVATE";
        if (templateType == null) templateType = "FREEFORM";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Therapist getTherapist() { return therapist; }
    public void setTherapist(Therapist therapist) { this.therapist = therapist; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public SessionBooking getSessionBooking() { return sessionBooking; }
    public void setSessionBooking(SessionBooking sessionBooking) { this.sessionBooking = sessionBooking; }
    public String getNoteType() { return noteType; }
    public void setNoteType(String noteType) { this.noteType = noteType; }
    public String getTemplateType() { return templateType; }
    public void setTemplateType(String templateType) { this.templateType = templateType; }
    public String getBodyText() { return bodyText; }
    public void setBodyText(String bodyText) { this.bodyText = bodyText; }
    public String getSubjectiveContent() { return subjectiveContent; }
    public void setSubjectiveContent(String subjectiveContent) { this.subjectiveContent = subjectiveContent; }
    public String getObjectiveContent() { return objectiveContent; }
    public void setObjectiveContent(String objectiveContent) { this.objectiveContent = objectiveContent; }
    public String getAssessmentContent() { return assessmentContent; }
    public void setAssessmentContent(String assessmentContent) { this.assessmentContent = assessmentContent; }
    public String getPlanContent() { return planContent; }
    public void setPlanContent(String planContent) { this.planContent = planContent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private SessionNote sn = new SessionNote();
        public Builder id(Long id) { sn.id = id; return this; }
        public Builder therapist(Therapist t) { sn.therapist = t; return this; }
        public Builder client(Client c) { sn.client = c; return this; }
        public Builder sessionBooking(SessionBooking sb) { sn.sessionBooking = sb; return this; }
        public Builder noteType(String nt) { sn.noteType = nt; return this; }
        public Builder templateType(String tt) { sn.templateType = tt; return this; }
        public Builder bodyText(String bt) { sn.bodyText = bt; return this; }
        public Builder subjectiveContent(String sc) { sn.subjectiveContent = sc; return this; }
        public Builder objectiveContent(String oc) { sn.objectiveContent = oc; return this; }
        public Builder assessmentContent(String ac) { sn.assessmentContent = ac; return this; }
        public Builder planContent(String pc) { sn.planContent = pc; return this; }
        public SessionNote build() { return sn; }
    }
}
