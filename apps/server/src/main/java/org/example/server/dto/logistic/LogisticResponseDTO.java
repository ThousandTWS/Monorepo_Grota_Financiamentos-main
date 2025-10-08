package org.example.server.dto.logistic;

import org.example.server.enums.UserVerificationStatus;

public record LogisticResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String enterprise,
        UserVerificationStatus status
){}
