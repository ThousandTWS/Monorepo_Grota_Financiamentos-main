package org.example.server.dto.vehicle;

import jakarta.validation.constraints.*;
import org.example.server.enums.Condition;
import org.example.server.enums.Transmission;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VehicleRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres")
        String name,

        @NotBlank(message = "A cor é obrigatória")
        @Size(min = 2, max = 50, message = "A cor deve ter entre 2 e 50 caracteres")
        String color,

        @NotBlank(message = "A placa é obrigatória")
        String plate,

        @NotNull(message = "O ano do modelo é obrigatório")
        LocalDate modelYear,

        @NotNull(message = "A quilometragem é obrigatória")
        @Min(value = 0, message = "A quilometragem não pode ser negativa")
        @Max(value = 1000000, message = "A quilometragem não pode exceder 1.000.000 km")
        Integer km,

        @NotNull(message = "A condição é obrigatória")
        Condition condition,

        @NotNull(message = "O tipo de transmissão é obrigatório")
        Transmission transmission,

        @NotNull(message = "O preço é obrigatório")
        @DecimalMin(value = "0.0", inclusive = false, message = "O preço deve ser maior que zero")
        BigDecimal price
) {}
