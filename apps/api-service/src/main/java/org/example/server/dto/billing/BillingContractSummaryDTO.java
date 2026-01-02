package org.example.server.dto.billing;

import org.example.server.enums.BillingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BillingContractSummaryDTO(
        String contractNumber,
        BillingStatus status,
        LocalDate paidAt,
        LocalDate startDate,
        BigDecimal installmentValue,
        Integer installmentsTotal,
        BillingCustomerDTO customer,
        LocalDateTime createdAt
) {
}
