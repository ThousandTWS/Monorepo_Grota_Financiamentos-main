package org.example.server.exception.auth;

public class CodeInvalidException extends RuntimeException{
    public CodeInvalidException(String message){ super(message); }
}
