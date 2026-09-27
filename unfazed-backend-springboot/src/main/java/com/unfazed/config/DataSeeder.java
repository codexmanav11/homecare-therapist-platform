package com.unfazed.config;

import com.unfazed.entity.*;
import com.unfazed.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private SubscriptionTierConfigRepository tierConfigRepository;
    @Autowired private TherapistRepository therapistRepository;
    @Autowired private ClientRepository clientRepository;
    @Autowired private SessionBookingRepository bookingRepository;
    @Autowired private SessionNoteRepository noteRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private ChatMessageRepository chatMessageRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedSubscriptionTiers();
        Therapist t = seedTherapist();
        if (t == null) return;
        List<Client> clients = seedClients(t);
        List<SessionBooking> bookings = seedBookings(t, clients);
        seedNotes(t, clients, bookings);
        seedPayments(t, clients, bookings);
        seedChat(t, clients);
    }

    private void seedSubscriptionTiers() {
        if (tierConfigRepository.count() > 0) return;
        tierConfigRepository.save(SubscriptionTierConfig.builder().tierName("FREE").maxActiveClients(3).allowSoapTemplates(false).analyticsDepth("BASIC").customBranding(false).monthlyPriceINR(0.0).build());
        tierConfigRepository.save(SubscriptionTierConfig.builder().tierName("PRO").maxActiveClients(100).allowSoapTemplates(true).analyticsDepth("ADVANCED").customBranding(true).monthlyPriceINR(3499.0).build());
    }

    private Therapist seedTherapist() {
        if (therapistRepository.existsBySlug("dr-sharma")) {
            return therapistRepository.findBySlug("dr-sharma").orElse(null);
        }
        Therapist t = Therapist.builder()
                .name("Dr. Aditi Sharma")
                .email("dr.sharma@unfazed.in")
                .passwordHash(passwordEncoder.encode("123456789"))
                .slug("dr-sharma")
                .title("M.Phil Clinical Psychology (NIMHANS)")
                .bio("Specialized in CBT, Mindfulness-based Therapy, Anxiety, and Career Burnout. 8+ years experience.")
                .experienceYears(8)
                .consultationFee(1800.0)
                .specializations(List.of("Anxiety & Stress", "CBT", "Depression", "Relationship Counseling", "Workplace Burnout"))
                .languages(List.of("English", "Hindi", "Punjabi"))
                .subscriptionTier("PRO")
                .avatarUrl("https://images.unsplash.com/photo-1594824813566-88855ce78906?w=400&auto=format&fit=crop&q=80")
                .build();
        return therapistRepository.save(t);
    }

    private List<Client> seedClients(Therapist t) {
        if (!clientRepository.findByTherapistId(t.getId()).isEmpty()) {
            return clientRepository.findByTherapistId(t.getId());
        }

        Client c1 = clientRepository.save(Client.builder().therapist(t).name("Aarav Mehta").email("aarav.m@example.com").phone("+91 98765 43210")
                .status("ACTIVE").tags(List.of("ANXIETY", "WEEKLY")).presentingConcern("Generalized anxiety, panic before work presentations.")
                .demographics("29 y/o Software Engineer, Bengaluru").consentSigned(true).consentTimestamp(LocalDateTime.now().minusDays(15)).build());

        Client c2 = clientRepository.save(Client.builder().therapist(t).name("Ananya Roy").email("ananya.roy@example.com").phone("+91 98111 22233")
                .status("ACTIVE").tags(List.of("DEPRESSION", "BI-WEEKLY")).presentingConcern("Low mood, loss of interest, sleep issues.")
                .demographics("34 y/o UX Designer, Mumbai").consentSigned(true).consentTimestamp(LocalDateTime.now().minusDays(30)).build());

        Client c3 = clientRepository.save(Client.builder().therapist(t).name("Vikram Desai").email("vikram.d@example.com").phone("+91 97321 55678")
                .status("ACTIVE").tags(List.of("BURNOUT", "WEEKLY")).presentingConcern("Workplace burnout, chronic fatigue, irritability.")
                .demographics("37 y/o Marketing Head, Delhi").consentSigned(true).consentTimestamp(LocalDateTime.now().minusDays(20)).build());

        Client c4 = clientRepository.save(Client.builder().therapist(t).name("Priya Nair").email("priya.nair@example.com").phone("+91 99887 66554")
                .status("ACTIVE").tags(List.of("RELATIONSHIP", "BI-WEEKLY")).presentingConcern("Communication issues with partner, trust rebuilding.")
                .demographics("31 y/o HR Manager, Pune").consentSigned(true).consentTimestamp(LocalDateTime.now().minusDays(10)).build());

        Client c5 = clientRepository.save(Client.builder().therapist(t).name("Rohan Gupta").email("rohan.g@example.com").phone("+91 88765 11234")
                .status("ACTIVE").tags(List.of("ANXIETY", "WEEKLY")).presentingConcern("Social anxiety, difficulty in group settings.")
                .demographics("25 y/o Data Analyst, Hyderabad").consentSigned(true).consentTimestamp(LocalDateTime.now().minusDays(5)).build());

        return List.of(c1, c2, c3, c4, c5);
    }

    private List<SessionBooking> seedBookings(Therapist t, List<Client> clients) {
        if (!bookingRepository.findByTherapistId(t.getId()).isEmpty()) {
            return bookingRepository.findByTherapistId(t.getId());
        }

        // upcoming
        SessionBooking b1 = bookingRepository.save(SessionBooking.builder().therapist(t).client(clients.get(0)).bookingDate("2026-09-25").startTime("10:00").endTime("10:50")
                .status("CONFIRMED").clientTimezone("Asia/Kolkata").amountPaid(1800.0).meetingLink("https://meet.unfazed.in/room-101").build());

        SessionBooking b2 = bookingRepository.save(SessionBooking.builder().therapist(t).client(clients.get(1)).bookingDate("2026-09-25").startTime("14:00").endTime("14:50")
                .status("CONFIRMED").clientTimezone("Asia/Kolkata").amountPaid(1800.0).meetingLink("https://meet.unfazed.in/room-102").build());

        SessionBooking b3 = bookingRepository.save(SessionBooking.builder().therapist(t).client(clients.get(2)).bookingDate("2026-09-26").startTime("11:00").endTime("11:50")
                .status("CONFIRMED").clientTimezone("Asia/Kolkata").amountPaid(1800.0).meetingLink("https://meet.unfazed.in/room-103").build());

        SessionBooking b4 = bookingRepository.save(SessionBooking.builder().therapist(t).client(clients.get(3)).bookingDate("2026-09-26").startTime("15:00").endTime("15:50")
                .status("CONFIRMED").clientTimezone("Asia/Kolkata").amountPaid(1800.0).meetingLink("https://meet.unfazed.in/room-104").build());

        SessionBooking b5 = bookingRepository.save(SessionBooking.builder().therapist(t).client(clients.get(4)).bookingDate("2026-09-27").startTime("09:00").endTime("09:50")
                .status("CONFIRMED").clientTimezone("Asia/Kolkata").amountPaid(1800.0).meetingLink("https://meet.unfazed.in/room-105").build());

        // past
        SessionBooking b6 = bookingRepository.save(SessionBooking.builder().therapist(t).client(clients.get(0)).bookingDate("2026-09-18").startTime("10:00").endTime("10:50")
                .status("COMPLETED").clientTimezone("Asia/Kolkata").amountPaid(1800.0).meetingLink("https://meet.unfazed.in/room-006").build());

        SessionBooking b7 = bookingRepository.save(SessionBooking.builder().therapist(t).client(clients.get(1)).bookingDate("2026-09-15").startTime("14:00").endTime("14:50")
                .status("COMPLETED").clientTimezone("Asia/Kolkata").amountPaid(1800.0).meetingLink("https://meet.unfazed.in/room-007").build());

        SessionBooking b8 = bookingRepository.save(SessionBooking.builder().therapist(t).client(clients.get(2)).bookingDate("2026-09-10").startTime("11:00").endTime("11:50")
                .status("COMPLETED").clientTimezone("Asia/Kolkata").amountPaid(1800.0).meetingLink("https://meet.unfazed.in/room-008").build());

        SessionBooking b9 = bookingRepository.save(SessionBooking.builder().therapist(t).client(clients.get(3)).bookingDate("2026-09-25").startTime("17:00").endTime("17:50")
                .status("CONFIRMED").clientTimezone("Asia/Kolkata").amountPaid(1800.0).meetingLink("https://meet.unfazed.in/room-109").build());

        return List.of(b1, b2, b3, b4, b5, b6, b7, b8, b9);
    }

    private void seedNotes(Therapist t, List<Client> clients, List<SessionBooking> bookings) {
        if (!noteRepository.findByTherapistId(t.getId()).isEmpty()) return;

        noteRepository.save(SessionNote.builder().therapist(t).client(clients.get(0)).sessionBooking(bookings.get(0))
                .noteType("PRIVATE").templateType("SOAP")
                .subjectiveContent("Aarav reports panic frequency reduced from 3x/week to 1x/week. Breathing exercises daily.")
                .objectiveContent("Relaxed demeanor, steady eye contact, normal speech rate.")
                .assessmentContent("Good progress with cognitive restructuring for catastrophizing.")
                .planContent("Assign progressive muscle relaxation. Follow up next Friday.").build());

        noteRepository.save(SessionNote.builder().therapist(t).client(clients.get(0)).sessionBooking(bookings.get(0))
                .noteType("SHARED").templateType("FREEFORM")
                .bodyText("Key takeaways: Practice 4-7-8 breathing twice daily. Journal automatic thoughts when presentation stress arises.").build());

        noteRepository.save(SessionNote.builder().therapist(t).client(clients.get(1))
                .noteType("PRIVATE").templateType("FREEFORM")
                .bodyText("Ananya discussed relationship dynamics with partner. Explored childhood attachment patterns.").build());

        noteRepository.save(SessionNote.builder().therapist(t).client(clients.get(2))
                .noteType("SHARED").templateType("FREEFORM")
                .bodyText("Vikram: Set boundaries at work. Try digital detox after 8pm. We discussed time-boxing strategy.").build());

        noteRepository.save(SessionNote.builder().therapist(t).client(clients.get(3))
                .noteType("PRIVATE").templateType("FREEFORM")
                .bodyText("Priya: Explored trust rebuilding exercises. Gottman method communication framework introduced.").build());
    }

    private void seedPayments(Therapist t, List<Client> clients, List<SessionBooking> bookings) {
        if (!paymentRepository.findByTherapistId(t.getId()).isEmpty()) return;

        double fee = 1800.0, gst = fee * 0.18, net = fee + gst, platformFee = fee * 0.05;

        paymentRepository.save(Payment.builder().therapist(t).client(clients.get(0)).sessionBooking(bookings.get(0))
                .gatewayTransactionId("pay_upi_aarav_001").grossAmount(fee).gstAmount(gst).platformFee(platformFee).netAmount(net)
                .invoiceNumber("INV-2026-0091").status("SUCCESS").paymentMethod("UPI").build());

        paymentRepository.save(Payment.builder().therapist(t).client(clients.get(1)).sessionBooking(bookings.get(1))
                .gatewayTransactionId("pay_upi_ananya_002").grossAmount(fee).gstAmount(gst).platformFee(platformFee).netAmount(net)
                .invoiceNumber("INV-2026-0092").status("SUCCESS").paymentMethod("UPI").build());

        paymentRepository.save(Payment.builder().therapist(t).client(clients.get(2)).sessionBooking(bookings.get(2))
                .gatewayTransactionId("pay_card_vikram_003").grossAmount(fee).gstAmount(gst).platformFee(platformFee).netAmount(net)
                .invoiceNumber("INV-2026-0093").status("SUCCESS").paymentMethod("CARD").build());

        paymentRepository.save(Payment.builder().therapist(t).client(clients.get(3)).sessionBooking(bookings.get(3))
                .gatewayTransactionId("pay_upi_priya_004").grossAmount(fee).gstAmount(gst).platformFee(platformFee).netAmount(net)
                .invoiceNumber("INV-2026-0094").status("SUCCESS").paymentMethod("UPI").build());

        paymentRepository.save(Payment.builder().therapist(t).client(clients.get(4)).sessionBooking(bookings.get(4))
                .gatewayTransactionId("pay_netbanking_rohan_005").grossAmount(fee).gstAmount(gst).platformFee(platformFee).netAmount(net)
                .invoiceNumber("INV-2026-0095").status("SUCCESS").paymentMethod("NET_BANKING").build());

        // past payments
        paymentRepository.save(Payment.builder().therapist(t).client(clients.get(0)).sessionBooking(bookings.get(5))
                .gatewayTransactionId("pay_upi_aarav_006").grossAmount(fee).gstAmount(gst).platformFee(platformFee).netAmount(net)
                .invoiceNumber("INV-2026-0086").status("SUCCESS").paymentMethod("UPI").build());

        paymentRepository.save(Payment.builder().therapist(t).client(clients.get(1)).sessionBooking(bookings.get(6))
                .gatewayTransactionId("pay_card_ananya_007").grossAmount(fee).gstAmount(gst).platformFee(platformFee).netAmount(net)
                .invoiceNumber("INV-2026-0087").status("SUCCESS").paymentMethod("CARD").build());

        paymentRepository.save(Payment.builder().therapist(t).client(clients.get(2)).sessionBooking(bookings.get(7))
                .gatewayTransactionId("pay_upi_vikram_008").grossAmount(fee).gstAmount(gst).platformFee(platformFee).netAmount(net)
                .invoiceNumber("INV-2026-0088").status("SUCCESS").paymentMethod("UPI").build());
    }

    private void seedChat(Therapist t, List<Client> clients) {
        if (!chatMessageRepository.findByTherapistIdAndClientIdOrderBySentAtAsc(t.getId(), clients.get(0).getId()).isEmpty()) return;

        // Aarav's thread
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(0)).senderType("CLIENT")
                .content("Hi Dr. Aditi, thank you for the session notes! Should I practice breathing before sleeping?").isRead(true).build());
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(0)).senderType("THERAPIST")
                .content("Hello Aarav! Yes, practising right before sleep is ideal. It calms the nervous system. Let me know how it goes.").isRead(true).build());
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(0)).senderType("CLIENT")
                .content("Tried it last night, slept much better. Also the journaling helped during today's meeting.").isRead(true).build());
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(0)).senderType("THERAPIST")
                .content("That's wonderful progress Aarav! Keep it up. We'll discuss more techniques next session.").isRead(true).build());

        // Ananya's thread
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(1)).senderType("CLIENT")
                .content("Dr. Sharma, I have been feeling very low this week. Can we reschedule to earlier?").isRead(true).build());
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(1)).senderType("THERAPIST")
                .content("Of course Ananya. I have a slot tomorrow at 2pm, would that work for you?").isRead(true).build());
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(1)).senderType("CLIENT")
                .content("That works perfectly. Thank you for accommodating on short notice.").isRead(true).build());

        // Vikram's thread
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(2)).senderType("CLIENT")
                .content("Ma'am I tried the digital detox after 8pm. It was difficult the first two days but now I sleep better.").isRead(true).build());
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(2)).senderType("THERAPIST")
                .content("Great job Vikram! The first few days are always the hardest. Your body is adjusting. Keep going.").isRead(true).build());

        // Priya's thread
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(3)).senderType("CLIENT")
                .content("Hi Doctor, we tried the communication exercise you suggested. It went better than expected.").isRead(true).build());
        chatMessageRepository.save(ChatMessage.builder().therapist(t).client(clients.get(3)).senderType("THERAPIST")
                .content("Happy to hear that Priya! The Gottman approach works well. We'll build on this in our next session.").isRead(true).build());
    }
}
