package org.example.server.dto.logistic;

import org.example.server.dto.address.AddressDTO;
import org.example.server.enums.UserVerificationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record LogisticDetailsResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String enterprise,
        UserVerificationStatus status,
        String fullNameEnterprise,
        LocalDate birthData,
        String cnpj,
        AddressDTO address,
        LocalDateTime createdAt
) {
}
