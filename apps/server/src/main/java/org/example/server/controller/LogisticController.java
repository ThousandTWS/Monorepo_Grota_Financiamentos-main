package org.example.server.controller;

import jakarta.validation.Valid;
import org.example.server.dto.LogisticRequestDTO;
import org.example.server.dto.LogisticResponseDTO;
import org.example.server.service.LogisticService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grota-financiamentos/logistics")
public class LogisticController {

    private final LogisticService logisticService;

    public LogisticController(LogisticService logisticService) {
        this.logisticService = logisticService;
    }

    @PostMapping
    public ResponseEntity<LogisticResponseDTO> create(@Valid @RequestBody LogisticRequestDTO logisticRequestDTO){
        LogisticResponseDTO responseDTO = logisticService.create(logisticRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<LogisticResponseDTO>> findAll(){
        List<LogisticResponseDTO> logisticList = logisticService.findAll();
        return ResponseEntity.ok().body(logisticList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LogisticResponseDTO> findById(@PathVariable Long id){
        LogisticResponseDTO logistic = logisticService.findById(id);
        return ResponseEntity.ok().body(logistic);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LogisticResponseDTO> update(@Valid @PathVariable Long id, @RequestBody LogisticRequestDTO logisticRequestDTO){
        LogisticResponseDTO logistic = logisticService.update(id, logisticRequestDTO);
        return ResponseEntity.ok().body(logistic);
    }
}

