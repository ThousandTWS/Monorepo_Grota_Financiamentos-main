package org.example.server.service;

import org.example.server.dto.notification.NotificationRequestDTO;
import org.example.server.dto.notification.NotificationResponseDTO;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Notification;
import org.example.server.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public NotificationResponseDTO create(NotificationRequestDTO dto) {
        Notification notification = new Notification();
        notification.setTitle(dto.title());
        notification.setDescription(dto.description());
        notification.setActor(dto.actor());
        notification.setTargetType(dto.targetType());
        notification.setTargetId(dto.targetId());
        notification.setHref(dto.href());
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> listByTarget(String targetType, Long targetId) {
        List<Notification> list;
        if (targetId != null) {
            list = notificationRepository.findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType, targetId);
        } else {
            list = notificationRepository.findByTargetTypeOrderByCreatedAtDesc(targetType);
        }
        return list.stream().map(this::toResponse).toList();
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Notificação não encontrada"));
        notification.setReadFlag(true);
        notificationRepository.save(notification);
    }

    private NotificationResponseDTO toResponse(Notification notification) {
        return new NotificationResponseDTO(
                notification.getId(),
                notification.getTitle(),
                notification.getDescription(),
                notification.getActor(),
                notification.getTargetType(),
                notification.getTargetId(),
                notification.getHref(),
                notification.isReadFlag(),
                notification.getCreatedAt()
        );
    }
}
