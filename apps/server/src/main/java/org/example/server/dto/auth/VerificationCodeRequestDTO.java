package org.example.server.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerificationCodeRequestDTO(
   @NotBlank(message = "O E-mail é obrigatório")
   @Email(message = "E-mail inválido")
   String email,

   @NotBlank(message = "O Codigo é obrigatório")
   String code
) {}
