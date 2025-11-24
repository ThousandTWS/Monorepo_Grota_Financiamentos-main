package org.example.server.dto.proposal;

import org.example.server.enums.ProposalStatus;

public record ProposalStatusUpdateDTO(
        ProposalStatus status,
        String notes
) {
}
