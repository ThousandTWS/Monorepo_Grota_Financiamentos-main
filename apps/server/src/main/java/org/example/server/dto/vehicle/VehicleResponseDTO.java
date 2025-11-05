package org.example.server.dto.vehicle;

import org.example.server.enums.VehicleStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VehicleResponseDTO(
        Long id,
        String name,
        String color,
        String plate,
        LocalDate modelYear,
        Integer km,
        String condition,
        String transmission,
        BigDecimal price,
        VehicleStatus status,
        Long dealer
) {}
