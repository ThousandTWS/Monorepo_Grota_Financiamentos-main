package org.example.server.repository;

import org.example.server.dto.document.DocumentResponseDTO;
import org.example.server.enums.DocumentType;
import org.example.server.model.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document>findByDealer_UserId(Long id);
    Page<Document> findByDealer_UserId(Long id, Pageable pageable);
    boolean existsByDealerIdAndDocumentType(Long dealerId, DocumentType documentType);
    List<DocumentResponseDTO> findDocumentsByDealerId(Long id);
    void deleteByDealerId(Long dealerId);
}
