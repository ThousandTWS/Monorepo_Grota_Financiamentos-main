package org.example.server.exception;

public class UserNotVerifiedException extends RuntimeException{
    public UserNotVerifiedException(String messagem){
        super(messagem);
    }
}
