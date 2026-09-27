package com.unfazed.repository;

import com.unfazed.entity.SessionNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionNoteRepository extends JpaRepository<SessionNote, Long> {
    List<SessionNote> findByTherapistId(Long therapistId);
    List<SessionNote> findByClientId(Long clientId);
    List<SessionNote> findByClientIdAndNoteType(Long clientId, String noteType);
    List<SessionNote> findByTherapistIdAndClientId(Long therapistId, Long clientId);
}
