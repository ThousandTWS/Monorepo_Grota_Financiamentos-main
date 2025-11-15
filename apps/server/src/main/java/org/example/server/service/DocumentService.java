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
import org.springframework.util.StringUtils;
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

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
    private static final String[] ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"};

    public DocumentService(S3Service s3Service, DocumentRepository documentRepository, DocumentMapper mapper) {
        this.s3Service = s3Service;
        this.documentRepository = documentRepository;
        this.mapper = mapper;
    }

    @Transactional
    public DocumentResponseDTO uploadDocument(DocumentUploadRequestDTO dto, Dealer dealer){

        MultipartFile file = dto.file();
        validateFile(file);
        String s3Key = buildS3Key(dealer.getId(), file.getOriginalFilename());

        try {
            s3Service.uploadFile(s3Key, file);
        } catch (IOException e) {
            throw new DocumentUploadException("Falha ao fazer upload para S3", e);
        }

        Document document = mapper.toEntity(dto, dealer, s3Key);
        document.setCreateAt(LocalDateTime.now());
        Document saved = documentRepository.save(document);

        return mapper.toDTO(saved);
    }

    @Transactional
    public java.net.URL getPresignedUrl(Long documentId, User user) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado"));

        boolean isAdmin = user.getRole().equals("ADMIN");
        boolean isDealer = doc.getDealer().getUser().getRole().equals(user.getId());

        if (!isAdmin && !isDealer) {
            throw new SecurityException("Acesso negado: Você não tem permissão para visualizar este documento.");
        }

        return s3Service.generatePresignedGetUrl(doc.getS3Key());
    }

    @Transactional
    public DocumentResponseDTO reviewDocument(Long id, DocumentReviewRequestDTO documentReviewRequestDTO, User user){
        if (!user.getRole().equals(UserRole.ADMIN)) {
            throw new SecurityException("Apenas administradores podem revisar documentos.");
        }

        Document document = documentRepository.findById(id).orElseThrow(() -> new RecordNotFoundException(id));

        document.setReviewStatus(documentReviewRequestDTO.reviewStatus());
        document.setReviewComment(documentReviewRequestDTO.reviewComment());
        document.setUpdateAt(LocalDateTime.now());

        return mapper.toDTO(documentRepository.save(document));
    }

    public List<DocumentResponseDTO> listUserDocuments(User user) {
        if (user.getRole().equals(UserRole.ADMIN)) {
            return documentRepository.findAll()
                    .stream()
                    .map(document -> mapper.toDTO(document))
                    .collect(Collectors.toList());
        }

        return documentRepository.findByLojistaUserId(user.getId())
                .stream()
                .map(mapper::toDTO)
                .toList();
    }


    private String buildS3Key(Long dealersId, String originalFilename) {
        String ext = StringUtils.getFilenameExtension(originalFilename);
        String uuid = UUID.randomUUID().toString();
        return String.format("dealers/%d/documents/%s.%s", dealersId, uuid, ext != null ? ext : "bin");
    }

    public void validateFile(MultipartFile file){
        if (file == null || file.isEmpty()){
            throw new IllegalArgumentException("Arquivo não pode estar vazio.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES){
            throw new IllegalArgumentException("Arquivo não pode ser maior que 10MB.");
        }

        String contentType = file.getContentType();
        boolean ok = false;
        for (String type : ALLOWED_CONTENT_TYPES){
            if (type.equalsIgnoreCase(contentType)){
                ok = true;
                break;
            }
        }
        if (!ok){
            throw new IllegalArgumentException("Tipo de arquivo não permitido. Use JPEG ou PNG.");
        }
    }
}
