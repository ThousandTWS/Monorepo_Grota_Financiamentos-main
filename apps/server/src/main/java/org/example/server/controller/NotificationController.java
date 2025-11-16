package org.example.server.controller;

import jakarta.validation.Valid;
import org.example.server.dto.notification.NotificationRequestDTO;
import org.example.server.dto.notification.NotificationResponseDTO;
import org.example.server.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponseDTO> create(@Valid @RequestBody NotificationRequestDTO dto) {
        return ResponseEntity.ok(notificationService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> list(
            @RequestParam String targetType,
            @RequestParam(required = false) Long targetId
    ) {
        return ResponseEntity.ok(notificationService.listByTarget(targetType, targetId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }
}
