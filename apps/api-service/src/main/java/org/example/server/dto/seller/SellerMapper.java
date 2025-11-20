package org.example.server.dto.seller;

import org.example.server.dto.address.AddressMapper;
import org.example.server.model.Seller;
import org.example.server.model.User;
import org.springframework.stereotype.Component;

@Component
public class SellerMapper {

    private final AddressMapper addressMapper;

    public SellerMapper(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public SellerResponseDTO toDTO(Seller seller) {
        if (seller == null) {
            return null;
        }

        User user = seller.getUser();

        return new SellerResponseDTO(
                seller.getId(),
                seller.getUser().getFullName(),
                seller.getUser().getEmail(),
                seller.getPhone(),
                seller.getCPF(),
                seller.getBirthData(),
                seller.getUser().getVerificationStatus(),
                seller.getCreatedAt()
        );
    }

    public Seller toEntity(SellerRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Seller seller = new Seller(
                dto.phone(),
                dto.CPF(),
                dto.birthData(),
                addressMapper.toEntity(dto.address())
        );
        return seller;
    }
}
