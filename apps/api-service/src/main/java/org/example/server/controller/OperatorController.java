package org.example.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.server.dto.operator.OperatorRequestDTO;
import org.example.server.dto.operator.OperatorResponseDTO;
import org.example.server.model.User;
import org.example.server.service.OperatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/grota-financiamentos/operators")
@Tag(name = "Operator", description = "Operator management")
public class OperatorController {

    private final OperatorService operatorService;

    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }

    @PostMapping
    @Operation(
            summary = "Cadastrar operador",
            description = "Cadastra um operador no banco de dados"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Operador cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<OperatorResponseDTO> create(@AuthenticationPrincipal User user, @Valid @RequestBody OperatorRequestDTO operatorRequestDTO) {
        OperatorResponseDTO operator = operatorService.create(user, operatorRequestDTO);
        return ResponseEntity.ok(operator);
    }

    @GetMapping
    @Operation(
            summary = "Listar Operadores",
            description = "Retorna uma lista de Operadores, ordenada por nome (10 por página)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de Operadores retornada com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<List<OperatorResponseDTO>> findAll(){
        List<OperatorResponseDTO> operators = operatorService.findAll();
        return ResponseEntity.ok().body(operators);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obter Operador por ID",
            description = "Retorna os dados de um operador com base no ID informado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Operador encontrado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "404", description = "Operador não encontrado para o ID fornecido"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<OperatorResponseDTO> findById(@PathVariable Long id){
        OperatorResponseDTO operator = operatorService.findById(id);
        return ResponseEntity.ok().body(operator);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Atualizar Operador por ID",
            description = "Atualiza os dados de um operador com base no ID informado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Operador atualizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<OperatorResponseDTO> update(@PathVariable Long id, @Valid @RequestBody OperatorRequestDTO operatorRequestDTO){
        OperatorResponseDTO operator = operatorService.update(id, operatorRequestDTO);
        return ResponseEntity.ok().body(operator);
    }
}
