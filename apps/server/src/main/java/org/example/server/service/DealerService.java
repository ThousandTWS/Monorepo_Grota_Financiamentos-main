package org.example.server.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.server.dto.address.AddressMapper;
import org.example.server.dto.dealer.*;
import org.example.server.exception.EmailAlreadyExistsException;
import org.example.server.exception.PhoneAlreadyExistsExceptio;
import org.example.server.exception.RecordNotFoundException;
import org.example.server.model.Dealer;
import org.example.server.model.User;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
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

    public DealerService(DealerRepository dealerRepository, UserRepository userRepository, DealerRegistrationMapper dealerRegistrationMapper, PasswordEncoder passwordEncoder, EmailService emailService, DealerProfileMapper dealerProfileMapper, AddressMapper addressMapper, DealerDetailsMapper dealerDetailsMapper) {
        this.dealerRepository = dealerRepository;
        this.userRepository = userRepository;
        this.dealerRegistrationMapper = dealerRegistrationMapper;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.dealerProfileMapper = dealerProfileMapper;
        this.addressMapper = addressMapper;
        this.dealerDetailsMapper = dealerDetailsMapper;
    }

    @Transactional
    public DealerRegistrationResponseDTO create(DealerRegistrationRequestDTO dealerRegistrationRequestDTO) {
        if (userRepository.existsByEmail(dealerRegistrationRequestDTO.email())) {
            throw new EmailAlreadyExistsException("Email já existe");
        }

        if (dealerRepository.existsByPhone(dealerRegistrationRequestDTO.phone())) {
            throw new PhoneAlreadyExistsExceptio("Telefone já cadastrado");
        }

        Dealer dealer = dealerRegistrationMapper.toEntity(dealerRegistrationRequestDTO);
        User user = dealer.getUser();

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.generateVerificationCode(generateVerificationCode(), Duration.ofMinutes(10));

        userRepository.save(user);
        dealerRepository.save(dealer);
        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());

        return dealerRegistrationMapper.toDTO(dealer);
    }

    public List<DealerRegistrationResponseDTO> findAll() {
        List<Dealer> dealerList = dealerRepository.findAll();
        return dealerList.stream().map(dealer -> dealerRegistrationMapper.toDTO(dealer)).collect(Collectors.toList());
    }

    public DealerRegistrationResponseDTO findById(Long id) {
        return dealerRegistrationMapper.toDTO(dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    public DealerDetailsResponseDTO findDetailDealer(Long id) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado com id: " + id));

        return dealerDetailsMapper.toDTO(dealer);
    }

    @Transactional
    public DealerProfileDTO completeProfile(Long id, DealerProfileDTO dealerProfileDTO) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado com id: " + id));

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

        dealer.setFullName(dealerRegistrationRequestDTO.fullName());
        dealer.setPhone(dealerRegistrationRequestDTO.phone());
        dealer.setEnterprise(dealerRegistrationRequestDTO.enterprise());

        user.setEmail(dealerRegistrationRequestDTO.email());
        user.setPassword(passwordEncoder.encode(dealerRegistrationRequestDTO.password()));

        userRepository.save(user);
        dealerRepository.save(dealer);

        return dealerRegistrationMapper.toDTO(dealer);
    }

    @Transactional
    public DealerProfileDTO updateProfile(Long userId, DealerProfileDTO dto) {
        Dealer dealer = dealerRepository.findById(userId)
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado"));

        if (dto.fullNameEnterprise() != null)
            dealer.setFullNameEnterprise(dto.fullNameEnterprise());
        if (dto.birthData() != null)
            dealer.setBirthData(dto.birthData());
        if (dto.cnpj() != null)
            dealer.setCnpj(dto.cnpj());
        if (dto.address() != null)
            dealer.setAddress(addressMapper.toEntity(dto.address()));

        return dealerProfileMapper.toDTO(dealerRepository.save(dealer));
    }

    // Métodos Auxiliares
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(1_000_000));
    }
}
