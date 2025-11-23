package org.example.server.dto.document;

import org.example.server.enums.DocumentType;
import org.example.server.enums.ReviewStatus;

import java.time.LocalDateTime;

public record DocumentResponseDTO(
        Long id,
        DocumentType documentType,
        String s3Key,
        String contentType,
        Long sizeBytes,
        ReviewStatus reviewStatus,
        String reviewComment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
){}