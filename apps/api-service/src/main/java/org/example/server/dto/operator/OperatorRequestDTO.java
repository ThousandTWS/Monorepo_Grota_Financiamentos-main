package org.example.server.dto.operator;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import org.example.server.dto.address.AddressDTO;

import java.time.LocalDate;

public record OperatorRequestDTO(
        Long dealerId,

        @NotBlank(message = "O nome completo Ǹ obrigat��rio")
        @Size(min = 2, max = 100, message = "O nome completo deve ter entre 2 a 100 caracteres")
        String fullName,

        @NotBlank(message = "O e-mail Ǹ obrigat��rio")
        @Email(message = "E-mail invǭlido")
        String email,

        @NotBlank(message = "O telefone Ǹ obrigat��rio")
        String phone,

        @NotBlank(message = "A senha Ǹ obrigat��ria")
        @Size(min = 6, max = 8, message = "A senha deve ter entre 6 e 8 caracteres")
        String password,

        @NotBlank(message = "O CPF Ǹ obrigat��rio")
        @Size(min = 11, max = 14, message = "O CPF deve ter entre 11 ou 14 caracteres")
        String CPF,

        @Past(message = "A data de nascimento deve ser uma data no passado")
        LocalDate birthData,

        @Valid
        AddressDTO address,

        Boolean canView,
        Boolean canCreate,
        Boolean canUpdate,
        Boolean canDelete
) {}
