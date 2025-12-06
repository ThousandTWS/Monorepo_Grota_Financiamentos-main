package org.example.server.service;

import org.example.server.dto.address.AddressMapper;
import org.example.server.dto.manager.ManagerMapper;
import org.example.server.dto.manager.ManagerRequestDTO;
import org.example.server.dto.manager.ManagerResponseDTO;
import org.example.server.dto.pagination.PagedResponseDTO;
import org.example.server.enums.UserRole;
import org.example.server.enums.UserStatus;
import org.example.server.exception.auth.AccessDeniedException;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Dealer;
import org.example.server.model.Manager;
import org.example.server.model.User;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.ManagerRepository;
import org.example.server.repository.UserRepository;
import org.example.server.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class ManagerService {

    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ManagerMapper managerMapper;
    private final AddressMapper addressMapper;
    private final EmailService emailService;
    private final DealerRepository dealerRepository;

    public ManagerService(
            ManagerRepository managerRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ManagerMapper managerMapper,
            AddressMapper addressMapper,
            EmailService emailService,
            DealerRepository dealerRepository
    ) {
        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.managerMapper = managerMapper;
        this.addressMapper = addressMapper;
        this.emailService = emailService;
        this.dealerRepository = dealerRepository;
    }

    public ManagerResponseDTO create(User user, ManagerRequestDTO managerRequestDTO) {

        if (!user.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode cadastrar gestor.");
        }

        if (userRepository.existsByEmail(managerRequestDTO.email())) {
            throw new DataAlreadyExistsException("Email ja existe.");
        }

        if (managerRepository.existsByPhone(managerRequestDTO.phone())) {
            throw new DataAlreadyExistsException("Telefone ja existe.");
        }

        Dealer dealer = null;
        if (managerRequestDTO.dealerId() != null) {
            dealer = dealerRepository.findById(managerRequestDTO.dealerId())
                    .orElseThrow(() -> new RecordNotFoundException("Lojista nao encontrado."));
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
        manager.setDealer(dealer);

        newUser.setManager(manager);

        emailService.sendPasswordToEmail(managerRequestDTO.email(), managerRequestDTO.password());

        return managerMapper.toDTO(managerRepository.save(manager));
    }

    public PagedResponseDTO<ManagerResponseDTO> findAll(Long dealerId, int page, int size) {
        Pageable pageable = PaginationUtils.buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Manager> managers = dealerId != null
                ? managerRepository.findByDealerId(dealerId, pageable)
                : managerRepository.findAll(pageable);

        return PagedResponseDTO.fromPage(managers.map(managerMapper::toDTO));
    }

    public ManagerResponseDTO findById(@PathVariable Long id) {
        return managerMapper.toDTO(managerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    public ManagerResponseDTO updateDealer(User requester, Long managerId, Long dealerId) {
        if (!requester.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode reatribuir gestor.");
        }

        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new RecordNotFoundException(managerId));
        if (dealerId != null) {
            Dealer dealer = dealerRepository.findById(dealerId)
                    .orElseThrow(() -> new RecordNotFoundException("Lojista nao encontrado."));
            manager.setDealer(dealer);
        } else {
            manager.setDealer(null);
        }
        managerRepository.save(manager);
        return managerMapper.toDTO(manager);
    }

    public ManagerResponseDTO update(Long id, ManagerRequestDTO managerRequestDTO) {
        Manager manager = managerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User managerUser = manager.getUser();
        Dealer dealer = manager.getDealer();
        if (managerRequestDTO.dealerId() != null) {
            dealer = dealerRepository.findById(managerRequestDTO.dealerId())
                    .orElseThrow(() -> new RecordNotFoundException("Lojista nao encontrado."));
        }

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
        manager.setDealer(dealer);

        userRepository.save(managerUser);
        managerRepository.save(manager);

        return managerMapper.toDTO(manager);
    }

    public void delete(User requester, Long managerId) {
        if (!requester.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode remover gestor.");
        }
        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new RecordNotFoundException(managerId));
        managerRepository.delete(manager);
    }
}
