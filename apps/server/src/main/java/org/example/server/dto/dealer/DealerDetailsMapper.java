package org.example.server.dto.dealer;

import org.example.server.dto.address.AddressMapper;
import org.example.server.model.Dealer;
import org.example.server.model.User;
import org.springframework.stereotype.Component;

@Component
public class DealerDetailsMapper {

    private final AddressMapper addressMapper;

    public DealerDetailsMapper(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public DealerDetailsResponseDTO toDTO(Dealer dealer){
        if(dealer == null) return null;

        User user = dealer.getUser();

        return new DealerDetailsResponseDTO(
                dealer.getId(),
                dealer.getFullName(),
                dealer.getUser().getEmail(),
                dealer.getPhone(),
                dealer.getEnterprise(),
                dealer.getUser().getVerificationStatus(),
                dealer.getFullNameEnterprise(),
                dealer.getBirthData(),
                dealer.getCnpj(),
                addressMapper.toDTO(dealer.getAddress()),
                dealer.getUser().getCreatedAt()
        );
    }
}
