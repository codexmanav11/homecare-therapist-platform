package com.unfazed.controller;

import com.unfazed.dto.DTOs.ClientDTO;
import com.unfazed.dto.DTOs.EntitlementCheckResponse;
import com.unfazed.entity.Client;
import com.unfazed.entity.Therapist;
import com.unfazed.repository.ClientRepository;
import com.unfazed.repository.TherapistRepository;
import com.unfazed.service.EntitlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TherapistRepository therapistRepository;

    @Autowired
    private EntitlementService entitlementService;

    @GetMapping("/therapist/{therapistId}")
    public ResponseEntity<?> getClientsByTherapist(@PathVariable Long therapistId) {
        List<Client> clients = clientRepository.findByTherapistId(therapistId);
        List<ClientDTO> dtos = clients.stream().map(c -> ClientDTO.builder()
                .id(c.getId())
                .therapistId(c.getTherapist().getId())
                .name(c.getName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .status(c.getStatus())
                .tags(c.getTags())
                .presentingConcern(c.getPresentingConcern())
                .demographics(c.getDemographics())
                .consentSigned(c.getConsentSigned())
                .consentTimestamp(c.getConsentTimestamp() != null ? c.getConsentTimestamp().toString() : null)
                .build()).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addClient(@RequestBody ClientDTO dto) {
        Therapist therapist = therapistRepository.findById(dto.getTherapistId()).orElse(null);
        if (therapist == null) return ResponseEntity.badRequest().body("Therapist not found");

        Client client = Client.builder()
                .therapist(therapist)
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .status("ACTIVE")
                .tags(dto.getTags() != null ? dto.getTags() : List.of("NEW"))
                .presentingConcern(dto.getPresentingConcern())
                .demographics(dto.getDemographics())
                .consentSigned(dto.getConsentSigned() != null ? dto.getConsentSigned() : true)
                .consentTimestamp(LocalDateTime.now())
                .build();

        Client saved = clientRepository.save(client);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/consent/{clientId}")
    public ResponseEntity<?> signConsent(@PathVariable Long clientId) {
        Client client = clientRepository.findById(clientId).orElse(null);
        if (client == null) return ResponseEntity.notFound().build();

        client.setConsentSigned(true);
        client.setConsentTimestamp(LocalDateTime.now());
        clientRepository.save(client);

        return ResponseEntity.ok("Consent signed and timestamped at " + client.getConsentTimestamp());
    }
}
