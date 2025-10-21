package org.example.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.server.dto.vehicle.VehicleRequestDTO;
import org.example.server.dto.vehicle.VehicleResponseDTO;
import org.example.server.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/vehicle")
@Tag(name = "Vehicle", description = "Gerenciamento de vehicle")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    @Operation(
            summary = "Cadastrar novo veículo",
            description = "Permite o registro de um novo veículo no sistema."
    )
    @ApiResponses (value = {
            @ApiResponse(responseCode = "201", description = "Veículo cadastrado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não Autorizado"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (dados incorretos)"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<VehicleResponseDTO> create(@AuthenticationPrincipal(expression = "id") Long id, @Valid @RequestBody VehicleRequestDTO vehicleRequestDTO){
        VehicleResponseDTO vehicleResponseDTO = vehicleService.create(id, vehicleRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleResponseDTO);
    }

    @GetMapping
    @Operation(
            summary = "Listar todos os veículos",
            description = "Retorna uma lista contendo todos os veículos registrados no sistema."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de veículos retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "200", description = "Nenhum veículo encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<List<VehicleResponseDTO>> findAll(){
        List<VehicleResponseDTO> vehicleResponseDTO = vehicleService.findAll();
        return ResponseEntity.ok().body(vehicleResponseDTO);
    }

    @GetMapping("/{vehicleId}")
    @Operation(
            summary = "Buscar veículo por ID",
            description = "Retorna os detalhes de um veículo específico utilizando seu identificador único (ID)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Veículo encontrado e retornado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Veículo não encontrado para o ID fornecido"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<VehicleResponseDTO> findById(@PathVariable Long vehicleId){
        VehicleResponseDTO vehicleResponseDTO = vehicleService.findById(vehicleId);
        return ResponseEntity.ok().body(vehicleResponseDTO);
    }

    @PutMapping("/{vehicleId}")
    @Operation(
            summary = "Atualizar dados do veículo",
            description = "Permite a alteração dos dados de um veículo existente, identificado pelo seu ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "200", description = "Veículo atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Veículo não encontrado para o ID fornecido"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<VehicleResponseDTO> update(
            @AuthenticationPrincipal(expression = "id") Long userId,
            @PathVariable Long vehicleId,
            @Valid
            @RequestBody VehicleRequestDTO vehicleRequestDTO)
    {
        VehicleResponseDTO vehicleUpdated = vehicleService.update(userId, vehicleId, vehicleRequestDTO);
        return ResponseEntity.ok().body(vehicleUpdated);
    }
}

