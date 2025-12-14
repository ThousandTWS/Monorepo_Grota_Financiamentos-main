package org.example.server.service.factory;

import org.example.server.dto.proposal.ProposalEventResponseDTO;
import org.example.server.enums.ProposalStatus;
import org.example.server.model.Proposal;
import org.example.server.model.ProposalEvent;
import org.springframework.stereotype.Component;

@Component
public class ProposalEventFactory {

    public ProposalEvent create(
            Proposal proposal,
            String type,
            ProposalStatus statusFrom,
            ProposalStatus statusTo,
            String actor,
            String note,
            String payload
    ) {
        ProposalEvent event = new ProposalEvent();
        event.setProposal(proposal);
        event.setType(type);
        event.setStatusFrom(statusFrom);
        event.setStatusTo(statusTo);
        event.setActor(actor != null ? actor : "system");
        event.setNote(note);
        event.setPayload(payload);
        return event;
    }

    public ProposalEventResponseDTO toResponse(ProposalEvent event) {
        return new ProposalEventResponseDTO(
                event.getId(),
                event.getProposal() != null ? event.getProposal().getId() : null,
                event.getType(),
                event.getStatusFrom(),
                event.getStatusTo(),
                event.getNote(),
                event.getActor(),
                event.getPayload(),
                event.getCreatedAt()
        );
    }
}
