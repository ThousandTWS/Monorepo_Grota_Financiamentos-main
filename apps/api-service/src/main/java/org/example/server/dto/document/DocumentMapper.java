package org.example.server.dto.document;

import org.example.server.enums.ReviewStatus;
import org.example.server.model.Dealer;
import org.example.server.model.Document;
import org.springframework.stereotype.Component;


@Component
public class DocumentMapper {

    public DocumentResponseDTO toDTO(Document document) {
        if (document == null) {
            return null;
        }

        return new DocumentResponseDTO(
                document.getId(),
                document.getDocumentType(),
                document.getS3Key(),
                document.getContentType(),
                document.getSizeBytes(),
                document.getReviewStatus(),
                document.getReviewComment(),
                document.getCreatedAt(),
                document.getUpdatedAt()
        );
    }
    
    public Document toEntity(DocumentUploadRequestDTO dto, Dealer dealer, String s3Key){
        if (dto == null) {
            return null;
        }
        
        Document document = new Document();
        document.setDocumentType(dto.documentType());
        document.setDocumentName(dto.file().getName());
        document.setSizeBytes(dto.file().getSize());
        document.setDealer(dealer);
        document.setS3Key(s3Key);
        document.setReviewStatus(ReviewStatus.PENDENTE);

        return document;
    }
}
