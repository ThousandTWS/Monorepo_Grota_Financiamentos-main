package org.example.server.repository;

import org.example.server.model.BillingContract;
import org.example.server.model.BillingInstallment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BillingInstallmentRepository extends JpaRepository<BillingInstallment, Long> {
    List<BillingInstallment> findByContractOrderByNumberAsc(BillingContract contract);

    Optional<BillingInstallment> findByContractAndNumber(BillingContract contract, Integer number);
}
