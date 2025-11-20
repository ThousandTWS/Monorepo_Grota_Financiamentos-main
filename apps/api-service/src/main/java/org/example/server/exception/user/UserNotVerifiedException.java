package org.example.server.exception.user;

public class UserNotVerifiedException extends RuntimeException{
    public UserNotVerifiedException(String messagem){
        super(messagem);
    }
}
