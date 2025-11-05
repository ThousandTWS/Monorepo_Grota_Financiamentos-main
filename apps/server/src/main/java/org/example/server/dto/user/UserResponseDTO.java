package org.example.server.dto.user;

import org.example.server.enums.UserStatus;

import java.time.LocalDateTime;

public record UserResponseDTO(
        Long id,
        String fullName,
        String email,
        UserStatus status,
        String role,
        LocalDateTime createdAt
) {}
