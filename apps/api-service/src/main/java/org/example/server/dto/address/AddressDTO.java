package org.example.server.dto.address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressDTO(
        @NotBlank(message = "A rua é obrigatória")
        @Size(min = 2, max = 255, message = "A rua deve ter entre 2 e 255 caracteres")
        String street,

        @NotBlank(message = "O número é obrigatório")
        @Size(max = 20, message = "O número deve ter no máximo 20 caracteres")
        String number,

        @Size(max = 255, message = "O complemento deve ter no máximo 255 caracteres")
        String complement,

        @NotBlank(message = "O bairro é obrigatório")
        @Size(min = 2, max = 100, message = "O bairro deve ter entre 2 e 100 caracteres")
        String neighborhood,

        @NotBlank(message = "O estado é obrigatório")
        @Size(min = 2, max = 2, message = "O estado deve ser a sigla com 2 caracteres")
        @Pattern(regexp = "[A-Z]{2}", message = "O estado deve ser uma sigla válida (ex: SP, RJ)")
        String state,

        @NotBlank(message = "O CEP é obrigatório")
        @Pattern(regexp = "\\d{8}", message = "O CEP deve conter exatamente 8 dígitos")
        String zipCode
) {
}
