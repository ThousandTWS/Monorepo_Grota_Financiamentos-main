package org.example.server.dto.operator;

import org.example.server.enums.UserStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record OperatorResponseDTO(
        Long id,
        Long dealerId,
        String fullName,
        String email,
        String phone,
        String CPF,
        LocalDate birthData,
        UserStatus status,
        LocalDateTime createdAt,
        Boolean canView,
        Boolean canCreate,
        Boolean canUpdate,
        Boolean canDelete
) {}
