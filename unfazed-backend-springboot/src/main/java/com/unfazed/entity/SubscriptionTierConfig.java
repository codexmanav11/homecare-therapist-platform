package com.unfazed.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subscription_tier_configs")
public class SubscriptionTierConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tierName;

    private Integer maxActiveClients;
    private Boolean allowSoapTemplates;
    private String analyticsDepth;
    private Boolean customBranding;
    private Double monthlyPriceINR;

    public SubscriptionTierConfig() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTierName() { return tierName; }
    public void setTierName(String tierName) { this.tierName = tierName; }
    public Integer getMaxActiveClients() { return maxActiveClients; }
    public void setMaxActiveClients(Integer maxActiveClients) { this.maxActiveClients = maxActiveClients; }
    public Boolean getAllowSoapTemplates() { return allowSoapTemplates; }
    public void setAllowSoapTemplates(Boolean allowSoapTemplates) { this.allowSoapTemplates = allowSoapTemplates; }
    public String getAnalyticsDepth() { return analyticsDepth; }
    public void setAnalyticsDepth(String analyticsDepth) { this.analyticsDepth = analyticsDepth; }
    public Boolean getCustomBranding() { return customBranding; }
    public void setCustomBranding(Boolean customBranding) { this.customBranding = customBranding; }
    public Double getMonthlyPriceINR() { return monthlyPriceINR; }
    public void setMonthlyPriceINR(Double monthlyPriceINR) { this.monthlyPriceINR = monthlyPriceINR; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private SubscriptionTierConfig stc = new SubscriptionTierConfig();
        public Builder id(Long id) { stc.id = id; return this; }
        public Builder tierName(String tn) { stc.tierName = tn; return this; }
        public Builder maxActiveClients(Integer mac) { stc.maxActiveClients = mac; return this; }
        public Builder allowSoapTemplates(Boolean ast) { stc.allowSoapTemplates = ast; return this; }
        public Builder analyticsDepth(String ad) { stc.analyticsDepth = ad; return this; }
        public Builder customBranding(Boolean cb) { stc.customBranding = cb; return this; }
        public Builder monthlyPriceINR(Double p) { stc.monthlyPriceINR = p; return this; }
        public SubscriptionTierConfig build() { return stc; }
    }
}
