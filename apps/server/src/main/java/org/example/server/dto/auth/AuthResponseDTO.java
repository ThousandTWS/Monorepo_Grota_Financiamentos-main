package org.example.server.dto.auth;

import java.time.Instant;

public record AuthResponseDTO(
        String accessToken,
        String refreshToken,
        Instant expiresAt,
        String tokenType
) {
    public AuthResponseDTO(String accessToken, String refreshToken, Instant expiresAt) {
        this(accessToken, refreshToken, expiresAt, "Bearer");
    }
}