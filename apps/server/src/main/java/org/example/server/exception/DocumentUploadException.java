package org.example.server.exception;

import java.io.IOException;

public class DocumentUploadException extends RuntimeException {
    public DocumentUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
