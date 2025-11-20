package org.example.server.dto;

import org.example.server.enums.UserRole;

public record UserResponseDTO(
        Long id,
        String email,
        String fullName,
        UserRole role
) {}
