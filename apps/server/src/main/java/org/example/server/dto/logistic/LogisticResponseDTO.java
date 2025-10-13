package org.example.server.dto.logistic;

import org.example.server.enums.UserVerificationStatus;

import java.time.LocalDateTime;

public record LogisticResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String enterprise,
        UserVerificationStatus status,
        LocalDateTime createdAt
){}
