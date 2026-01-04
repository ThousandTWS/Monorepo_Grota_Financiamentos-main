package org.example.server.dto.billing;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BillingInstallmentDTO(
        Integer number,
        LocalDate dueDate,
        BigDecimal amount,
        boolean paid,
        LocalDate paidAt,
        Integer daysLate
) {
}
