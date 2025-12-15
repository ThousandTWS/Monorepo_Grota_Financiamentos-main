package org.example.server.repository;

import org.example.server.enums.ProposalStatus;
import org.example.server.model.Dealer;
import org.example.server.model.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByDealer(Dealer dealer);
    List<Proposal> findByStatus(ProposalStatus status);
    List<Proposal> findByDealerAndStatus(Dealer dealer, ProposalStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE Proposal p SET p.seller = null WHERE p.seller.id = :sellerId")
    void detachSellerFromProposals(@Param("sellerId") Long sellerId);
}
