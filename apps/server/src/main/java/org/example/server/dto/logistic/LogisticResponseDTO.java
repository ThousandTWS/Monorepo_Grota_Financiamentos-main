package org.example.server.dto.logistic;

import org.example.server.enums.VerifiedUser;

public record LogisticResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String enterprise,
        VerifiedUser status
){}
