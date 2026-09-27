package com.unfazed.controller;

import com.unfazed.dto.DTOs.BookingRequest;
import com.unfazed.dto.DTOs.SlotDTO;
import com.unfazed.entity.Availability;
import com.unfazed.entity.Client;
import com.unfazed.entity.SessionBooking;
import com.unfazed.entity.Therapist;
import com.unfazed.repository.AvailabilityRepository;
import com.unfazed.repository.ClientRepository;
import com.unfazed.repository.SessionBookingRepository;
import com.unfazed.repository.TherapistRepository;
import com.unfazed.service.NotificationService;
import com.unfazed.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SchedulingController {

    @Autowired
    private TherapistRepository therapistRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private SessionBookingRepository bookingRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/public/scheduling/slots")
    public ResponseEntity<?> getAvailableSlots(@RequestParam Long therapistId, @RequestParam String date) {
        Therapist therapist = therapistRepository.findById(therapistId).orElse(null);
        if (therapist == null) return ResponseEntity.badRequest().body("Therapist not found");

        LocalDate localDate = LocalDate.parse(date);
        DayOfWeek dayOfWeek = localDate.getDayOfWeek();

        // Standard slots for demo
        List<String> defaultTimes = List.of("09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00");
        List<SlotDTO> slots = new ArrayList<>();

        for (String time : defaultTimes) {
            boolean isBooked = bookingRepository.existsByTherapistIdAndBookingDateAndStartTimeAndStatusNot(
                    therapistId, date, time, "CANCELLED");

            int startHour = Integer.parseInt(time.split(":")[0]);
            String endTime = String.format("%02d:50", startHour);

            slots.add(SlotDTO.builder()
                    .date(date)
                    .startTime(time)
                    .endTime(endTime)
                    .available(!isBooked)
                    .build());
        }

        return ResponseEntity.ok(slots);
    }

    @PostMapping("/scheduling/book")
    public ResponseEntity<?> bookSession(@RequestBody BookingRequest request) {
        Therapist therapist = therapistRepository.findById(request.getTherapistId())
                .orElse(null);
        if (therapist == null) return ResponseEntity.badRequest().body("Therapist not found");

        // Double-booking check
        boolean exists = bookingRepository.existsByTherapistIdAndBookingDateAndStartTimeAndStatusNot(
                request.getTherapistId(), request.getBookingDate(), request.getStartTime(), "CANCELLED");
        if (exists) {
            return ResponseEntity.badRequest().body("This time slot has already been booked. Please choose another slot.");
        }

        // Find or create Client
        Client client = clientRepository.findByTherapistIdAndEmail(therapist.getId(), request.getClientEmail())
                .orElseGet(() -> Client.builder()
                        .therapist(therapist)
                        .name(request.getClientName())
                        .email(request.getClientEmail())
                        .phone(request.getClientPhone())
                        .status("ACTIVE")
                        .consentSigned(true)
                        .tags(List.of("NEW_CLIENT"))
                        .build());

        clientRepository.save(client);

        // Create Booking
        SessionBooking booking = SessionBooking.builder()
                .therapist(therapist)
                .client(client)
                .bookingDate(request.getBookingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .clientTimezone(request.getClientTimezone() != null ? request.getClientTimezone() : "Asia/Kolkata")
                .amountPaid(therapist.getConsultationFee())
                .meetingLink("https://meet.unfazed.in/room-" + System.currentTimeMillis() % 10000)
                .status("CONFIRMED")
                .build();

        SessionBooking savedBooking = bookingRepository.save(booking);

        // Record Payment & Trigger Notifications
        paymentService.recordPayment(therapist, client, savedBooking, therapist.getConsultationFee(), request.getPaymentMethod(), null);
        notificationService.sendBookingConfirmationNotification(client.getName(), client.getEmail(), request.getBookingDate(), request.getStartTime(), therapist.getName());

        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/scheduling/bookings/therapist/{therapistId}")
    public ResponseEntity<?> getTherapistBookings(@PathVariable Long therapistId) {
        List<SessionBooking> bookings = bookingRepository.findByTherapistId(therapistId);
        return ResponseEntity.ok(bookings);
    }
}
