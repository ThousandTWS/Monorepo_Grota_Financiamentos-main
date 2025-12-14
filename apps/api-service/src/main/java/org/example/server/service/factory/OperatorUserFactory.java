package org.example.server.service.factory;

import org.example.server.enums.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class OperatorUserFactory extends AbstractUserFactory {

    public OperatorUserFactory(PasswordEncoder passwordEncoder) {
        super(passwordEncoder);
    }

    @Override
    protected UserRole getRole() {
        return UserRole.OPERADOR;
    }
}
