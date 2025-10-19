package org.example.server.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.server.dto.logistic.LogisticProfileDTO;
import org.example.server.dto.logistic.LogisticRegistrationMapper;
import org.example.server.dto.logistic.LogisticRegistrationRequestDTO;
import org.example.server.dto.logistic.LogisticRegistrationResponseDTO;
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

    public LogisticService(LogisticRepository logisticRepository, UserRepository userRepository, LogisticRegistrationMapper logisticRegistrationMapper, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.logisticRepository = logisticRepository;
        this.userRepository = userRepository;
        this.logisticRegistrationMapper = logisticRegistrationMapper;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
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

        //sendVerificationEmail(user);
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

//    public LogisticProfileDTO updateProfile(Long id, LogisticProfileDTO logisticProfileDTO) {
//        Logistic logistic = logisticRepository.findById(id)
//                .orElseThrow(() -> new RecordNotFoundException("Logista não encontrado com id: " + id));
//
//    }

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

    // Métodos Auxiliares
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(1_000_000));
    }


}
