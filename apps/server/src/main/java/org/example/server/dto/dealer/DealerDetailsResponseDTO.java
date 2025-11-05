package org.example.server.dto.dealer;

import org.example.server.dto.address.AddressDTO;
import org.example.server.enums.UserStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DealerDetailsResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String enterprise,
        UserStatus status,
        String fullNameEnterprise,
        LocalDate birthData,
        String cnpj,
        AddressDTO address,
        LocalDateTime createdAt
) {
}
