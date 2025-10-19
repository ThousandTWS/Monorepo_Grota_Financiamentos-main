package org.example.server.dto.logistic;

import org.example.server.dto.address.AddressMapper;
import org.example.server.model.Logistic;
import org.springframework.stereotype.Component;

@Component
public class LogisticProfileMapper {

    private final AddressMapper addressMapper;

    public LogisticProfileMapper(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public LogisticProfileDTO toDTO(Logistic logistic){
        if (logistic == null) return null;

        return new LogisticProfileDTO(
                logistic.getFullName(),
                logistic.getBirthData(),
                logistic.getCnpj(),
                addressMapper.toDTO(logistic.getAddress())
        );
    }

    public Logistic toEntity(LogisticProfileDTO dto){
        if (dto == null) return null;

        Logistic logistic = new Logistic();
        logistic.setFullName(dto.fullName());
        logistic.setBirthData(dto.birthData());
        logistic.setCnpj(dto.cnpj());
        logistic.setAddress(addressMapper.toEntity(dto.address()));

        return logistic;
    }
}
