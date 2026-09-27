package com.unfazed.repository;

import com.unfazed.entity.SessionBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionBookingRepository extends JpaRepository<SessionBooking, Long> {
    List<SessionBooking> findByTherapistId(Long therapistId);
    List<SessionBooking> findByClientId(Long clientId);
    List<SessionBooking> findByTherapistIdAndBookingDate(Long therapistId, String bookingDate);
    boolean existsByTherapistIdAndBookingDateAndStartTimeAndStatusNot(Long therapistId, String bookingDate, String startTime, String status);
    long countByTherapistIdAndStatus(Long therapistId, String status);
}
