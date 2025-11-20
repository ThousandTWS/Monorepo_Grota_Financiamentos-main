package org.example.server.enums;

import org.springframework.security.core.GrantedAuthority;

public enum UserRole implements GrantedAuthority {
    ADMIN,
    LOJISTA,
    VENDEDOR;

    @Override
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
