package org.example.server.dto.logistic;

import org.example.server.dto.address.AddressDTO;

import java.time.LocalDate;

public record LogisticProfileDTO(
    String fullName,
    LocalDate birthData,
    String cnpj,
    AddressDTO address
) {}
