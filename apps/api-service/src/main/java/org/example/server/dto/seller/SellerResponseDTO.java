package org.example.server.dto.seller;

import org.example.server.dto.address.AddressDTO;
import org.example.server.enums.UserStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SellerResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String CPF,
        LocalDate birthData,
        UserStatus status,
        LocalDateTime createdAt
) {}
