package org.example.server.service;

import org.example.server.dto.document.DocumentMapper;
import org.example.server.dto.document.DocumentResponseDTO;
import org.example.server.dto.document.DocumentReviewRequestDTO;
import org.example.server.dto.document.DocumentUploadRequestDTO;
import org.example.server.enums.UserRole;
import org.example.server.exception.DocumentUploadException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Dealer;
import org.example.server.model.Document;
import org.example.server.model.User;
import org.example.server.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final S3Service s3Service;
    private final DocumentRepository documentRepository;
    private final DocumentMapper mapper;

    private static final long MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
    private static final String[] ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"};

    public DocumentService(S3Service s3Service, DocumentRepository documentRepository, DocumentMapper mapper) {
        this.s3Service = s3Service;
        this.documentRepository = documentRepository;
        this.mapper = mapper;
    }
    @Transactional
    public DocumentResponseDTO uploadDocument(DocumentUploadRequestDTO dto, Dealer dealer) {

        MultipartFile file = dto.file();
        validateFile(file);

        String s3Key = buildS3Key(dealer.getId(), file.getOriginalFilename());

        try {
            s3Service.uploadFile(s3Key, file);
        } catch (IOException e) {
            throw new DocumentUploadException("Falha ao enviar documento para o servidor", e);
        }

        Document document = mapper.toEntity(dto, dealer, s3Key);
        document.setCreatedAt(LocalDateTime.now());

        return mapper.toDTO(documentRepository.save(document));
    }

    @Transactional
    public java.net.URL getPresignedUrl(Long documentId, User user) {

        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado"));

        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        boolean isOwnerDealer = doc.getDealer().getUser().getId().equals(user.getId());


        if (!isAdmin && !isOwnerDealer) {
            throw new SecurityException("Acesso negado: você não tem permissão para visualizar este documento.");
        }

        return s3Service.generatePresignedUrl(doc.getS3Key());
    }

    @Transactional
    public DocumentResponseDTO reviewDocument(Long id, DocumentReviewRequestDTO reviewDTO, User user) {

        if (user.getRole() != UserRole.ADMIN) {
            throw new SecurityException("Apenas administradores podem revisar documentos.");
        }

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        document.setReviewStatus(reviewDTO.reviewStatus());
        document.setReviewComment(reviewDTO.reviewComment());
        document.setUpdatedAt(LocalDateTime.now());

        return mapper.toDTO(documentRepository.save(document));
    }


    public List<DocumentResponseDTO> listUserDocuments(User user) {

        if (user.getRole() == UserRole.ADMIN) {
            return documentRepository.findAll()
                    .stream().map(mapper::toDTO)
                    .collect(Collectors.toList());
        }

        return documentRepository.findByDealer_UserId(user.getId())
                .stream().map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    private String buildS3Key(Long dealerId, String originalFilename) {

        String ext = "bin";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf('.') + 1);
        }

        return String.format(
                "dealers/%d/documents/%s.%s",
                dealerId,
                UUID.randomUUID(),
                ext
        );
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("O arquivo não pode estar vazio.");
        }

        if (file.getSize() > MAX_FILE_BYTES) {
            throw new IllegalArgumentException("O arquivo não pode ser maior que 10MB.");
        }

        String contentType = file.getContentType();
        boolean ok = false;

        for (String type : ALLOWED_CONTENT_TYPES) {
            if (type.equalsIgnoreCase(contentType)) {
                ok = true;
                break;
            }
        }

        if (!ok) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido. Use JPEG ou PNG.");
        }
    }
}
