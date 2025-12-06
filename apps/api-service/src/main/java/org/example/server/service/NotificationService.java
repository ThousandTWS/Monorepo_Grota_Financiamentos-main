package org.example.server.service;

import org.example.server.dto.notification.NotificationRequestDTO;
import org.example.server.dto.notification.NotificationResponseDTO;
import org.example.server.dto.pagination.PagedResponseDTO;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Notification;
import org.example.server.repository.NotificationRepository;
import org.example.server.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationStreamService notificationStreamService;

    public NotificationService(NotificationRepository notificationRepository, NotificationStreamService notificationStreamService) {
        this.notificationRepository = notificationRepository;
        this.notificationStreamService = notificationStreamService;
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
        NotificationResponseDTO response = toResponse(notificationRepository.save(notification));

        // Dispara em tempo real para os assinantes SSE
        notificationStreamService.broadcast(response);

        return response;
    }

    @Transactional(readOnly = true)
    public PagedResponseDTO<NotificationResponseDTO> listByTarget(String targetType, Long targetId, int page, int size) {
        Pageable pageable = PaginationUtils.buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> list;
        if (targetId != null) {
            list = notificationRepository.findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType, targetId, pageable);
        } else {
            list = notificationRepository.findByTargetTypeOrderByCreatedAtDesc(targetType, pageable);
        }
        return PagedResponseDTO.fromPage(list.map(this::toResponse));
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
