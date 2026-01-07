package org.example.server.dto.billing;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record BillingInstallmentDueDateUpdateDTO(
        @NotNull(message = "A data de vencimento e obrigatoria")
        LocalDate dueDate
) {
}
