package com.unfazed.repository;

import com.unfazed.entity.SessionPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionPackageRepository extends JpaRepository<SessionPackage, Long> {
    List<SessionPackage> findByTherapistId(Long therapistId);
    List<SessionPackage> findByClientId(Long clientId);
}
