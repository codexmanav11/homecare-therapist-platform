package com.unfazed.config;

import org.springframework.stereotype.Component;
import java.util.*;

/**
 * Extension points for upcoming SaaS v2 upgrades.
 * Designed for easy plug-and-play addition of future modules.
 */
@Component
public class UpgradeRegistry {

    private final Map<String, Boolean> featureFlags = new HashMap<>();
    private final List<String> upcomingAddons = new ArrayList<>();

    public UpgradeRegistry() {
        // Default feature toggles for future releases
        featureFlags.put("AI_SOAP_SUMMARY", false);      // v2.1: AI-assisted clinical session summaries
        featureFlags.put("WHATSAPP_BOT_V2", true);       // v2.0: Automated patient appointment reminders
        featureFlags.put("TELEHEALTH_CUSTOM_RTC", true); // v2.0: Embedded WebRTC video consultations

        // Roadmap add-ons registered for practice tier upgrades
        upcomingAddons.add("GST_E_INVOICING_DIRECT");
        upcomingAddons.add("MULTI_CLINIC_STAFF_ROLES");
        upcomingAddons.add("INSURANCE_CLAIM_AUTO_SUBMIT");
    }

    public boolean isFeatureEnabled(String featureKey) {
        return featureFlags.getOrDefault(featureKey, false);
    }

    public void enableFeature(String featureKey) {
        featureFlags.put(featureKey, true);
    }

    public List<String> getUpcomingAddons() {
        return Collections.unmodifiableList(upcomingAddons);
    }
}
