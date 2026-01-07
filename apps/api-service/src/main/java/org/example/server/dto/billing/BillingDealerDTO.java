package org.example.server.dto.billing;

public record BillingDealerDTO(
        Long id,
        String enterprise,
        String fullNameEnterprise,
        String cnpj,
        String phone
) {
}
