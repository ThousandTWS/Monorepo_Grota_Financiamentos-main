package org.example.server.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.server.dto.address.AddressMapper;
import org.example.server.dto.logistic.*;
import org.example.server.exception.EmailAlreadyExistsException;
import org.example.server.exception.RecordNotFoundException;
import org.example.server.model.Logistic;
import org.example.server.model.User;
import org.example.server.repository.LogisticRepository;
import org.example.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LogisticService {

    private final LogisticRepository logisticRepository;
    private final UserRepository userRepository;
    private final LogisticRegistrationMapper logisticRegistrationMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final LogisticProfileMapper logisticProfileMapper;
    private final AddressMapper addressMapper;
    private final LogisticDetailsMapper logisticDetailsMapper;

    public LogisticService(LogisticRepository logisticRepository, UserRepository userRepository, LogisticRegistrationMapper logisticRegistrationMapper, PasswordEncoder passwordEncoder, EmailService emailService, LogisticProfileMapper logisticProfileMapper, AddressMapper addressMapper, LogisticDetailsMapper logisticDetailsMapper) {
        this.logisticRepository = logisticRepository;
        this.userRepository = userRepository;
        this.logisticRegistrationMapper = logisticRegistrationMapper;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.logisticProfileMapper = logisticProfileMapper;
        this.addressMapper = addressMapper;
        this.logisticDetailsMapper = logisticDetailsMapper;
    }

    @Transactional
    public LogisticRegistrationResponseDTO create(LogisticRegistrationRequestDTO logisticRegistrationRequestDTO) {
        if (userRepository.existsByEmail(logisticRegistrationRequestDTO.email())) {
            throw new EmailAlreadyExistsException("Email já existe");
        }

        Logistic logistic = logisticRegistrationMapper.toEntity(logisticRegistrationRequestDTO);
        User user = logistic.getUser();

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.generateVerificationCode(generateVerificationCode(), Duration.ofMinutes(10));

        userRepository.save(user);
        logisticRepository.save(logistic);

        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());
        return logisticRegistrationMapper.toDTO(logistic);
    }

    public List<LogisticRegistrationResponseDTO> findAll() {
        List<Logistic> logisticList = logisticRepository.findAll();
        return logisticList.stream().map(logistic -> logisticRegistrationMapper.toDTO(logistic)).collect(Collectors.toList());
    }

    public LogisticRegistrationResponseDTO findById(Long id) {
        return logisticRegistrationMapper.toDTO(logisticRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    public LogisticDetailsResponseDTO findDetailLogistic(Long id) {
        Logistic logistic = logisticRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Logista não encontrado com id: " + id));

        return logisticDetailsMapper.toDTO(logistic);
    }

    @Transactional
    public LogisticProfileDTO completeProfile(Long id, LogisticProfileDTO logisticProfileDTO) {
        Logistic logistic = logisticRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Logista não encontrado com id: " + id));

        logistic.setFullNameEnterprise(logisticProfileDTO.fullNameEnterprise());
        logistic.setBirthData(logisticProfileDTO.birthData());
        logistic.setCnpj(logisticProfileDTO.cnpj());
        logistic.setAddress(addressMapper.toEntity(logisticProfileDTO.address()));

        Logistic logisticUpdate = logisticRepository.save(logistic);
        return logisticProfileMapper.toDTO(logisticUpdate);
    }

    @Transactional
    public LogisticRegistrationResponseDTO update(Long id, LogisticRegistrationRequestDTO logisticRegistrationRequestDTO) {
        Logistic logistic = logisticRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User user = logistic.getUser();
        if (user == null) {
            throw new EntityNotFoundException("Usuário vinculado à logística não encontrado");
        }

        logistic.setFullName(logisticRegistrationRequestDTO.fullName());
        logistic.setPhone(logisticRegistrationRequestDTO.phone());
        logistic.setEnterprise(logisticRegistrationRequestDTO.enterprise());

        user.setEmail(logisticRegistrationRequestDTO.email());
        user.setPassword(passwordEncoder.encode(logisticRegistrationRequestDTO.password()));

        userRepository.save(user);
        logisticRepository.save(logistic);

        return logisticRegistrationMapper.toDTO(logistic);
    }

    @Transactional
    public LogisticProfileDTO updateProfile(Long userId, LogisticProfileDTO dto) {
        Logistic logistic = logisticRepository.findById(userId)
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado"));

        if (dto.fullNameEnterprise() != null)
            logistic.setFullNameEnterprise(dto.fullNameEnterprise());
        if (dto.birthData() != null)
            logistic.setBirthData(dto.birthData());
        if (dto.cnpj() != null)
            logistic.setCnpj(dto.cnpj());
        if (dto.address() != null)
            logistic.setAddress(addressMapper.toEntity(dto.address()));

        Logistic saved = logisticRepository.save(logistic);
        return logisticProfileMapper.toDTO(saved);
    }

    // Métodos Auxiliares
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(1_000_000));
    }
}
