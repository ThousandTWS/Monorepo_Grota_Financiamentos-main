package org.example.server.dto.notification;

public record NotificationRequestDTO(
        String title,
        String description,
        String actor,
        String targetType,
        Long targetId,
        String href
) {
}
