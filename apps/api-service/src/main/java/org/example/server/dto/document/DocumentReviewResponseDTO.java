package org.example.server.dto.document;

import org.example.server.enums.ReviewStatus;

import java.time.LocalDateTime;

public record DocumentReviewResponseDTO(
        Long id,
        ReviewStatus reviewStatus,
        String reviewComment,
        String reviewByUsername,
        LocalDateTime reviewedAt
){}
