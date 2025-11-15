package org.example.server.controller;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.example.server.dto.document.DocumentResponseDTO;
import org.example.server.dto.document.DocumentReviewRequestDTO;
import org.example.server.dto.document.DocumentUploadRequestDTO;
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
    public ResponseEntity<DocumentResponseDTO> reviewDocument(
            @PathVariable Long id,
            @RequestBody @Valid DocumentReviewRequestDTO documentReviewRequestDTO,
            @AuthenticationPrincipal User user
    ){
        DocumentResponseDTO response = documentService.reviewDocument(id, documentReviewRequestDTO, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponseDTO>> listUserDocuments(@AuthenticationPrincipal User user){
        List<DocumentResponseDTO> docs = documentService.listUserDocuments(user);
        return ResponseEntity.ok(docs);
    }

    @GetMapping("/{id}/url")
    public ResponseEntity<String> getDocumentPresignedUrl(@PathVariable Long id, @AuthenticationPrincipal User user){
        URL url = documentService.getPresignedUrl(id, user);
        return ResponseEntity.ok(url.toString());
    }
}
