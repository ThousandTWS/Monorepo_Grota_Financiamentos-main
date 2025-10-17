package org.example.server.dto.vehicle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.server.enums.Condition;
import org.example.server.enums.Transmission;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VehicleRequestDTO(
        String name,
        String color,
        String plate,
        LocalDate modelYear,
        Integer km,

        @NotNull
        Condition condition,

        @NotNull
        Transmission transmission,
        BigDecimal price,
        Long logisticId
) {}
