package org.example.server.dto.billing;

public record BillingVehicleUpdateDTO(
        String plate,
        String renavam,
        Boolean dutIssued
) {
}
