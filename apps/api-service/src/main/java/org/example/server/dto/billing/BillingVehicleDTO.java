package org.example.server.dto.billing;

public record BillingVehicleDTO(
        String brand,
        String model,
        Integer year,
        String plate,
        String renavam,
        Boolean dutIssued
) {
}
