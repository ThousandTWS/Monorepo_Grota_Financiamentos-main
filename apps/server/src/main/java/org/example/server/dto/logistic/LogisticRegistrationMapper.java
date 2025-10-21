package org.example.server.dto.logistic;

import org.example.server.model.Logistic;
import org.example.server.model.User;
import org.springframework.stereotype.Component;

@Component
public class LogisticRegistrationMapper {

    public LogisticRegistrationResponseDTO toDTO(Logistic logistic){
        if (logistic == null){
            return null;
        }

        User user = logistic.getUser();

        return new LogisticRegistrationResponseDTO(
                logistic.getId(),
                logistic.getFullName(),
                user != null ? user.getEmail() : null,
                logistic.getPhone(),
                logistic.getEnterprise(),
                logistic.getUser().getVerificationStatus(),
                logistic.getUser().getCreatedAt()
        );
    }

    public Logistic toEntity(LogisticRegistrationRequestDTO dto){
        if (dto == null){
            return null;
        }

        User user = new User();
        user.setEmail(dto.email());
        user.setPassword(dto.password());

        Logistic logistic = new Logistic();
        logistic.setFullName(dto.fullName());
        logistic.setPhone(dto.phone());
        logistic.setEnterprise(dto.enterprise());
        logistic.setUser(user);

        return logistic;
    }
}
