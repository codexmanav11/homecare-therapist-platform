package com.unfazed.controller;

import com.unfazed.dto.DTOs.TherapistDTO;
import com.unfazed.entity.Therapist;
import com.unfazed.repository.TherapistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TherapistController {

    @Autowired
    private TherapistRepository therapistRepository;

    @GetMapping("/public/therapist/{slug}")
    public ResponseEntity<?> getPublicProfileBySlug(@PathVariable String slug) {
        Therapist therapist = therapistRepository.findBySlug(slug)
                .orElse(null);

        if (therapist == null) {
            return ResponseEntity.notFound().build();
        }

        TherapistDTO dto = TherapistDTO.builder()
                .id(therapist.getId())
                .name(therapist.getName())
                .email(therapist.getEmail())
                .slug(therapist.getSlug())
                .title(therapist.getTitle())
                .bio(therapist.getBio())
                .experienceYears(therapist.getExperienceYears())
                .consultationFee(therapist.getConsultationFee())
                .specializations(therapist.getSpecializations())
                .languages(therapist.getLanguages())
                .subscriptionTier(therapist.getSubscriptionTier())
                .avatarUrl(therapist.getAvatarUrl())
                .build();

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/therapist/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody TherapistDTO dto) {
        Therapist therapist = therapistRepository.findById(id).orElse(null);
        if (therapist == null) return ResponseEntity.notFound().build();

        if (dto.getName() != null) therapist.setName(dto.getName());
        if (dto.getTitle() != null) therapist.setTitle(dto.getTitle());
        if (dto.getBio() != null) therapist.getBio();
        if (dto.getConsultationFee() != null) therapist.setConsultationFee(dto.getConsultationFee());
        if (dto.getSpecializations() != null) therapist.setSpecializations(dto.getSpecializations());
        if (dto.getLanguages() != null) therapist.setLanguages(dto.getLanguages());

        Therapist updated = therapistRepository.save(therapist);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/therapist/{id}/tier")
    public ResponseEntity<?> updateTier(@PathVariable Long id, @RequestParam String tier) {
        Therapist therapist = therapistRepository.findById(id).orElse(null);
        if (therapist == null) return ResponseEntity.notFound().build();

        therapist.setSubscriptionTier(tier.toUpperCase());
        therapistRepository.save(therapist);
        return ResponseEntity.ok("Subscription updated to " + tier.toUpperCase());
    }
}
