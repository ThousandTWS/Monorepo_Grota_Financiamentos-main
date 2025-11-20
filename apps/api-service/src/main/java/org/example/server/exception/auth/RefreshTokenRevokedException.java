package org.example.server.exception.auth;

public class RefreshTokenRevokedException extends RuntimeException{
    public RefreshTokenRevokedException(String message){
        super(message);
    }
}
