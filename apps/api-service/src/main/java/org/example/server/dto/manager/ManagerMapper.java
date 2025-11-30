package org.example.server.dto.manager;

import org.example.server.dto.address.AddressMapper;
import org.example.server.model.Manager;
import org.example.server.model.User;
import org.springframework.stereotype.Component;

@Component
public class ManagerMapper {

    private final AddressMapper addressMapper;

    public ManagerMapper(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public ManagerResponseDTO toDTO(Manager manager) {
        if (manager == null) {
            return null;
        }

        User user = manager.getUser();

        return new ManagerResponseDTO(
                manager.getId(),
                manager.getDealer() != null ? manager.getDealer().getId() : null,
                user.getFullName(),
                user.getEmail(),
                manager.getPhone(),
                manager.getCPF(),
                manager.getBirthData(),
                user.getVerificationStatus(),
                manager.getCreatedAt(),
                manager.getCanView(),
                manager.getCanCreate(),
                manager.getCanUpdate(),
                manager.getCanDelete()
        );
    }

    public Manager toEntity(ManagerRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Manager manager = new Manager(
                dto.phone(),
                dto.CPF(),
                dto.birthData(),
                addressMapper.toEntity(dto.address())
        );
        return manager;
    }
}
