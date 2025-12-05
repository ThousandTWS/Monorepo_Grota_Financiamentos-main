package org.example.server.dto.proposal;

import org.example.server.enums.ProposalStatus;

import java.time.LocalDateTime;

public record ProposalEventResponseDTO(
        Long id,
        Long proposalId,
        String type,
        ProposalStatus statusFrom,
        ProposalStatus statusTo,
        String note,
        String actor,
        String payload,
        LocalDateTime createdAt
) {
}
