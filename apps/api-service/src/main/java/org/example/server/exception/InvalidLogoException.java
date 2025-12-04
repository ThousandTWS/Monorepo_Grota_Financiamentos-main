package org.example.server.exception;

public class InvalidLogoException extends RuntimeException {
    public InvalidLogoException(String message) {
        super(message);
    }
}
