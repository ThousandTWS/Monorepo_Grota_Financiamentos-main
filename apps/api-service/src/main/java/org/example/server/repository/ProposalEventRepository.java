package org.example.server.repository;

import org.example.server.model.Proposal;
import org.example.server.model.ProposalEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalEventRepository extends JpaRepository<ProposalEvent, Long> {
    List<ProposalEvent> findByProposalOrderByCreatedAtAsc(Proposal proposal);
}
