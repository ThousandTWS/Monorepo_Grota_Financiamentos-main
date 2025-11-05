package org.example.server.dto.dealer;

import org.example.server.model.Dealer;
import org.example.server.model.User;
import org.springframework.stereotype.Component;

@Component
public class DealerRegistrationMapper {

    public DealerRegistrationResponseDTO toDTO(Dealer dealer){
        if (dealer == null){
            return null;
        }

        User user = dealer.getUser();

        return new DealerRegistrationResponseDTO(
                dealer.getId(),
                dealer.getUser().getFullName(),
                user != null ? user.getEmail() : null,
                dealer.getPhone(),
                dealer.getEnterprise(),
                dealer.getUser().getVerificationStatus(),
                dealer.getUser().getCreatedAt()
        );
    }

    public Dealer toEntity(DealerRegistrationRequestDTO dto){
        if (dto == null) return null;

        Dealer dealer = new Dealer();
        dealer.setPhone(dto.phone());
        dealer.setEnterprise(dto.enterprise());
        return dealer;
    }
}
