package org.example.server.service.factory;

import org.example.server.dto.proposal.ProposalEventResponseDTO;
import org.example.server.enums.ProposalStatus;
import org.example.server.model.Proposal;
import org.example.server.model.ProposalEvent;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ProposalEventFactoryTests {

    @Test
    void createEventAndResponse() {
        ProposalEventFactory factory = new ProposalEventFactory();
        Proposal proposal = new Proposal();
        proposal.getId();

        ProposalEvent event = factory.create(
                proposal,
                "STATUS_CHANGED",
                ProposalStatus.PENDING,
                ProposalStatus.APPROVED,
                null,
                "Mudança automática",
                "{\"reason\":\"auto\"}"
        );

        assertEquals("system", event.getActor());
        assertEquals(ProposalStatus.PENDING, event.getStatusFrom());
        assertEquals(ProposalStatus.APPROVED, event.getStatusTo());
        assertEquals(proposal, event.getProposal());

        ProposalEventResponseDTO response = factory.toResponse(event);
        assertEquals(event.getId(), response.id());
        assertEquals(event.getActor(), response.actor());
        assertEquals(event.getPayload(), response.payload());
        assertEquals(event.getCreatedAt(), response.createdAt());
    }
}
