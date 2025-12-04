package org.example.server.exception;

public class LogoUploadException extends RuntimeException {
    public LogoUploadException(String message, Throwable cause) {
        super(message, cause);
    }

    public LogoUploadException(String message) {
        super(message);
    }
}
