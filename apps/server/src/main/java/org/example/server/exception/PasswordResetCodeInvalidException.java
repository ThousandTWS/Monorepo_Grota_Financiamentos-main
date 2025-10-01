package org.example.server.exception;

public class PasswordResetCodeInvalidException extends RuntimeException{
    public PasswordResetCodeInvalidException(String message){
        super(message);
    }
}
