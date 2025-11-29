package org.example.server.service;

import org.example.server.dto.address.AddressMapper;
import org.example.server.dto.manager.ManagerMapper;
import org.example.server.dto.manager.ManagerRequestDTO;
import org.example.server.dto.manager.ManagerResponseDTO;
import org.example.server.enums.UserRole;
import org.example.server.enums.UserStatus;
import org.example.server.exception.auth.AccessDeniedException;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Manager;
import org.example.server.model.User;
import org.example.server.repository.ManagerRepository;
import org.example.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManagerService {

    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ManagerMapper managerMapper;
    private final AddressMapper addressMapper;
    private final EmailService emailService;

    public ManagerService(
            ManagerRepository managerRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ManagerMapper managerMapper,
            AddressMapper addressMapper,
            EmailService emailService
    ) {
        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.managerMapper = managerMapper;
        this.addressMapper = addressMapper;
        this.emailService = emailService;
    }

    public ManagerResponseDTO create(User user, ManagerRequestDTO managerRequestDTO) {

        if (!user.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode cadastrar gestor.");
        }

        if (userRepository.existsByEmail(managerRequestDTO.email())) {
            throw new DataAlreadyExistsException("Email já existe.");
        }

        if (managerRepository.existsByPhone(managerRequestDTO.phone())) {
            throw new DataAlreadyExistsException("Telefone já existe.");
        }

        User newUser = new User();
        newUser.setFullName(managerRequestDTO.fullName());
        newUser.setEmail(managerRequestDTO.email());
        newUser.setPassword(passwordEncoder.encode(managerRequestDTO.password()));
        newUser.setRole(UserRole.GESTOR);
        newUser.setStatus(UserStatus.ATIVO);

        Manager manager = new Manager();
        manager.setPhone(managerRequestDTO.phone());
        manager.setCPF(managerRequestDTO.CPF());
        manager.setBirthData(managerRequestDTO.birthData());
        manager.setAddress(addressMapper.toEntity(managerRequestDTO.address()));
        manager.setUser(newUser);
        manager.setCanView(managerRequestDTO.canView() != null ? managerRequestDTO.canView() : true);
        manager.setCanCreate(managerRequestDTO.canCreate() != null ? managerRequestDTO.canCreate() : true);
        manager.setCanUpdate(managerRequestDTO.canUpdate() != null ? managerRequestDTO.canUpdate() : true);
        manager.setCanDelete(managerRequestDTO.canDelete() != null ? managerRequestDTO.canDelete() : true);

        newUser.setManager(manager);

        emailService.sendPasswordToEmail(managerRequestDTO.email(), managerRequestDTO.password());

        return managerMapper.toDTO(managerRepository.save(manager));
    }

    public List<ManagerResponseDTO> findAll() {
        return managerRepository.findAll()
                .stream()
                .map(managerMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ManagerResponseDTO findById(@PathVariable Long id) {
        return managerMapper.toDTO(managerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    public ManagerResponseDTO update(Long id, ManagerRequestDTO managerRequestDTO) {
        Manager manager = managerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User managerUser = manager.getUser();

        managerUser.setFullName(managerRequestDTO.fullName());
        managerUser.setEmail(managerRequestDTO.email());

        manager.setPhone(managerRequestDTO.phone());
        manager.setCPF(managerRequestDTO.CPF());
        manager.setBirthData(managerRequestDTO.birthData());
        manager.setAddress(addressMapper.toEntity(managerRequestDTO.address()));
        manager.setCanView(managerRequestDTO.canView() != null ? managerRequestDTO.canView() : manager.getCanView());
        manager.setCanCreate(managerRequestDTO.canCreate() != null ? managerRequestDTO.canCreate() : manager.getCanCreate());
        manager.setCanUpdate(managerRequestDTO.canUpdate() != null ? managerRequestDTO.canUpdate() : manager.getCanUpdate());
        manager.setCanDelete(managerRequestDTO.canDelete() != null ? managerRequestDTO.canDelete() : manager.getCanDelete());

        userRepository.save(managerUser);
        managerRepository.save(manager);

        return managerMapper.toDTO(manager);
    }
}
