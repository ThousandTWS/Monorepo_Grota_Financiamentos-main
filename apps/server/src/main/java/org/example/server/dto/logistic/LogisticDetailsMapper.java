package org.example.server.dto.logistic;

import org.example.server.dto.address.AddressMapper;
import org.example.server.model.Logistic;
import org.example.server.model.User;
import org.springframework.stereotype.Component;

@Component
public class LogisticDetailsMapper {

    private final AddressMapper addressMapper;

    public LogisticDetailsMapper(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public LogisticDetailsResponseDTO toDTO(Logistic logistic){
        if(logistic == null) return null;

        User user = logistic.getUser();

        return new LogisticDetailsResponseDTO(
                logistic.getId(),
                logistic.getFullName(),
                logistic.getUser().getEmail(),
                logistic.getPhone(),
                logistic.getEnterprise(),
                logistic.getUser().getVerificationStatus(),
                logistic.getFullNameEnterprise(),
                logistic.getBirthData(),
                logistic.getCnpj(),
                addressMapper.toDTO(logistic.getAddress()),
                logistic.getUser().getCreatedAt()
        );
    }
}
