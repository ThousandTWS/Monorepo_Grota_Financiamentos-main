package org.example.server.dto.proposal;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProposalRequestDTO(
        Long dealerId,
        Long sellerId,
        String customerName,
        String customerCpf,
        LocalDate customerBirthDate,
        String customerEmail,
        String customerPhone,
        String cnhCategory,
        boolean hasCnh,
        String vehiclePlate,
        String fipeCode,
        BigDecimal fipeValue,
        String vehicleBrand,
        String vehicleModel,
        Integer vehicleYear,
        BigDecimal downPaymentValue,
        BigDecimal financedValue,
        String notes
) {
}
