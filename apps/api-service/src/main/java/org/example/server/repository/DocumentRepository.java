package org.example.server.repository;

import org.example.server.dto.document.DocumentResponseDTO;
import org.example.server.enums.DocumentType;
import org.example.server.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document>findByDealer_UserId(Long id);
    boolean existsByDealerIdAndDocumentType(Long dealerId, DocumentType documentType);
    List<DocumentResponseDTO> findDocumentsByDealerId(Long id);
}