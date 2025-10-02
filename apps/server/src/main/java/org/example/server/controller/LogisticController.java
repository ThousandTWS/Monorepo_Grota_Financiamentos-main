package org.example.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.example.server.dto.logistic.LogisticRequestDTO;
import org.example.server.dto.logistic.LogisticResponseDTO;
import org.example.server.service.LogisticService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/logistics")
public class LogisticController {

    private final LogisticService logisticService;

    public LogisticController(LogisticService logisticService) {
        this.logisticService = logisticService;
    }

    @PostMapping
    @Operation(
            summary = "Cadastrar Lojista",
            description = "Cadastra um Lojista no banco de dados",
            tags = "Lojista"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Lojista cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<LogisticResponseDTO> create(@Valid @RequestBody LogisticRequestDTO logisticRequestDTO){
        LogisticResponseDTO responseDTO = logisticService.create(logisticRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    @Operation(
            summary = "Listar Lojistas",
            description = "Retorna uma lista de Lojistas, ordenada por nome (10 por página)",
            tags = "Lojista"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de Lojistas retornada com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<List<LogisticResponseDTO>> findAll(){
        List<LogisticResponseDTO> logisticList = logisticService.findAll();
        return ResponseEntity.ok().body(logisticList);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obter Lojistas por ID",
            description = "Retorna os dados de um Lojista com base no ID informado.",
            tags = "Lojista"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lojista encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Lojista não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<LogisticResponseDTO> findById(@PathVariable Long id){
        LogisticResponseDTO logistic = logisticService.findById(id);
        return ResponseEntity.ok().body(logistic);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Atualizar Lojista por ID",
            description = "Atualiza os dados de um Lojista com base no ID informado.",
            tags = "Lojista"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lojista atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Lojista não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<LogisticResponseDTO> update(@Valid @PathVariable Long id, @RequestBody LogisticRequestDTO logisticRequestDTO){
        LogisticResponseDTO logistic = logisticService.update(id, logisticRequestDTO);
        return ResponseEntity.ok().body(logistic);
    }
}

