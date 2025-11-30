package org.example.server.dto.operator;

import org.example.server.dto.address.AddressMapper;
import org.example.server.model.Operator;
import org.example.server.model.User;
import org.springframework.stereotype.Component;

@Component
public class OperatorMapper {

    private final AddressMapper addressMapper;

    public OperatorMapper(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public OperatorResponseDTO toDTO(Operator operator) {
        if (operator == null) {
            return null;
        }

        User user = operator.getUser();

        return new OperatorResponseDTO(
                operator.getId(),
                operator.getDealer() != null ? operator.getDealer().getId() : null,
                user.getFullName(),
                user.getEmail(),
                operator.getPhone(),
                operator.getCPF(),
                operator.getBirthData(),
                user.getVerificationStatus(),
                operator.getCreatedAt(),
                operator.getCanView(),
                operator.getCanCreate(),
                operator.getCanUpdate(),
                operator.getCanDelete()
        );
    }

    public Operator toEntity(OperatorRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Operator operator = new Operator(
                dto.phone(),
                dto.CPF(),
                dto.birthData(),
                addressMapper.toEntity(dto.address())
        );
        return operator;
    }
}
