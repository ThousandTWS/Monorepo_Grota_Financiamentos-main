package org.example.server.service;

import org.example.server.dto.document.DocumentMapper;
import org.example.server.dto.document.DocumentResponseDTO;
import org.example.server.dto.document.DocumentUploadRequestDTO;
import org.example.server.enums.DocumentType;
import org.example.server.enums.UserRole;
import org.example.server.exception.auth.AccessDeniedException;
import org.example.server.infra.security.aws.S3Service;
import org.example.server.model.Dealer;
import org.example.server.model.Document;
import org.example.server.model.User;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.DocumentRepository;
import org.example.server.service.factory.DocumentFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DocumentServiceTest {

    @Mock
    private S3Service s3Service;
    @Mock
    private DocumentRepository documentRepository;
    @Mock
    private DealerRepository dealerRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private DocumentFactory documentFactory;
    @Mock
    private DocumentMapper documentMapper;

    @InjectMocks
    private DocumentService documentService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        documentService = new DocumentService(s3Service, documentRepository, dealerRepository, emailService, documentFactory, documentMapper);
    }

    @Test
    void uploadDocumentStoresFileAndReturnsResponse() throws IOException {
        User user = new User();
        user.getId();
        user.setRole(UserRole.LOJISTA);
        Dealer dealer = new Dealer();
        user.setDealer(dealer);

        MultipartFile file = new MockMultipartFile("file", "rg.jpg", "image/jpeg", "conteudo".getBytes());
        DocumentUploadRequestDTO dto = new DocumentUploadRequestDTO(DocumentType.RG_FRENTE, file);

        Document document = new Document();
        document.setDocumentType(DocumentType.RG_FRENTE);
        document.setCreatedAt(LocalDateTime.now());
        when(documentFactory.create(any(), any(), any())).thenReturn(document);

        when(documentRepository.save(document)).thenReturn(document);
        DocumentResponseDTO expected = new DocumentResponseDTO(1L, DocumentType.RG_FRENTE, "image/jpeg", file.getSize(), null, null, LocalDateTime.now(), null);
        when(documentMapper.toDTO(document)).thenReturn(expected);

        DocumentResponseDTO response = documentService.uploadDocument(dto, user, null);

        assertEquals(expected, response);
        verify(s3Service).uploadFile(anyString(), eq(file));
        verify(documentRepository).save(document);
        verify(documentFactory).create(eq(dto), eq(user), anyString());
    }

    @Test
    void uploadDocumentRejectsUnauthorizedUser() {
        User user = new User();
        user.setRole(UserRole.VENDEDOR);

        DocumentUploadRequestDTO dto = new DocumentUploadRequestDTO(DocumentType.CPF, new MockMultipartFile("file", new byte[]{1}));

        assertThrows(AccessDeniedException.class, () -> documentService.uploadDocument(dto, user, null));
        verifyNoInteractions(s3Service, documentRepository, documentFactory);
    }
}
