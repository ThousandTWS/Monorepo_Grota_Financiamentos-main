package org.example.server.dto.billing;

public record BillingVehicleUpdateDTO(
        String plate,
        String renavam,
        Boolean dutIssued,
        Boolean dutPaid,
        java.time.LocalDate dutPaidDate
) {
}
