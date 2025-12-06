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
import org.example.server.model.Dealer;
import org.example.server.model.Operator;
import org.example.server.model.User;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.OperatorRepository;
import org.example.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class OperatorService {

    private final OperatorRepository operatorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OperatorMapper operatorMapper;
    private final AddressMapper addressMapper;
    private final EmailService emailService;
    private final DealerRepository dealerRepository;

    public OperatorService(
            OperatorRepository operatorRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            OperatorMapper operatorMapper,
            AddressMapper addressMapper,
            EmailService emailService,
            DealerRepository dealerRepository
    ) {
        this.operatorRepository = operatorRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.operatorMapper = operatorMapper;
        this.addressMapper = addressMapper;
        this.emailService = emailService;
        this.dealerRepository = dealerRepository;
    }

    public OperatorResponseDTO create(User user, OperatorRequestDTO operatorRequestDTO) {

        if (!user.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode cadastrar operador.");
        }

        if (userRepository.existsByEmail(operatorRequestDTO.email())) {
            throw new DataAlreadyExistsException("Email jǭ existe.");
        }

        if (operatorRepository.existsByPhone(operatorRequestDTO.phone())) {
            throw new DataAlreadyExistsException("Telefone jǭ existe.");
        }

        Dealer dealer = null;
        if (operatorRequestDTO.dealerId() != null) {
            dealer = dealerRepository.findById(operatorRequestDTO.dealerId())
                    .orElseThrow(() -> new RecordNotFoundException("Lojista nǜo encontrado."));
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
        operator.setCanView(operatorRequestDTO.canView() != null ? operatorRequestDTO.canView() : true);
        operator.setCanCreate(operatorRequestDTO.canCreate() != null ? operatorRequestDTO.canCreate() : true);
        operator.setCanUpdate(operatorRequestDTO.canUpdate() != null ? operatorRequestDTO.canUpdate() : true);
        operator.setCanDelete(operatorRequestDTO.canDelete() != null ? operatorRequestDTO.canDelete() : true);
        operator.setDealer(dealer);

        newUser.setOperator(operator);

        emailService.sendPasswordToEmail(operatorRequestDTO.email(), operatorRequestDTO.password());

        return operatorMapper.toDTO(operatorRepository.save(operator));
    }

    public java.util.List<OperatorResponseDTO> findAll(Long dealerId) {
        java.util.List<Operator> operators = dealerId != null
                ? operatorRepository.findByDealerId(dealerId)
                : operatorRepository.findAll();

        return operators
                .stream()
                .map(operatorMapper::toDTO)
                .toList();
    }

    public OperatorResponseDTO findById(@PathVariable Long id) {
        return operatorMapper.toDTO(operatorRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    public OperatorResponseDTO update(Long id, OperatorRequestDTO operatorRequestDTO) {
        Operator operator = operatorRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User operatorUser = operator.getUser();
        Dealer dealer = operator.getDealer();
        if (operatorRequestDTO.dealerId() != null) {
            dealer = dealerRepository.findById(operatorRequestDTO.dealerId())
                    .orElseThrow(() -> new RecordNotFoundException("Lojista nǜo encontrado."));
        }

        operatorUser.setFullName(operatorRequestDTO.fullName());
        operatorUser.setEmail(operatorRequestDTO.email());

        operator.setPhone(operatorRequestDTO.phone());
        operator.setCPF(operatorRequestDTO.CPF());
        operator.setBirthData(operatorRequestDTO.birthData());
        operator.setAddress(addressMapper.toEntity(operatorRequestDTO.address()));
        operator.setCanView(operatorRequestDTO.canView() != null ? operatorRequestDTO.canView() : operator.getCanView());
        operator.setCanCreate(operatorRequestDTO.canCreate() != null ? operatorRequestDTO.canCreate() : operator.getCanCreate());
        operator.setCanUpdate(operatorRequestDTO.canUpdate() != null ? operatorRequestDTO.canUpdate() : operator.getCanUpdate());
        operator.setCanDelete(operatorRequestDTO.canDelete() != null ? operatorRequestDTO.canDelete() : operator.getCanDelete());
        operator.setDealer(dealer);

        userRepository.save(operatorUser);
        operatorRepository.save(operator);

        return operatorMapper.toDTO(operator);
    }

    public OperatorResponseDTO updateDealer(User requester, Long operatorId, Long dealerId) {
        if (!requester.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode reatribuir operador.");
        }

        Operator operator = operatorRepository.findById(operatorId)
                .orElseThrow(() -> new RecordNotFoundException(operatorId));
        if (dealerId != null) {
            Dealer dealer = dealerRepository.findById(dealerId)
                    .orElseThrow(() -> new RecordNotFoundException("Lojista nǜo encontrado."));
            operator.setDealer(dealer);
        } else {
            operator.setDealer(null);
        }
        operatorRepository.save(operator);
        return operatorMapper.toDTO(operator);
    }

    public void delete(User requester, Long operatorId) {
        if (!requester.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode remover operador.");
        }
        Operator operator = operatorRepository.findById(operatorId)
                .orElseThrow(() -> new RecordNotFoundException(operatorId));
        operatorRepository.delete(operator);
    }
}
