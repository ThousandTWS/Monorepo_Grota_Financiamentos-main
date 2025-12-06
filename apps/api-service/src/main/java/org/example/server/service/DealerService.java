package org.example.server.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.server.dto.address.AddressMapper;
import org.example.server.dto.dealer.*;
import org.example.server.dto.document.DocumentResponseDTO;
import org.example.server.enums.UserRole;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Dealer;
import org.example.server.model.Partner;
import org.example.server.model.User;
import org.example.server.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DealerService {

    private final DealerRepository dealerRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final DealerRegistrationMapper dealerRegistrationMapper;
    private final PasswordEncoder passwordEncoder;
    private final DealerProfileMapper dealerProfileMapper;
    private final AddressMapper addressMapper;
    private final DealerDetailsMapper dealerDetailsMapper;
    private final RefreshTokenRepository refreshTokenRepository;
    private final SellerRepository sellerRepository;
    private final ManagerRepository managerRepository;
    private final OperatorRepository operatorRepository;
    private final ProposalRepository proposalRepository;
    private final VehicleRepository vehicleRepository;

    public DealerService(
            DealerRepository dealerRepository,
            UserRepository userRepository,
            DocumentRepository documentRepository,
            DealerRegistrationMapper dealerRegistrationMapper,
            PasswordEncoder passwordEncoder,
            DealerProfileMapper dealerProfileMapper,
            AddressMapper addressMapper,
            DealerDetailsMapper dealerDetailsMapper,
            RefreshTokenRepository refreshTokenRepository,
            SellerRepository sellerRepository,
            ManagerRepository managerRepository,
            OperatorRepository operatorRepository,
            ProposalRepository proposalRepository,
            VehicleRepository vehicleRepository
    ) {
        this.dealerRepository = dealerRepository;
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.dealerRegistrationMapper = dealerRegistrationMapper;
        this.passwordEncoder = passwordEncoder;
        this.dealerProfileMapper = dealerProfileMapper;
        this.addressMapper = addressMapper;
        this.dealerDetailsMapper = dealerDetailsMapper;
        this.refreshTokenRepository = refreshTokenRepository;
        this.sellerRepository = sellerRepository;
        this.managerRepository = managerRepository;
        this.operatorRepository = operatorRepository;
        this.proposalRepository = proposalRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public DealerRegistrationResponseDTO create(DealerRegistrationRequestDTO dealerRegistrationRequestDTO) {
        String normalizedEnterprise = normalize(dealerRegistrationRequestDTO.enterprise());

        if (dealerRepository.existsByPhone(dealerRegistrationRequestDTO.phone())) {
            throw new DataAlreadyExistsException("Telefone já cadastrado");
        }
        if (dealerRepository.existsByEnterpriseIgnoreCase(normalizedEnterprise)) {
            throw new DataAlreadyExistsException("Empresa já cadastrada");
        }

        User user = new User();
        user.setFullName(dealerRegistrationRequestDTO.fullName());
        user.setEmail(generateFallbackEmail(normalizedEnterprise, dealerRegistrationRequestDTO.phone()));
        user.setPassword(passwordEncoder.encode(dealerRegistrationRequestDTO.password()));
        user.setRole(UserRole.LOJISTA);
        user.markAsVerified();

        Dealer dealer = new Dealer();
        dealer.setUser(user);
        dealer.setPhone(dealerRegistrationRequestDTO.phone());
        dealer.setEnterprise(normalizedEnterprise);
        dealer.setReferenceCode(generateReferenceCode(normalizedEnterprise, dealerRegistrationRequestDTO.phone()));
        dealer.setUser(user);

        user.setDealer(dealer);

        dealerRepository.save(dealer);

        return dealerRegistrationMapper.toDTO(dealer);
    }

    @Transactional
    public DealerRegistrationResponseDTO createFromAdmin(DealerAdminRegistrationRequestDTO dto) {
        String normalizedEnterprise = normalize(dto.enterprise());
        String normalizedPhone = digitsOnly(dto.phone());

        if (dealerRepository.existsByPhone(normalizedPhone)) {
            throw new DataAlreadyExistsException("Telefone já cadastrado");
        }
        if (dealerRepository.existsByEnterpriseIgnoreCase(normalizedEnterprise)) {
            throw new DataAlreadyExistsException("Empresa já cadastrada");
        }

        User user = new User();
        user.setFullName(dto.fullName());
        user.setEmail(generateFallbackEmail(normalizedEnterprise, dto.phone()));
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(UserRole.LOJISTA);
        user.markAsVerified();

        Dealer dealer = new Dealer();
        dealer.setUser(user);
        dealer.setPhone(normalizedPhone);
        dealer.setEnterprise(normalizedEnterprise);
        dealer.setFullNameEnterprise(normalize(dto.razaoSocial()));
        dealer.setCnpj(digitsOnly(dto.cnpj()));
        dealer.setObservation(normalize(dto.observation()));
        dealer.setReferenceCode(generateReferenceCode(normalizedEnterprise, dto.phone()));
        if (dto.address() != null) {
            var address = addressMapper.fromAdmin(dto.address());
            if (address != null) {
                address.setZipCode(digitsOnly(dto.address().zipCode()));
                dealer.setAddress(address);
            }
        }

        if (dto.partners() != null && !dto.partners().isEmpty()) {
            List<Partner> partners = dto.partners().stream().map(p -> {
                Partner partner = new Partner();
                partner.setCpf(digitsOnly(p.cpf()));
                partner.setName(p.name());
                partner.setType(p.type());
                partner.setSignatory(p.signatory());
                partner.setDealer(dealer);
                return partner;
            }).toList();
            dealer.setPartners(partners);
        }

        user.setDealer(dealer);
        dealerRepository.save(dealer);

        return dealerRegistrationMapper.toDTO(dealer);
    }

    public List<DealerRegistrationResponseDTO> findAll() {
        List<Dealer> dealerList = dealerRepository.findAll();
        return dealerList.stream()
                .map(dealerRegistrationMapper::toDTO)
                .toList();
    }

    @SuppressWarnings("null")
    public DealerRegistrationResponseDTO findById(Long id) {
        return dealerRegistrationMapper.toDTO(dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    @SuppressWarnings("null")
    public List<DocumentResponseDTO> getDealerDocuments(Long id) {
        if (!dealerRepository.existsById(id)) {
            throw new RecordNotFoundException(id);
        }
        return documentRepository.findDocumentsByDealerId(id);
    }

    public DealerDetailsResponseDTO findDetailDealer(Long id) {
        @SuppressWarnings("null")
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        return dealerDetailsMapper.toDTO(dealer);
    }

    @Transactional(readOnly = true)
    public DealerDetailsResponseDTO findDetailDealerByUserId(Long userId) {
        Dealer dealer = dealerRepository.findByUserId(userId)
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado para o usuário informado."));
        return dealerDetailsMapper.toDTO(dealer);
    }

    @Transactional
    public DealerProfileDTO completeProfile(Long userId, DealerProfileDTO dealerProfileDTO) {
        Dealer dealer = dealerRepository.findByUserId(userId)
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado para o usuário informado."));

        dealer.setFullNameEnterprise(dealerProfileDTO.fullNameEnterprise());
        dealer.setBirthData(dealerProfileDTO.birthData());
        dealer.setCnpj(dealerProfileDTO.cnpj());
        dealer.setAddress(addressMapper.toEntity(dealerProfileDTO.address()));

        return dealerProfileMapper.toDTO(dealerRepository.save(dealer));
    }

    @Transactional
    public DealerRegistrationResponseDTO update(Long id, DealerRegistrationRequestDTO dealerRegistrationRequestDTO) {
        @SuppressWarnings("null")
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User user = dealer.getUser();
        if (user == null) {
            throw new EntityNotFoundException("Usuário vinculado à logística não encontrado");
        }

        String normalizedEnterprise = normalize(dealerRegistrationRequestDTO.enterprise());

        if (normalizedEnterprise != null && !normalizedEnterprise.equalsIgnoreCase(dealer.getEnterprise())
                && dealerRepository.existsByEnterpriseIgnoreCase(normalizedEnterprise)) {
            throw new DataAlreadyExistsException("Empresa já cadastrada");
        }

        user.setFullName(dealerRegistrationRequestDTO.fullName());
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            user.setEmail(generateFallbackEmail(normalizedEnterprise, dealerRegistrationRequestDTO.phone()));
        }

        dealer.setPhone(dealerRegistrationRequestDTO.phone());
        dealer.setEnterprise(normalizedEnterprise);

        userRepository.save(user);
        dealerRepository.save(dealer);

        return dealerRegistrationMapper.toDTO(dealer);
    }

    @SuppressWarnings("null")
    @Transactional
    public DealerProfileDTO updateProfile(Long userId, DealerProfileDTO dto) {
        Dealer dealer = dealerRepository.findByUserId(userId)
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado para o usuário informado."));

        if (dto.fullNameEnterprise() != null) dealer.setFullNameEnterprise(dto.fullNameEnterprise());
        if (dto.birthData() != null) dealer.setBirthData(dto.birthData());
        if (dto.cnpj() != null) dealer.setCnpj(dto.cnpj());
        if (dto.address() != null) dealer.setAddress(addressMapper.toEntity(dto.address()));

        return dealerProfileMapper.toDTO(dealerRepository.save(dealer));
    }

    @SuppressWarnings("null")
    @Transactional
    public void delete(Long id) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        proposalRepository.deleteAll(proposalRepository.findByDealer(dealer));
        vehicleRepository.deleteAll(vehicleRepository.findByDealerId(id));
        documentRepository.deleteByDealerId(id);
        sellerRepository.deleteAll(sellerRepository.findByDealerId(id));
        managerRepository.deleteAll(managerRepository.findByDealerId(id));
        operatorRepository.deleteAll(operatorRepository.findByDealerId(id));

        User user = dealer.getUser();
        if (user != null) {
            refreshTokenRepository.deleteByUser(user);
        }

        dealerRepository.delete(dealer);
    }

    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String digitsOnly(String value) {
        if (value == null) return null;
        return value.replaceAll("\\D", "");
    }

    private String generateFallbackEmail(String enterprise, String phone) {
        String base = normalize(enterprise);
        String phoneDigits = digitsOnly(phone);
        String random = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);
        String local = (base != null && !base.isBlank() ? base.replaceAll("\\s+", "").toLowerCase() : "lojista")
                + (phoneDigits != null && !phoneDigits.isBlank() ? "-" + phoneDigits : "-" + random);
        return local + "@lojista.local";
    }

    private String generateReferenceCode(String enterprise, String phone) {
        String base = normalize(enterprise);
        String phoneDigits = digitsOnly(phone);
        String random = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 6).toUpperCase();
        String prefix = base != null && !base.isBlank()
                ? base.replaceAll("[^A-Za-z0-9]", "").toUpperCase()
                : "LOGISTA";
        String phoneSuffix = phoneDigits != null && phoneDigits.length() >= 4
                ? phoneDigits.substring(phoneDigits.length() - 4)
                : random;
        return (prefix.length() > 6 ? prefix.substring(0, 6) : prefix) + "-" + phoneSuffix;
    }
}
