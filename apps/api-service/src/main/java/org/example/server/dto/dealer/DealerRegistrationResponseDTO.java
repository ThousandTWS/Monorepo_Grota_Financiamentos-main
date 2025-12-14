package org.example.server.dto.dealer;

import org.example.server.enums.UserStatus;

public record DealerRegistrationResponseDTO(
        Long id,
        String fullName,
        String razaoSocial,
        String cnpj,
        String referenceCode,
        String phone,
        String enterprise,
        String logoUrl,
        UserStatus status,
        java.time.LocalDateTime createdAt
){} 
