package com.unfazed.repository;

import com.unfazed.entity.SubscriptionTierConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionTierConfigRepository extends JpaRepository<SubscriptionTierConfig, Long> {
    Optional<SubscriptionTierConfig> findByTierName(String tierName);
}
