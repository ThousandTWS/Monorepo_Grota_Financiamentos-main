package org.example.server.exception;

public class RecordNotFoundException extends RuntimeException{
    public RecordNotFoundException(Long id){
        super("Recurso não encontrado com o id " + id);
    }

    public RecordNotFoundException(String messagem){
        super(messagem);
    }
}
