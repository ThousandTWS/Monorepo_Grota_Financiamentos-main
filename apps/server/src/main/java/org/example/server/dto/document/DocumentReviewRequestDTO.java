package org.example.server.dto.document;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.server.enums.ReviewStatus;

public record DocumentReviewRequestDTO(

        @NotNull(message = "O status da revisão é obrigatório (APROVADO ou REPROVADO)")
        ReviewStatus reviewStatus,

        @NotNull(message = "O comentário é obrigatório")
        @Size(max = 255, message = "O comentário pode ter no máximo 255 caracteres")
        String reviewComment
) {
}
