package org.example.server.controller;

import org.example.server.dto.LogisticRequestDTO;
import org.example.server.dto.LogisticResponseDTO;
import org.example.server.model.Logistic;
import org.example.server.service.LogisticService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/grota-financiamentos/logistics")
public class LogisticController {

    private final LogisticService logisticService;

    public LogisticController(LogisticService logisticService) {
        this.logisticService = logisticService;
    }

    @PostMapping
    public ResponseEntity<LogisticResponseDTO> create(@RequestBody LogisticRequestDTO logisticRequestDTO){
        LogisticResponseDTO responseDTO = logisticService.create(logisticRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
}
