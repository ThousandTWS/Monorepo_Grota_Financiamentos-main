package org.example.server.dto.billing;

import org.example.server.enums.BillingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BillingContractDetailsDTO(
        String contractNumber,
        Long proposalId,
        BillingStatus status,
        LocalDate paidAt,
        LocalDate startDate,
        BigDecimal financedValue,
        BigDecimal installmentValue,
        Integer installmentsTotal,
        BigDecimal outstandingBalance,
        BigDecimal remainingBalance,
        BillingCustomerDTO customer,
        BillingVehicleDTO vehicle,
        List<BillingInstallmentDTO> installments,
        List<BillingOccurrenceDTO> occurrences,
        List<BillingContractSummaryDTO> otherContracts,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
