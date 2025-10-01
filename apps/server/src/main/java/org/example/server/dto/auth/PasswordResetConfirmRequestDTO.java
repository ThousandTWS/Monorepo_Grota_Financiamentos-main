package org.example.server.dto.auth;

public record PasswordResetConfirmRequestDTO(
        String email,
        String code,
        String newPassword
) {}
