package com.unfazed.repository;

import com.unfazed.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByTherapistId(Long therapistId);
    long countByTherapistIdAndStatus(Long therapistId, String status);
    Optional<Client> findByTherapistIdAndEmail(Long therapistId, String email);
    List<Client> findByTherapistIdAndNameContainingIgnoreCase(Long therapistId, String name);
}
