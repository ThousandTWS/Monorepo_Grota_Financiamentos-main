package org.example.server.dto.billing;

import java.time.LocalDate;

public record BillingContractUpdateDTO(
        LocalDate paidAt,
        LocalDate startDate
) {
}
