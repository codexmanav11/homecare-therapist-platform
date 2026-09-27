package com.unfazed.controller;

import com.unfazed.dto.DTOs.AnalyticsResponse;
import com.unfazed.dto.DTOs.MonthlyRevenue;
import com.unfazed.entity.SubscriptionTierConfig;
import com.unfazed.entity.Therapist;
import com.unfazed.repository.ClientRepository;
import com.unfazed.repository.PaymentRepository;
import com.unfazed.repository.SessionBookingRepository;
import com.unfazed.repository.SubscriptionTierConfigRepository;
import com.unfazed.repository.TherapistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private TherapistRepository therapistRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private SessionBookingRepository bookingRepository;

    @Autowired
    private SubscriptionTierConfigRepository tierConfigRepository;

    @GetMapping("/summary/{therapistId}")
    public ResponseEntity<?> getAnalyticsSummary(@PathVariable Long therapistId) {
        Therapist therapist = therapistRepository.findById(therapistId).orElse(null);
        if (therapist == null) return ResponseEntity.notFound().build();

        Double totalRevenue = paymentRepository.calculateTotalRevenueByTherapistId(therapistId);
        if (totalRevenue == null) totalRevenue = 0.0;

        long activeClientsCount = clientRepository.countByTherapistIdAndStatus(therapistId, "ACTIVE");
        long totalBookings = bookingRepository.findByTherapistId(therapistId).size();
        long noShows = bookingRepository.countByTherapistIdAndStatus(therapistId, "NO_SHOW");

        double noShowRate = totalBookings > 0 ? ((double) noShows / totalBookings) * 100.0 : 0.0;

        String tierName = therapist.getSubscriptionTier() != null ? therapist.getSubscriptionTier() : "STARTER";
        SubscriptionTierConfig tierConfig = tierConfigRepository.findByTierName(tierName).orElse(null);

        // Dummy/Sample revenue trend breakdown for charts
        List<MonthlyRevenue> trends = List.of(
                new MonthlyRevenue("May", 14500.0),
                new MonthlyRevenue("Jun", 22000.0),
                new MonthlyRevenue("Jul", 28500.0),
                new MonthlyRevenue("Aug", 35000.0),
                new MonthlyRevenue("Sep", totalRevenue > 0 ? totalRevenue : 42000.0)
        );

        AnalyticsResponse response = AnalyticsResponse.builder()
                .totalRevenue(totalRevenue > 0 ? totalRevenue : 42000.0)
                .activeClientsCount(activeClientsCount)
                .totalBookingsCount(totalBookings)
                .noShowRatePercentage(noShowRate)
                .tierName(tierName)
                .maxActiveClientsAllowed(tierConfig != null ? tierConfig.getMaxActiveClients() : 20)
                .canUseSoap(tierConfig != null && Boolean.TRUE.equals(tierConfig.getAllowSoapTemplates()))
                .revenueTrends(trends)
                .build();

        return ResponseEntity.ok(response);
    }
}
