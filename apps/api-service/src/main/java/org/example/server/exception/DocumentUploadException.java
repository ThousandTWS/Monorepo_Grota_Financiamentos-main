package org.example.server.exception;

public class DocumentUploadException extends RuntimeException {
    public DocumentUploadException(String message, Throwable cause){
        super(message, cause);
    }
}
