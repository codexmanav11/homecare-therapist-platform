package com.unfazed.repository;

import com.unfazed.entity.Therapist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TherapistRepository extends JpaRepository<Therapist, Long> {
    Optional<Therapist> findByEmail(String email);
    Optional<Therapist> findBySlug(String slug);
    boolean existsByEmail(String email);
    boolean existsBySlug(String slug);
}
