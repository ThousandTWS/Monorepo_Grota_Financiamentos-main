package org.example.server.dto.seller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.example.server.dto.address.AddressDTO;

import java.time.LocalDate;

public record SellerRequestDTO(
        @NotBlank(message = "O nome completo é obrigatório")
        @Size(min = 2, max = 100, message = "O nome completo deve ter entre 2 a 100 caracteres")
        String fullName,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        String email,

        @NotBlank(message = "O telefone é obrigatório")
        String phone,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, max = 8, message = "A senha deve ter entre 6 e 8 caracteres")
        String password,

        @NotBlank(message = "O CPF é obrigatório")
        @Size(min = 11, max = 14, message = "O CPF deve ter entre 11 ou 14 caracteres")
        String CPF,

        @Past(message = "A data de nascimento deve ser uma data no passado")
        LocalDate birthData,

        @Valid
        AddressDTO address
) {}
