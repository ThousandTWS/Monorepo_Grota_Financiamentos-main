package org.example.server.exception;

public class PasswordResetCodeExpiredException extends RuntimeException{
    public PasswordResetCodeExpiredException (String message){
        super(message);
    }
}
