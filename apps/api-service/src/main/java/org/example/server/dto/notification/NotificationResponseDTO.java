package org.example.server.dto.notification;

import java.time.LocalDateTime;

public record NotificationResponseDTO(
        Long id,
        String title,
        String description,
        String actor,
        String targetType,
        Long targetId,
        String href,
        boolean readFlag,
        LocalDateTime createdAt
) {
}
