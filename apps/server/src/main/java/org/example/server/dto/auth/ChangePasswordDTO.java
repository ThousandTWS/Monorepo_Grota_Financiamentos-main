package org.example.server.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordDTO(
        @NotBlank(message = "A senha antiga é obrigatoria")
        String oldPassword,

        @NotBlank(message = "A nova senha é obrigatoria")
        @Size(min = 8)
        String newPassword
) {
}
