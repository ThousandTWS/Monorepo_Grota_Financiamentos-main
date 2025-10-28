package org.example.server.dto.user;

public record UserRequestDTO(
        String fullName,
        String email,
        String password
) {
}
