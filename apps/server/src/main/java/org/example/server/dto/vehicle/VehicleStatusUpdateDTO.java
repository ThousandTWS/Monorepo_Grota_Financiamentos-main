package org.example.server.dto.vehicle;

import jakarta.validation.constraints.NotNull;
import org.example.server.enums.VehicleStatus;

public record VehicleStatusUpdateDTO(
        @NotNull(message = "O status do veículo é obrigatório.")
        VehicleStatus status
) {}
