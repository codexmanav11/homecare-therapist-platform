package com.unfazed.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id", nullable = false)
    private Therapist therapist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(nullable = false)
    private String senderType;

    @Column(nullable = false, length = 2000)
    private String content;

    private Boolean isRead;
    private LocalDateTime sentAt;

    public ChatMessage() {}

    @PrePersist
    protected void onCreate() {
        if (sentAt == null) sentAt = LocalDateTime.now();
        if (isRead == null) isRead = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Therapist getTherapist() { return therapist; }
    public void setTherapist(Therapist therapist) { this.therapist = therapist; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private ChatMessage cm = new ChatMessage();
        public Builder id(Long id) { cm.id = id; return this; }
        public Builder therapist(Therapist t) { cm.therapist = t; return this; }
        public Builder client(Client c) { cm.client = c; return this; }
        public Builder senderType(String st) { cm.senderType = st; return this; }
        public Builder content(String co) { cm.content = co; return this; }
        public Builder isRead(Boolean ir) { cm.isRead = ir; return this; }
        public Builder sentAt(LocalDateTime sa) { cm.sentAt = sa; return this; }
        public ChatMessage build() { return cm; }
    }
}
