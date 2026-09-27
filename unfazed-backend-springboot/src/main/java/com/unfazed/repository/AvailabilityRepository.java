package com.unfazed.repository;

import com.unfazed.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByTherapistId(Long therapistId);
    List<Availability> findByTherapistIdAndDayOfWeek(Long therapistId, String dayOfWeek);
    List<Availability> findByTherapistIdAndSpecificDate(Long therapistId, String specificDate);
}
