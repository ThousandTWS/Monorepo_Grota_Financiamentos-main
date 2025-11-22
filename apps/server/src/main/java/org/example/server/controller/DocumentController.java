package org.example.server.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.example.server.dto.document.DocumentResponseDTO;
import org.example.server.dto.document.DocumentReviewRequestDTO;
import org.example.server.dto.document.DocumentUploadRequestDTO;
import org.example.server.dto.user.UserResponseDTO;
import org.example.server.enums.DocumentType;
import org.example.server.model.Dealer;
import org.example.server.model.User;
import org.example.server.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;
import java.util.List;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    @Operation(summary = "Upload", description = "Realiza o upload de um documento associado ao dealer autenticado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documento enviado com sucesso", content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos ou arquivo ausente"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")

    })
    public ResponseEntity<DocumentResponseDTO> uploadDocument(
            @RequestParam @NotNull DocumentType documentType,
            @RequestParam @NotNull MultipartFile file,
            @AuthenticationPrincipal Dealer dealer)
    {
        DocumentUploadRequestDTO uploadRequest = new DocumentUploadRequestDTO(documentType, file);
        DocumentResponseDTO response = documentService.uploadDocument(uploadRequest, dealer);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/review")
    @Operation(summary = "Revisar Documento", description = "Atualiza o status e/ou informações de revisão de um documento específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documento revisado com sucesso", content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos para a revisão"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Usuário não possui permissão para revisar o documento"),
            @ApiResponse(responseCode = "404", description = "Documento não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")

    })
    public ResponseEntity<DocumentResponseDTO> reviewDocument(
            @PathVariable Long id,
            @RequestBody @Valid DocumentReviewRequestDTO documentReviewRequestDTO,
            @AuthenticationPrincipal User user
    ){
        DocumentResponseDTO response = documentService.reviewDocument(id, documentReviewRequestDTO, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Listar Documentos", description = "Retorna a lista de documentos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de documentos retornada com sucesso", content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")

    })
    public ResponseEntity<List<DocumentResponseDTO>> listUserDocuments(@AuthenticationPrincipal User user){
        List<DocumentResponseDTO> docs = documentService.listUserDocuments(user);
        return ResponseEntity.ok(docs);
    }

    @GetMapping("/{id}/url")
    @Operation(summary = "Obter URL Pré-Assinada do Documento", description = "Gera e retorna uma URL pré-assinada para download temporário do documento solicitado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "URL pré-assinada gerada com sucesso.", content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Usuário não possui permissão para acessar este documento"),
            @ApiResponse(responseCode = "404", description = "Documento não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")

    })
    public ResponseEntity<String> getDocumentPresignedUrl(@PathVariable Long id, @AuthenticationPrincipal User user){
        URL url = documentService.getPresignedUrl(id, user);
        return ResponseEntity.ok(url.toString());
    }
}
