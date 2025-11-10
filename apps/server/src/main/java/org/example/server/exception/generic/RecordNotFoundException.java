package org.example.server.exception.generic;

public class RecordNotFoundException extends RuntimeException{
    public RecordNotFoundException(Long id){
        super("Registro não encontrado com o id " + id);
    }
    public RecordNotFoundException(String messagem){
        super(messagem);
    }
}
