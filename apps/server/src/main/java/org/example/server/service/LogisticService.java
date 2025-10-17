package org.example.server.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.server.dto.logistic.LogisticMapper;
import org.example.server.dto.logistic.LogisticRequestDTO;
import org.example.server.dto.logistic.LogisticResponseDTO;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LogisticService {

    private final LogisticRepository logisticRepository;
    private final UserRepository userRepository;
    private final LogisticMapper logisticMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public LogisticService(LogisticRepository logisticRepository, UserRepository userRepository, LogisticMapper logisticMapper, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.logisticRepository = logisticRepository;
        this.userRepository = userRepository;
        this.logisticMapper = logisticMapper;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public LogisticResponseDTO create(LogisticRequestDTO logisticRequestDTO) {
        if (userRepository.existsByEmail(logisticRequestDTO.email())) {
            throw new EmailAlreadyExistsException("Email já existe");
        }

        Logistic logistic = logisticMapper.toEntity(logisticRequestDTO);
        User user = logistic.getUser();

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.generateVerificationCode(generateVerificationCode(), Duration.ofMinutes(10));

        userRepository.save(user);
        logisticRepository.save(logistic);

        //sendVerificationEmail(user);
        return logisticMapper.toDTO(logistic);
    }

    public List<LogisticResponseDTO> findAll() {
        List<Logistic> logisticList = logisticRepository.findAll();
        return logisticList.stream().map(logistic -> logisticMapper.toDTO(logistic)).collect(Collectors.toList());
    }

    public LogisticResponseDTO findById(Long id) {
        return logisticMapper.toDTO(logisticRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    @Transactional
    public LogisticResponseDTO update(Long id, LogisticRequestDTO logisticRequestDTO) {
        Logistic logistic = logisticRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User user = logistic.getUser();
        if (user == null) {
            throw new EntityNotFoundException("Usuário vinculado à logística não encontrado");
        }

        logistic.setFullName(logisticRequestDTO.fullName());
        logistic.setPhone(logisticRequestDTO.phone());
        logistic.setEnterprise(logisticRequestDTO.enterprise());

        user.setEmail(logisticRequestDTO.email());
        user.setPassword(passwordEncoder.encode(logisticRequestDTO.password()));

        userRepository.save(user);
        logisticRepository.save(logistic);

        return logisticMapper.toDTO(logistic);
    }

    // Métodos Auxiliares
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(1_000_000));
    }

    private void sendVerificationEmail(User user) {
        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());
    }
}
