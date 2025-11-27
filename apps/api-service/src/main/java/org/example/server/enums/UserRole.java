package org.example.server.enums;

import org.springframework.security.core.GrantedAuthority;

public enum UserRole implements GrantedAuthority {
    ADMIN,
    LOJISTA,
    VENDEDOR,
    GESTOR,
    OPERADOR;

    @Override
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
