package org.example.server.dto.document;

import jakarta.validation.constraints.NotNull;
import org.example.server.enums.DocumentType;
import org.springframework.web.multipart.MultipartFile;

public record DocumentUploadRequestDTO(
        @NotNull(message = "O tipo de documento é obrigatório.")
        DocumentType documentType,

        @NotNull(message = "O arquivo da imagem é obrigatório.")
        MultipartFile file
) {
}
