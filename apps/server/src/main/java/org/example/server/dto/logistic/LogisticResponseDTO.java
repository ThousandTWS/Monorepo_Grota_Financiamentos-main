package org.example.server.dto.logistic;

public record LogisticResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String enterprise
){}
