package org.example.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.server.dto.seller.SellerRequestDTO;
import org.example.server.dto.seller.SellerResponseDTO;
import org.example.server.model.User;
import org.example.server.service.SellerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/grota-financiamentos/sellers")
@Tag(name = "Seller", description = "Seller management")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @PostMapping
    @Operation(
            summary = "Cadastrar vendedor",
            description = "Cadastra um vendedor no banco de dados"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vendedor cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<SellerResponseDTO> create(@AuthenticationPrincipal User user, @Valid @RequestBody SellerRequestDTO sellerRequestDTO) {
        SellerResponseDTO seller = sellerService.create(user, sellerRequestDTO);
        return ResponseEntity.ok(seller);
    }

    @GetMapping
    @Operation(
            summary = "Listar Vendedores",
            description = "Retorna uma lista de Vendedores, ordenada por nome (10 por página)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de Vendedores retornada com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<List<SellerResponseDTO>> findAll(){
        List<SellerResponseDTO> selles = sellerService.findAll();
        return ResponseEntity.ok().body(selles);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obter Vendedor por ID",
            description = "Retorna os dados de um vendedor com base no ID informado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vendedor encontrado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "404", description = "Vendedor não encontrado para o ID fornecido"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<SellerResponseDTO> findById(@PathVariable Long id){
        SellerResponseDTO selle = sellerService.findById(id);
        return ResponseEntity.ok().body(selle);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Atualizar Vendedor por ID",
            description = "Atualiza os dados de um vendedor com base no ID informado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vendedor atualizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<SellerResponseDTO> update(@PathVariable Long id, @Valid @RequestBody SellerRequestDTO sellerRequestDTO){
        SellerResponseDTO selle = sellerService.update(id, sellerRequestDTO);
        return ResponseEntity.ok().body(selle);
    }
}
