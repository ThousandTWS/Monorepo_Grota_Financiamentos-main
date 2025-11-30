package org.example.server.dto.dealer;

import org.example.server.enums.UserStatus;

import java.time.LocalDateTime;

public record DealerRegistrationResponseDTO(
        Long id,
        String fullName,
        String razaoSocial,
        String cnpj,
        String referenceCode,
        String phone,
        String enterprise,
        UserStatus status,
        LocalDateTime createdAt
){} 
