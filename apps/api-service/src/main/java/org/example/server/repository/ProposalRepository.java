package org.example.server.repository;

import org.example.server.enums.ProposalStatus;
import org.example.server.model.Dealer;
import org.example.server.model.Proposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByDealer(Dealer dealer);
    List<Proposal> findByStatus(ProposalStatus status);
    List<Proposal> findByDealerAndStatus(Dealer dealer, ProposalStatus status);
    Page<Proposal> findByDealer(Dealer dealer, Pageable pageable);
    Page<Proposal> findByStatus(ProposalStatus status, Pageable pageable);
    Page<Proposal> findByDealerAndStatus(Dealer dealer, ProposalStatus status, Pageable pageable);
}
