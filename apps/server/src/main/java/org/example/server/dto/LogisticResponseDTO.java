package org.example.server.dto;

public record LogisticResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String enterprise
){}
