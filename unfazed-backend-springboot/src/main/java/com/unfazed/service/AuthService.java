package com.unfazed.service;

import com.unfazed.dto.DTOs.AuthRequest;
import com.unfazed.dto.DTOs.AuthResponse;
import com.unfazed.dto.DTOs.RegisterRequest;
import com.unfazed.entity.Therapist;
import com.unfazed.repository.TherapistRepository;
import com.unfazed.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthService {

    @Autowired
    private TherapistRepository therapistRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {
        if (therapistRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
        }
        if (therapistRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis() % 1000;
        }

        Therapist therapist = Therapist.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .slug(slug)
                .title(request.getTitle() != null ? request.getTitle() : "Licensed Psychologist")
                .bio(request.getBio() != null ? request.getBio() : "Compassionate mental health professional.")
                .specializations(request.getSpecializations() != null ? request.getSpecializations() : new ArrayList<>())
                .languages(request.getLanguages() != null ? request.getLanguages() : new ArrayList<>())
                .subscriptionTier("STARTER")
                .consultationFee(1500.0)
                .experienceYears(5)
                .build();

        Therapist saved = therapistRepository.save(therapist);
        String token = jwtTokenProvider.generateToken(saved.getEmail());

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .slug(saved.getSlug())
                .subscriptionTier(saved.getSubscriptionTier())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Therapist therapist = therapistRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), therapist.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(therapist.getEmail());

        return AuthResponse.builder()
                .token(token)
                .id(therapist.getId())
                .name(therapist.getName())
                .email(therapist.getEmail())
                .slug(therapist.getSlug())
                .subscriptionTier(therapist.getSubscriptionTier())
                .build();
    }
}
