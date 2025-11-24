package org.example.server.dto.document;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.example.server.enums.DocumentType;
import org.example.server.enums.ReviewStatus;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record DocumentResponseDTO(
        Long id,
        DocumentType documentType,
        String contentType,
        Long sizeBytes,
        ReviewStatus reviewStatus,
        String reviewComment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
){}