package org.example.server.repository;

import org.example.server.enums.BillingStatus;
import org.example.server.model.BillingContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface BillingContractRepository extends JpaRepository<BillingContract, Long>, JpaSpecificationExecutor<BillingContract> {

    Optional<BillingContract> findByContractNumber(String contractNumber);

    Optional<BillingContract> findByProposalId(Long proposalId);

    List<BillingContract> findByCustomerDocumentAndContractNumberNot(String customerDocument, String contractNumber);
}
