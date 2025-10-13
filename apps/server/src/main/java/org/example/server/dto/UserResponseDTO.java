package org.example.server.dto;

public record UserResponseDTO(
        Long id,
        String email,
        String fullName
) {}
