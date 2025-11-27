package org.example.server.service;

import org.example.server.dto.address.AddressMapper;
import org.example.server.dto.operator.OperatorMapper;
import org.example.server.dto.operator.OperatorRequestDTO;
import org.example.server.dto.operator.OperatorResponseDTO;
import org.example.server.enums.UserRole;
import org.example.server.enums.UserStatus;
import org.example.server.exception.auth.AccessDeniedException;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Operator;
import org.example.server.model.User;
import org.example.server.repository.OperatorRepository;
import org.example.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OperatorService {

    private final OperatorRepository operatorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OperatorMapper operatorMapper;
    private final AddressMapper addressMapper;
    private final EmailService emailService;

    public OperatorService(
            OperatorRepository operatorRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            OperatorMapper operatorMapper,
            AddressMapper addressMapper,
            EmailService emailService
    ) {
        this.operatorRepository = operatorRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.operatorMapper = operatorMapper;
        this.addressMapper = addressMapper;
        this.emailService = emailService;
    }

    public OperatorResponseDTO create(User user, OperatorRequestDTO operatorRequestDTO) {

        if (!user.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode cadastrar operador.");
        }

        if (userRepository.existsByEmail(operatorRequestDTO.email())) {
            throw new DataAlreadyExistsException("Email já existe.");
        }

        if (operatorRepository.existsByPhone(operatorRequestDTO.phone())) {
            throw new DataAlreadyExistsException("Telefone já existe.");
        }

        User newUser = new User();
        newUser.setFullName(operatorRequestDTO.fullName());
        newUser.setEmail(operatorRequestDTO.email());
        newUser.setPassword(passwordEncoder.encode(operatorRequestDTO.password()));
        newUser.setRole(UserRole.OPERADOR);
        newUser.setStatus(UserStatus.ATIVO);

        Operator operator = new Operator();
        operator.setPhone(operatorRequestDTO.phone());
        operator.setCPF(operatorRequestDTO.CPF());
        operator.setBirthData(operatorRequestDTO.birthData());
        operator.setAddress(addressMapper.toEntity(operatorRequestDTO.address()));
        operator.setUser(newUser);

        newUser.setOperator(operator);

        emailService.sendPasswordToEmail(operatorRequestDTO.email(), operatorRequestDTO.password());

        return operatorMapper.toDTO(operatorRepository.save(operator));
    }

    public List<OperatorResponseDTO> findAll() {
        return operatorRepository.findAll()
                .stream()
                .map(operatorMapper::toDTO)
                .collect(Collectors.toList());
    }

    public OperatorResponseDTO findById(@PathVariable Long id) {
        return operatorMapper.toDTO(operatorRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    public OperatorResponseDTO update(Long id, OperatorRequestDTO operatorRequestDTO) {
        Operator operator = operatorRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User operatorUser = operator.getUser();

        operatorUser.setFullName(operatorRequestDTO.fullName());
        operatorUser.setEmail(operatorRequestDTO.email());

        operator.setPhone(operatorRequestDTO.phone());
        operator.setCPF(operatorRequestDTO.CPF());
        operator.setBirthData(operatorRequestDTO.birthData());
        operator.setAddress(addressMapper.toEntity(operatorRequestDTO.address()));

        userRepository.save(operatorUser);
        operatorRepository.save(operator);

        return operatorMapper.toDTO(operator);
    }
}
