package org.example.server.service;

import org.example.server.dto.document.DocumentMapper;
import org.example.server.dto.document.DocumentResponseDTO;
import org.example.server.dto.document.DocumentReviewRequestDTO;
import org.example.server.dto.document.DocumentUploadRequestDTO;
import org.example.server.dto.pagination.PagedResponseDTO;
import org.example.server.enums.UserRole;
import org.example.server.exception.DocumentUploadException;
import org.example.server.exception.auth.AccessDeniedException;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.infra.security.aws.S3Service;
import org.example.server.model.Document;
import org.example.server.model.User;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.DocumentRepository;
import org.example.server.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DocumentService {

    private final S3Service s3Service;
    private final DocumentRepository documentRepository;
    private final DealerRepository dealerRepository;
    private final EmailService emailService;
    private final DocumentMapper mapper;

    private static final long MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
    private static final String[] ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"};

    public DocumentService(S3Service s3Service, DocumentRepository documentRepository, DealerRepository dealerRepository, EmailService emailService, DocumentMapper mapper) {
        this.s3Service = s3Service;
        this.documentRepository = documentRepository;
        this.dealerRepository = dealerRepository;
        this.emailService = emailService;
        this.mapper = mapper;
    }

    @Transactional
    public DocumentResponseDTO uploadDocument(DocumentUploadRequestDTO dto, User user, Long dealerId) {

        if (user.getRole().equals(UserRole.ADMIN)) {
            if (dealerId == null) {
                throw new RecordNotFoundException("ADMIN precisa informar o id do lojista.");
            }
            dealerRepository.findById(dealerId)
                    .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado."));
        } else if (user.getRole().equals(UserRole.LOJISTA)) {
            var dealer = user.getDealer();
            if (dealer == null) {
                throw new AccessDeniedException("Usuário LOJISTA não possui dealer associado.");
            }
        } else {
            throw new AccessDeniedException("Este usuário não tem permissão para enviar documentos.");
        }

        if (documentRepository.existsByDealerIdAndDocumentType(dealerId, dto.documentType())) {
            throw new DataAlreadyExistsException("O documento " + dto.documentType() + " já foi enviado para este dealer.");
        }

        MultipartFile file = dto.file();
        validateFile(file);

        String s3Key = buildS3Key(user.getId(), file.getOriginalFilename());

        try {
            s3Service.uploadFile(s3Key, file);
        } catch (IOException e) {
            throw new DocumentUploadException("Falha ao enviar documento para o servidor", e);
        }

        Document document = mapper.toEntity(dto, user, s3Key);
        document.setCreatedAt(LocalDateTime.now());

        return mapper.toDTO(documentRepository.save(document));
    }

    @Transactional
    public java.net.URL getPresignedUrl(Long documentId, User user) {

        @SuppressWarnings("null")
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RecordNotFoundException("Documento não encontrado"));

        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        boolean isOwnerDealer = doc.getDealer().getUser().getId().equals(user.getId());

        if (!isAdmin && !isOwnerDealer) {
            throw new AccessDeniedException("Acesso negado: você não tem permissão para visualizar este documento.");
        }

        return s3Service.generatePresignedUrl(doc.getS3Key());
    }

    @Transactional
    public DocumentResponseDTO reviewDocument(Long id, DocumentReviewRequestDTO reviewDTO, User user) {

        if (user.getRole() != UserRole.ADMIN) {
            throw new AccessDeniedException("Apenas administradores podem revisar documentos.");
        }

        @SuppressWarnings("null")
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        document.setReviewStatus(reviewDTO.reviewStatus());
        document.setReviewComment(reviewDTO.reviewComment());
        document.setUpdatedAt(LocalDateTime.now());

        Document saved = documentRepository.save(document);

        emailService.sendReviewDocument(document.getDealer().getUser().getEmail(), document);

        return mapper.toDTO(saved);
    }


    public PagedResponseDTO<DocumentResponseDTO> listUserDocuments(User user, int page, int size) {
        Pageable pageable = PaginationUtils.buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        if (user.getRole() == UserRole.ADMIN) {
            Page<Document> documents = documentRepository.findAll(pageable);
            return PagedResponseDTO.fromPage(documents.map(mapper::toDTO));
        }

        Page<Document> documents = documentRepository.findByDealer_UserId(user.getId(), pageable);
        return PagedResponseDTO.fromPage(documents.map(mapper::toDTO));
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
            throw new DocumentUploadException("O arquivo não pode estar vazio.");
        }

        if (file.getSize() > MAX_FILE_BYTES) {
            throw new DocumentUploadException("O arquivo não pode ser maior que 10MB.");
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
            throw new DocumentUploadException("Tipo de arquivo não permitido. Use JPEG ou PNG.");
        }
    }
}
