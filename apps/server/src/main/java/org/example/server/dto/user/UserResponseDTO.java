package org.example.server.dto.user;

public record UserResponseDTO(
        Long id,
        String fullName,
        String email,
        String role
) {}
