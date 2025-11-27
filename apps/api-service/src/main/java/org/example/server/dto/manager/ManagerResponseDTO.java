package org.example.server.dto.manager;

import org.example.server.enums.UserStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ManagerResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String CPF,
        LocalDate birthData,
        UserStatus status,
        LocalDateTime createdAt
) {}
