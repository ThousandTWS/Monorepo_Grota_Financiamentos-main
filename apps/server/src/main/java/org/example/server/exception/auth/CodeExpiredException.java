package org.example.server.exception.auth;

public class CodeExpiredException extends RuntimeException{
    public CodeExpiredException(String message){ super(message); }
}
