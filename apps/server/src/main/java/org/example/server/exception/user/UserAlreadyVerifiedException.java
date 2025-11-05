package org.example.server.exception.user;

public class UserAlreadyVerifiedException extends RuntimeException{
    public UserAlreadyVerifiedException(String message){ super(message); }
}
