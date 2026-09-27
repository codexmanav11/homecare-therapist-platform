package com.unfazed.controller;

import com.unfazed.dto.DTOs.ChatMessageDTO;
import com.unfazed.entity.ChatMessage;
import com.unfazed.entity.Client;
import com.unfazed.entity.Therapist;
import com.unfazed.repository.ChatMessageRepository;
import com.unfazed.repository.ClientRepository;
import com.unfazed.repository.TherapistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private TherapistRepository therapistRepository;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/messages")
    public ResponseEntity<?> getMessages(@RequestParam Long therapistId, @RequestParam Long clientId) {
        List<ChatMessage> messages = chatMessageRepository.findByTherapistIdAndClientIdOrderBySentAtAsc(therapistId, clientId);
        List<ChatMessageDTO> dtos = messages.stream().map(m -> ChatMessageDTO.builder()
                .id(m.getId())
                .therapistId(m.getTherapist().getId())
                .clientId(m.getClient().getId())
                .senderType(m.getSenderType())
                .content(m.getContent())
                .isRead(m.getIsRead())
                .sentAt(m.getSentAt() != null ? m.getSentAt().format(DateTimeFormatter.ofPattern("HH:mm")) : "")
                .build()).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessageDTO dto) {
        Therapist therapist = therapistRepository.findById(dto.getTherapistId()).orElse(null);
        Client client = clientRepository.findById(dto.getClientId()).orElse(null);

        if (therapist == null || client == null) {
            return ResponseEntity.badRequest().body("Therapist or Client not found");
        }

        ChatMessage msg = ChatMessage.builder()
                .therapist(therapist)
                .client(client)
                .senderType(dto.getSenderType() != null ? dto.getSenderType().toUpperCase() : "THERAPIST")
                .content(dto.getContent())
                .isRead(true)
                .build();

        ChatMessage saved = chatMessageRepository.save(msg);
        return ResponseEntity.ok(ChatMessageDTO.builder()
                .id(saved.getId())
                .therapistId(saved.getTherapist().getId())
                .clientId(saved.getClient().getId())
                .senderType(saved.getSenderType())
                .content(saved.getContent())
                .isRead(saved.getIsRead())
                .sentAt(saved.getSentAt().format(DateTimeFormatter.ofPattern("HH:mm")))
                .build());
    }
}
