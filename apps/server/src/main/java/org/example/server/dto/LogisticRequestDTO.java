package org.example.server.dto;

public record LogisticRequestDTO(
        String fullName,
        String email,
        String phone,
        String enterprise,
        String password
){}
