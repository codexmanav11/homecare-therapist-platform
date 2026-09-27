package com.unfazed.controller;

import com.unfazed.dto.DTOs.EntitlementCheckResponse;
import com.unfazed.dto.DTOs.NoteRequest;
import com.unfazed.dto.DTOs.NoteResponse;
import com.unfazed.entity.Client;
import com.unfazed.entity.SessionNote;
import com.unfazed.entity.Therapist;
import com.unfazed.repository.ClientRepository;
import com.unfazed.repository.SessionBookingRepository;
import com.unfazed.repository.SessionNoteRepository;
import com.unfazed.repository.TherapistRepository;
import com.unfazed.service.EntitlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class NoteController {

    @Autowired
    private SessionNoteRepository noteRepository;

    @Autowired
    private TherapistRepository therapistRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private SessionBookingRepository bookingRepository;

    @Autowired
    private EntitlementService entitlementService;

    // THERAPIST ENDPOINT: Can retrieve ALL notes (Private & Shared)
    @GetMapping("/notes/therapist/{therapistId}")
    public ResponseEntity<?> getNotesForTherapist(@PathVariable Long therapistId) {
        List<SessionNote> notes = noteRepository.findByTherapistId(therapistId);
        List<NoteResponse> responses = notes.stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // CLIENT-FACING ENDPOINT: MUST ONLY return SHARED notes!
    @GetMapping("/public/notes/shared/{clientId}")
    public ResponseEntity<?> getSharedNotesForClient(@PathVariable Long clientId) {
        // Enforce strict filter: noteType == "SHARED"
        List<SessionNote> sharedNotes = noteRepository.findByClientIdAndNoteType(clientId, "SHARED");
        List<NoteResponse> responses = sharedNotes.stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/notes/create")
    public ResponseEntity<?> createNote(@RequestParam Long therapistId, @RequestBody NoteRequest request) {
        Therapist therapist = therapistRepository.findById(therapistId).orElse(null);
        Client client = clientRepository.findById(request.getClientId()).orElse(null);

        if (therapist == null || client == null) {
            return ResponseEntity.badRequest().body("Therapist or Client not found");
        }

        SessionNote note = SessionNote.builder()
                .therapist(therapist)
                .client(client)
                .sessionBooking(request.getBookingId() != null ? bookingRepository.findById(request.getBookingId()).orElse(null) : null)
                .noteType(request.getNoteType() != null ? request.getNoteType().toUpperCase() : "PRIVATE")
                .templateType(request.getTemplateType() != null ? request.getTemplateType().toUpperCase() : "FREEFORM")
                .bodyText(request.getBodyText())
                .subjectiveContent(request.getSubjectiveContent())
                .objectiveContent(request.getObjectiveContent())
                .assessmentContent(request.getAssessmentContent())
                .planContent(request.getPlanContent())
                .build();

        SessionNote saved = noteRepository.save(note);
        return ResponseEntity.ok(mapToResponse(saved));
    }

    private NoteResponse mapToResponse(SessionNote n) {
        return NoteResponse.builder()
                .id(n.getId())
                .therapistId(n.getTherapist().getId())
                .clientId(n.getClient().getId())
                .clientName(n.getClient().getName())
                .bookingId(n.getSessionBooking() != null ? n.getSessionBooking().getId() : null)
                .noteType(n.getNoteType())
                .templateType(n.getTemplateType())
                .bodyText(n.getBodyText())
                .subjectiveContent(n.getSubjectiveContent())
                .objectiveContent(n.getObjectiveContent())
                .assessmentContent(n.getAssessmentContent())
                .planContent(n.getPlanContent())
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")) : null)
                .build();
    }
}
