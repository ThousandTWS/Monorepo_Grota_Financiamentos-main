package org.example.server.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.server.dto.address.AddressMapper;
import org.example.server.dto.dealer.*;
import org.example.server.enums.UserRole;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Dealer;
import org.example.server.model.User;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.UserRepository;
import org.example.server.util.VerificationCodeGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DealerService {

    private final DealerRepository dealerRepository;
    private final UserRepository userRepository;
    private final DealerRegistrationMapper dealerRegistrationMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final DealerProfileMapper dealerProfileMapper;
    private final AddressMapper addressMapper;
    private final DealerDetailsMapper dealerDetailsMapper;
    private final VerificationCodeGenerator codeGenerator;

    public DealerService(
            DealerRepository dealerRepository,
            UserRepository userRepository,
            DealerRegistrationMapper dealerRegistrationMapper,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            DealerProfileMapper dealerProfileMapper,
            AddressMapper addressMapper,
            DealerDetailsMapper dealerDetailsMapper,
            VerificationCodeGenerator codeGenerator
    ) {
        this.dealerRepository = dealerRepository;
        this.userRepository = userRepository;
        this.dealerRegistrationMapper = dealerRegistrationMapper;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.dealerProfileMapper = dealerProfileMapper;
        this.addressMapper = addressMapper;
        this.dealerDetailsMapper = dealerDetailsMapper;
        this.codeGenerator = codeGenerator;
    }

    @Transactional
    public DealerRegistrationResponseDTO create(DealerRegistrationRequestDTO dealerRegistrationRequestDTO) {
        if (userRepository.existsByEmail(dealerRegistrationRequestDTO.email())) {
            throw new DataAlreadyExistsException("Email já existe");
        }

        if (dealerRepository.existsByPhone(dealerRegistrationRequestDTO.phone())) {
            throw new DataAlreadyExistsException("Telefone já cadastrado");
        }

        User user = new User();
        user.setFullName(dealerRegistrationRequestDTO.fullName());
        user.setEmail(dealerRegistrationRequestDTO.email());
        user.setPassword(passwordEncoder.encode(dealerRegistrationRequestDTO.password()));
        user.setRole(UserRole.LOJISTA);
        user.generateVerificationCode(codeGenerator.generate(),Duration.ofMinutes(10));

        Dealer dealer = new Dealer();
        dealer.setUser(user);
        dealer.setPhone(dealerRegistrationRequestDTO.phone());
        dealer.setEnterprise(dealerRegistrationRequestDTO.enterprise());
        dealer.setUser(user);

        user.setDealer(dealer);

        dealerRepository.save(dealer);

        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());

        return dealerRegistrationMapper.toDTO(dealer);
    }

    public List<DealerRegistrationResponseDTO> findAll() {
        List<Dealer> dealerList = dealerRepository.findAll();
        return dealerList.stream()
                .map(dealer -> dealerRegistrationMapper.toDTO(dealer))
                .collect(Collectors.toList());
    }

    public DealerRegistrationResponseDTO findById(Long id) {
        return dealerRegistrationMapper.toDTO(dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    public DealerDetailsResponseDTO findDetailDealer(Long id) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        return dealerDetailsMapper.toDTO(dealer);
    }

    @Transactional
    public DealerProfileDTO completeProfile(Long id, DealerProfileDTO dealerProfileDTO) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        dealer.setFullNameEnterprise(dealerProfileDTO.fullNameEnterprise());
        dealer.setBirthData(dealerProfileDTO.birthData());
        dealer.setCnpj(dealerProfileDTO.cnpj());
        dealer.setAddress(addressMapper.toEntity(dealerProfileDTO.address()));

        return dealerProfileMapper.toDTO(dealerRepository.save(dealer));
    }

    @Transactional
    public DealerRegistrationResponseDTO update(Long id, DealerRegistrationRequestDTO dealerRegistrationRequestDTO) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User user = dealer.getUser();
        if (user == null) {
            throw new EntityNotFoundException("Usuário vinculado à logística não encontrado");
        }

        user.setFullName(dealerRegistrationRequestDTO.fullName());
        user.setEmail(dealerRegistrationRequestDTO.email());

        dealer.setPhone(dealerRegistrationRequestDTO.phone());
        dealer.setEnterprise(dealerRegistrationRequestDTO.enterprise());

        userRepository.save(user);
        dealerRepository.save(dealer);

        return dealerRegistrationMapper.toDTO(dealer);
    }

    @Transactional
    public DealerProfileDTO updateProfile(Long dealerId, DealerProfileDTO dto) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RecordNotFoundException(dealerId));

        if (dto.fullNameEnterprise() != null) dealer.setFullNameEnterprise(dto.fullNameEnterprise());
        if (dto.birthData() != null) dealer.setBirthData(dto.birthData());
        if (dto.cnpj() != null) dealer.setCnpj(dto.cnpj());
        if (dto.address() != null) dealer.setAddress(addressMapper.toEntity(dto.address()));

        return dealerProfileMapper.toDTO(dealerRepository.save(dealer));
    }

    public void delete(Long id) {
        dealerRepository.deleteById(id);
    }

}
