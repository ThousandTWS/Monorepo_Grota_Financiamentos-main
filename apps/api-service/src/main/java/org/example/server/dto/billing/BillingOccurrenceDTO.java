package org.example.server.dto.billing;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record BillingOccurrenceDTO(
        Long id,
        LocalDate date,
        String contact,
        String note,
        LocalDateTime createdAt
) {
}
