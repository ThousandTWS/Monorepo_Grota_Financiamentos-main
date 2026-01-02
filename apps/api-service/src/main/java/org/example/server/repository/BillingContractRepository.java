package org.example.server.repository;

import org.example.server.enums.BillingStatus;
import org.example.server.model.BillingContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BillingContractRepository extends JpaRepository<BillingContract, Long> {

    Optional<BillingContract> findByContractNumber(String contractNumber);

    Optional<BillingContract> findByProposalId(Long proposalId);

    @Query("""
            select c from BillingContract c
            where (:name is null or lower(c.customerName) like lower(concat('%', :name, '%')))
              and (:document is null or c.customerDocument like concat('%', :document, '%'))
              and (:contractNumber is null or c.contractNumber like concat('%', :contractNumber, '%'))
              and (:status is null or c.status = :status)
            order by c.createdAt desc
            """)
    List<BillingContract> search(
            @Param("name") String name,
            @Param("document") String document,
            @Param("contractNumber") String contractNumber,
            @Param("status") BillingStatus status
    );

    List<BillingContract> findByCustomerDocumentAndContractNumberNot(String customerDocument, String contractNumber);
}
