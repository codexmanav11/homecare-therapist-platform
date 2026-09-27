package com.unfazed.dto;

import java.util.List;

public class DTOs {

    public static class AuthRequest {
        private String email;
        private String password;

        public AuthRequest() {}
        public AuthRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String slug;
        private String title;
        private String bio;
        private List<String> specializations;
        private List<String> languages;

        public RegisterRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public List<String> getSpecializations() { return specializations; }
        public void setSpecializations(List<String> specializations) { this.specializations = specializations; }
        public List<String> getLanguages() { return languages; }
        public void setLanguages(List<String> languages) { this.languages = languages; }
    }

    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String email;
        private String slug;
        private String subscriptionTier;

        public AuthResponse() {}

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public String getSubscriptionTier() { return subscriptionTier; }
        public void setSubscriptionTier(String subscriptionTier) { this.subscriptionTier = subscriptionTier; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private AuthResponse res = new AuthResponse();
            public Builder token(String t) { res.token = t; return this; }
            public Builder id(Long id) { res.id = id; return this; }
            public Builder name(String n) { res.name = n; return this; }
            public Builder email(String e) { res.email = e; return this; }
            public Builder slug(String s) { res.slug = s; return this; }
            public Builder subscriptionTier(String tier) { res.subscriptionTier = tier; return this; }
            public AuthResponse build() { return res; }
        }
    }

    public static class TherapistDTO {
        private Long id;
        private String name;
        private String email;
        private String slug;
        private String title;
        private String bio;
        private Integer experienceYears;
        private Double consultationFee;
        private List<String> specializations;
        private List<String> languages;
        private String subscriptionTier;
        private String avatarUrl;

        public TherapistDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
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

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private TherapistDTO d = new TherapistDTO();
            public Builder id(Long id) { d.id = id; return this; }
            public Builder name(String n) { d.name = n; return this; }
            public Builder email(String e) { d.email = e; return this; }
            public Builder slug(String s) { d.slug = s; return this; }
            public Builder title(String t) { d.title = t; return this; }
            public Builder bio(String b) { d.bio = b; return this; }
            public Builder experienceYears(Integer ey) { d.experienceYears = ey; return this; }
            public Builder consultationFee(Double cf) { d.consultationFee = cf; return this; }
            public Builder specializations(List<String> s) { d.specializations = s; return this; }
            public Builder languages(List<String> l) { d.languages = l; return this; }
            public Builder subscriptionTier(String st) { d.subscriptionTier = st; return this; }
            public Builder avatarUrl(String a) { d.avatarUrl = a; return this; }
            public TherapistDTO build() { return d; }
        }
    }

    public static class ClientDTO {
        private Long id;
        private Long therapistId;
        private String name;
        private String email;
        private String phone;
        private String status;
        private List<String> tags;
        private String presentingConcern;
        private String demographics;
        private Boolean consentSigned;
        private String consentTimestamp;

        public ClientDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getTherapistId() { return therapistId; }
        public void setTherapistId(Long therapistId) { this.therapistId = therapistId; }
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
        public String getConsentTimestamp() { return consentTimestamp; }
        public void setConsentTimestamp(String consentTimestamp) { this.consentTimestamp = consentTimestamp; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private ClientDTO c = new ClientDTO();
            public Builder id(Long id) { c.id = id; return this; }
            public Builder therapistId(Long tid) { c.therapistId = tid; return this; }
            public Builder name(String n) { c.name = n; return this; }
            public Builder email(String e) { c.email = e; return this; }
            public Builder phone(String p) { c.phone = p; return this; }
            public Builder status(String s) { c.status = s; return this; }
            public Builder tags(List<String> t) { c.tags = t; return this; }
            public Builder presentingConcern(String pc) { c.presentingConcern = pc; return this; }
            public Builder demographics(String d) { c.demographics = d; return this; }
            public Builder consentSigned(Boolean cs) { c.consentSigned = cs; return this; }
            public Builder consentTimestamp(String ct) { c.consentTimestamp = ct; return this; }
            public ClientDTO build() { return c; }
        }
    }

    public static class SlotDTO {
        private String date;
        private String startTime;
        private String endTime;
        private boolean available;

        public SlotDTO() {}

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getStartTime() { return startTime; }
        public void setStartTime(String startTime) { this.startTime = startTime; }
        public String getEndTime() { return endTime; }
        public void setEndTime(String endTime) { this.endTime = endTime; }
        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private SlotDTO s = new SlotDTO();
            public Builder date(String d) { s.date = d; return this; }
            public Builder startTime(String st) { s.startTime = st; return this; }
            public Builder endTime(String et) { s.endTime = et; return this; }
            public Builder available(boolean a) { s.available = a; return this; }
            public SlotDTO build() { return s; }
        }
    }

    public static class BookingRequest {
        private Long therapistId;
        private String clientName;
        private String clientEmail;
        private String clientPhone;
        private String bookingDate;
        private String startTime;
        private String endTime;
        private String clientTimezone;
        private String paymentMethod;

        public BookingRequest() {}

        public Long getTherapistId() { return therapistId; }
        public void setTherapistId(Long therapistId) { this.therapistId = therapistId; }
        public String getClientName() { return clientName; }
        public void setClientName(String clientName) { this.clientName = clientName; }
        public String getClientEmail() { return clientEmail; }
        public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
        public String getClientPhone() { return clientPhone; }
        public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }
        public String getBookingDate() { return bookingDate; }
        public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
        public String getStartTime() { return startTime; }
        public void setStartTime(String startTime) { this.startTime = startTime; }
        public String getEndTime() { return endTime; }
        public void setEndTime(String endTime) { this.endTime = endTime; }
        public String getClientTimezone() { return clientTimezone; }
        public void setClientTimezone(String clientTimezone) { this.clientTimezone = clientTimezone; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }

    public static class NoteRequest {
        private Long clientId;
        private Long bookingId;
        private String noteType;
        private String templateType;
        private String bodyText;
        private String subjectiveContent;
        private String objectiveContent;
        private String assessmentContent;
        private String planContent;

        public NoteRequest() {}

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }
        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
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
    }

    public static class NoteResponse {
        private Long id;
        private Long therapistId;
        private Long clientId;
        private String clientName;
        private Long bookingId;
        private String noteType;
        private String templateType;
        private String bodyText;
        private String subjectiveContent;
        private String objectiveContent;
        private String assessmentContent;
        private String planContent;
        private String createdAt;

        public NoteResponse() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getTherapistId() { return therapistId; }
        public void setTherapistId(Long therapistId) { this.therapistId = therapistId; }
        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }
        public String getClientName() { return clientName; }
        public void setClientName(String clientName) { this.clientName = clientName; }
        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
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
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private NoteResponse nr = new NoteResponse();
            public Builder id(Long id) { nr.id = id; return this; }
            public Builder therapistId(Long tid) { nr.therapistId = tid; return this; }
            public Builder clientId(Long cid) { nr.clientId = cid; return this; }
            public Builder clientName(String cn) { nr.clientName = cn; return this; }
            public Builder bookingId(Long bid) { nr.bookingId = bid; return this; }
            public Builder noteType(String nt) { nr.noteType = nt; return this; }
            public Builder templateType(String tt) { nr.templateType = tt; return this; }
            public Builder bodyText(String bt) { nr.bodyText = bt; return this; }
            public Builder subjectiveContent(String sc) { nr.subjectiveContent = sc; return this; }
            public Builder objectiveContent(String oc) { nr.objectiveContent = oc; return this; }
            public Builder assessmentContent(String ac) { nr.assessmentContent = ac; return this; }
            public Builder planContent(String pc) { nr.planContent = pc; return this; }
            public Builder createdAt(String ca) { nr.createdAt = ca; return this; }
            public NoteResponse build() { return nr; }
        }
    }

    public static class AnalyticsResponse {
        private Double totalRevenue;
        private Long activeClientsCount;
        private Long totalBookingsCount;
        private Double noShowRatePercentage;
        private String tierName;
        private Integer maxActiveClientsAllowed;
        private Boolean canUseSoap;
        private List<MonthlyRevenue> revenueTrends;

        public AnalyticsResponse() {}

        public Double getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
        public Long getActiveClientsCount() { return activeClientsCount; }
        public void setActiveClientsCount(Long activeClientsCount) { this.activeClientsCount = activeClientsCount; }
        public Long getTotalBookingsCount() { return totalBookingsCount; }
        public void setTotalBookingsCount(Long totalBookingsCount) { this.totalBookingsCount = totalBookingsCount; }
        public Double getNoShowRatePercentage() { return noShowRatePercentage; }
        public void setNoShowRatePercentage(Double noShowRatePercentage) { this.noShowRatePercentage = noShowRatePercentage; }
        public String getTierName() { return tierName; }
        public void setTierName(String tierName) { this.tierName = tierName; }
        public Integer getMaxActiveClientsAllowed() { return maxActiveClientsAllowed; }
        public void setMaxActiveClientsAllowed(Integer maxActiveClientsAllowed) { this.maxActiveClientsAllowed = maxActiveClientsAllowed; }
        public Boolean getCanUseSoap() { return canUseSoap; }
        public void setCanUseSoap(Boolean canUseSoap) { this.canUseSoap = canUseSoap; }
        public List<MonthlyRevenue> getRevenueTrends() { return revenueTrends; }
        public void setRevenueTrends(List<MonthlyRevenue> revenueTrends) { this.revenueTrends = revenueTrends; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private AnalyticsResponse ar = new AnalyticsResponse();
            public Builder totalRevenue(Double tr) { ar.totalRevenue = tr; return this; }
            public Builder activeClientsCount(Long ac) { ar.activeClientsCount = ac; return this; }
            public Builder totalBookingsCount(Long tb) { ar.totalBookingsCount = tb; return this; }
            public Builder noShowRatePercentage(Double ns) { ar.noShowRatePercentage = ns; return this; }
            public Builder tierName(String tn) { ar.tierName = tn; return this; }
            public Builder maxActiveClientsAllowed(Integer ma) { ar.maxActiveClientsAllowed = ma; return this; }
            public Builder canUseSoap(Boolean cs) { ar.canUseSoap = cs; return this; }
            public Builder revenueTrends(List<MonthlyRevenue> rt) { ar.revenueTrends = rt; return this; }
            public AnalyticsResponse build() { return ar; }
        }
    }

    public static class MonthlyRevenue {
        private String month;
        private Double amount;

        public MonthlyRevenue() {}
        public MonthlyRevenue(String month, Double amount) {
            this.month = month;
            this.amount = amount;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }

    public static class EntitlementCheckResponse {
        private String featureKey;
        private boolean allowed;
        private String reason;
        private String currentTier;
        private String recommendedTier;

        public EntitlementCheckResponse() {}

        public String getFeatureKey() { return featureKey; }
        public void setFeatureKey(String featureKey) { this.featureKey = featureKey; }
        public boolean isAllowed() { return allowed; }
        public void setAllowed(boolean allowed) { this.allowed = allowed; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getCurrentTier() { return currentTier; }
        public void setCurrentTier(String currentTier) { this.currentTier = currentTier; }
        public String getRecommendedTier() { return recommendedTier; }
        public void setRecommendedTier(String recommendedTier) { this.recommendedTier = recommendedTier; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private EntitlementCheckResponse e = new EntitlementCheckResponse();
            public Builder featureKey(String fk) { e.featureKey = fk; return this; }
            public Builder allowed(boolean a) { e.allowed = a; return this; }
            public Builder reason(String r) { e.reason = r; return this; }
            public Builder currentTier(String ct) { e.currentTier = ct; return this; }
            public Builder recommendedTier(String rt) { e.recommendedTier = rt; return this; }
            public EntitlementCheckResponse build() { return e; }
        }
    }

    public static class ChatMessageDTO {
        private Long id;
        private Long therapistId;
        private Long clientId;
        private String senderType;
        private String content;
        private Boolean isRead;
        private String sentAt;

        public ChatMessageDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getTherapistId() { return therapistId; }
        public void setTherapistId(Long therapistId) { this.therapistId = therapistId; }
        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }
        public String getSenderType() { return senderType; }
        public void setSenderType(String senderType) { this.senderType = senderType; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public Boolean getIsRead() { return isRead; }
        public void setIsRead(Boolean isRead) { this.isRead = isRead; }
        public String getSentAt() { return sentAt; }
        public void setSentAt(String sentAt) { this.sentAt = sentAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private ChatMessageDTO cm = new ChatMessageDTO();
            public Builder id(Long id) { cm.id = id; return this; }
            public Builder therapistId(Long tid) { cm.therapistId = tid; return this; }
            public Builder clientId(Long cid) { cm.clientId = cid; return this; }
            public Builder senderType(String st) { cm.senderType = st; return this; }
            public Builder content(String c) { cm.content = c; return this; }
            public Builder isRead(Boolean r) { cm.isRead = r; return this; }
            public Builder sentAt(String sa) { cm.sentAt = sa; return this; }
            public ChatMessageDTO build() { return cm; }
        }
    }

    public static class PaymentOrderResponse {
        private String orderId;
        private Double amount;
        private String currency;
        private String razorpayKeyId;

        public PaymentOrderResponse() {}

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public String getRazorpayKeyId() { return razorpayKeyId; }
        public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private PaymentOrderResponse po = new PaymentOrderResponse();
            public Builder orderId(String oid) { po.orderId = oid; return this; }
            public Builder amount(Double a) { po.amount = a; return this; }
            public Builder currency(String c) { po.currency = c; return this; }
            public Builder razorpayKeyId(String rk) { po.razorpayKeyId = rk; return this; }
            public PaymentOrderResponse build() { return po; }
        }
    }
}
