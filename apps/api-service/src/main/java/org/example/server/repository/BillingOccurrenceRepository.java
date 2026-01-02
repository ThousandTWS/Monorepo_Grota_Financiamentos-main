package org.example.server.repository;

import org.example.server.model.BillingContract;
import org.example.server.model.BillingOccurrence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillingOccurrenceRepository extends JpaRepository<BillingOccurrence, Long> {
    List<BillingOccurrence> findByContractOrderByDateDesc(BillingContract contract);
}
