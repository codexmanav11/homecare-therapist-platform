package com.unfazed.repository;

import com.unfazed.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTherapistId(Long therapistId);
    List<Payment> findByClientId(Long clientId);
    Optional<Payment> findByGatewayTransactionId(String gatewayTransactionId);
    Optional<Payment> findByInvoiceNumber(String invoiceNumber);

    @Query("SELECT SUM(p.netAmount) FROM Payment p WHERE p.therapist.id = :therapistId AND p.status = 'SUCCESS'")
    Double calculateTotalRevenueByTherapistId(@Param("therapistId") Long therapistId);
}
