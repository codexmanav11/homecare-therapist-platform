package com.unfazed.service;

import com.unfazed.dto.DTOs.EntitlementCheckResponse;
import com.unfazed.entity.SubscriptionTierConfig;
import com.unfazed.entity.Therapist;
import com.unfazed.repository.ClientRepository;
import com.unfazed.repository.SubscriptionTierConfigRepository;
import com.unfazed.repository.TherapistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EntitlementService {

    @Autowired
    private TherapistRepository therapistRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private SubscriptionTierConfigRepository tierConfigRepository;

    /**
     * Single point of truth for tier-gating in Unfazed application.
     * Feature keys: "ADD_CLIENT", "SOAP_TEMPLATES", "ADVANCED_ANALYTICS", "CUSTOM_BRANDING"
     */
    public EntitlementCheckResponse canAccess(Long therapistId, String featureKey) {
        Therapist therapist = therapistRepository.findById(therapistId)
                .orElse(null);

        if (therapist == null) {
            return EntitlementCheckResponse.builder()
                    .featureKey(featureKey)
                    .allowed(false)
                    .reason("Therapist not found")
                    .currentTier("NONE")
                    .recommendedTier("STARTER")
                    .build();
        }

        String currentTierName = therapist.getSubscriptionTier() != null ? therapist.getSubscriptionTier() : "FREE";
        SubscriptionTierConfig config = tierConfigRepository.findByTierName(currentTierName)
                .orElseGet(() -> SubscriptionTierConfig.builder()
                        .tierName(currentTierName)
                        .maxActiveClients(5)
                        .allowSoapTemplates(false)
                        .analyticsDepth("BASIC")
                        .customBranding(false)
                        .build());

        switch (featureKey.toUpperCase()) {
            case "ADD_CLIENT":
                long activeClients = clientRepository.countByTherapistIdAndStatus(therapistId, "ACTIVE");
                boolean withinLimit = activeClients < config.getMaxActiveClients();
                return EntitlementCheckResponse.builder()
                        .featureKey(featureKey)
                        .allowed(withinLimit)
                        .reason(withinLimit ? "Within client quota" : "Client capacity limit reached (" + activeClients + "/" + config.getMaxActiveClients() + ") for " + currentTierName + " tier.")
                        .currentTier(currentTierName)
                        .recommendedTier(getUpgradeTier(currentTierName))
                        .build();

            case "SOAP_TEMPLATES":
                boolean canSoap = Boolean.TRUE.equals(config.getAllowSoapTemplates());
                return EntitlementCheckResponse.builder()
                        .featureKey(featureKey)
                        .allowed(canSoap)
                        .reason(canSoap ? "SOAP notes permitted" : "Structured SOAP/DAP clinical templates require PRO tier or above.")
                        .currentTier(currentTierName)
                        .recommendedTier("PRO")
                        .build();

            case "ADVANCED_ANALYTICS":
                boolean isAdvanced = "ADVANCED".equalsIgnoreCase(config.getAnalyticsDepth()) || "ENTERPRISE".equalsIgnoreCase(config.getAnalyticsDepth());
                return EntitlementCheckResponse.builder()
                        .featureKey(featureKey)
                        .allowed(isAdvanced)
                        .reason(isAdvanced ? "Advanced analytics permitted" : "Deep financial & no-show breakdown analytics require PRO tier.")
                        .currentTier(currentTierName)
                        .recommendedTier("PRO")
                        .build();

            case "CUSTOM_BRANDING":
                boolean customBrand = Boolean.TRUE.equals(config.getCustomBranding());
                return EntitlementCheckResponse.builder()
                        .featureKey(featureKey)
                        .allowed(customBrand)
                        .reason(customBrand ? "Custom branding permitted" : "Remove Unfazed logo & custom domain requires PRO tier.")
                        .currentTier(currentTierName)
                        .recommendedTier("PRO")
                        .build();

            default:
                return EntitlementCheckResponse.builder()
                        .featureKey(featureKey)
                        .allowed(true)
                        .reason("Default permission granted")
                        .currentTier(currentTierName)
                        .build();
        }
    }

    private String getUpgradeTier(String currentTier) {
        if ("FREE".equalsIgnoreCase(currentTier)) return "STARTER";
        if ("STARTER".equalsIgnoreCase(currentTier)) return "PRO";
        if ("PRO".equalsIgnoreCase(currentTier)) return "ELITE";
        return "ELITE";
    }
}
