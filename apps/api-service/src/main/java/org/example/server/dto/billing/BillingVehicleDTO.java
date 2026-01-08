package org.example.server.dto.billing;

public record BillingVehicleDTO(
        String brand,
        String model,
        Integer year,
        String plate,
        String renavam,
        Boolean dutIssued,
        Boolean dutPaid,
        java.time.LocalDate dutPaidDate
) {
}
