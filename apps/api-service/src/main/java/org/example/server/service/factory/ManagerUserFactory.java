package org.example.server.service.factory;

import org.example.server.enums.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class ManagerUserFactory extends AbstractUserFactory {

    public ManagerUserFactory(PasswordEncoder passwordEncoder) {
        super(passwordEncoder);
    }

    @Override
    protected UserRole getRole() {
        return UserRole.GESTOR;
    }
}
