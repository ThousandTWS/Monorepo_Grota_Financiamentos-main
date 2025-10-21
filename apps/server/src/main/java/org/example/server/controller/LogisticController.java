package org.example.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.server.dto.logistic.LogisticDetailsResponseDTO;
import org.example.server.dto.logistic.LogisticProfileDTO;
import org.example.server.dto.logistic.LogisticRegistrationRequestDTO;
import org.example.server.dto.logistic.LogisticRegistrationResponseDTO;
import org.example.server.dto.vehicle.VehicleResponseDTO;
import org.example.server.service.LogisticService;
import org.example.server.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/logistics")
@Tag(name = "Lojista", description = "Gerenciamento de lojistas")
public class LogisticController {

    private final LogisticService logisticService;
    private final VehicleService vehicleService;

    public LogisticController(LogisticService logisticService, VehicleService vehicleService) {
        this.logisticService = logisticService;
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @Operation(
            summary = "Listar Lojistas",
            description = "Retorna uma lista de Lojistas, ordenada por nome (10 por página)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de Lojistas retornada com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<List<LogisticRegistrationResponseDTO>> findAll(){
        List<LogisticRegistrationResponseDTO> logisticList = logisticService.findAll();
        return ResponseEntity.ok().body(logisticList);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obter Lojistas por ID",
            description = "Retorna os dados de um Lojista com base no ID informado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lojista encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Lojista não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<LogisticRegistrationResponseDTO> findById(@PathVariable Long id){
        LogisticRegistrationResponseDTO logistic = logisticService.findById(id);
        return ResponseEntity.ok().body(logistic);
    }

    @GetMapping("/{id}/veiculos")
    @Operation(
            summary = "Lista de de veiculos do lojista",
            description = "Retorna a lista de todos os veiculos do lojista."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de veiculos retornada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Lojista não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<List<VehicleResponseDTO>> getVehicleByLogistic(@PathVariable Long id){
        List<VehicleResponseDTO> vehiclesDto = vehicleService.getVehicleByLogistic(id);
        return ResponseEntity.ok().body(vehiclesDto);
    }

    @PutMapping("/lojista-update")
    @Operation(
            summary = "Atualizar Lojista por ID",
            description = "Atualiza os dados de um Lojista com base no ID informado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lojista atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Lojista não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<LogisticRegistrationResponseDTO> update(@Valid @AuthenticationPrincipal(expression = "id") Long id, @RequestBody LogisticRegistrationRequestDTO logisticRegistrationRequestDTO){
        LogisticRegistrationResponseDTO logistic = logisticService.update(id, logisticRegistrationRequestDTO);
        return ResponseEntity.ok().body(logistic);
    }

    @PutMapping("/profile/complete")
    @Operation(
            summary = "Completar perfil do lojista",
            description = "Permite ao lojista preencher informações adicionais após o registro inicial."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfil completo com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<LogisticProfileDTO> completeProfile(@Valid @AuthenticationPrincipal(expression = "id") Long id, @RequestBody LogisticProfileDTO logisticProfileDTO){
        System.out.println("ID autenticado: " + id);
        LogisticProfileDTO profileDTO = logisticService.completeProfile(id, logisticProfileDTO);
        return ResponseEntity.ok(profileDTO);
    }

    @PatchMapping("/profile/update")
    @Operation(
            summary = "Atualizar perfil do lojista",
            description = "Permite ao lojista alterar seus dados de perfil (empresa, CNPJ, endereço, etc)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfil do lojista atualizado com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<LogisticProfileDTO> updateProfile(@Valid @AuthenticationPrincipal(expression = "id") Long userId, @RequestBody LogisticProfileDTO dto) {
        LogisticProfileDTO updated = logisticService.updateProfile(userId, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/details")
    @Operation(
            summary = "Perfil completo do lojista",
            description = "Retorna o perfil completo do lojista."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfil completo retornado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Lojista não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<LogisticDetailsResponseDTO> findDetailsLogistic(@PathVariable Long id){
        LogisticDetailsResponseDTO logisticDetails = logisticService.findDetailLogistic(id);
        return ResponseEntity.ok(logisticDetails);
    }

}

