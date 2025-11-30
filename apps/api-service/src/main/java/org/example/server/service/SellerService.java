package org.example.server.service;

import org.example.server.dto.address.AddressMapper;
import org.example.server.dto.seller.SellerMapper;
import org.example.server.dto.seller.SellerRequestDTO;
import org.example.server.dto.seller.SellerResponseDTO;
import org.example.server.enums.UserRole;
import org.example.server.enums.UserStatus;
import org.example.server.exception.auth.AccessDeniedException;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Dealer;
import org.example.server.model.Seller;
import org.example.server.model.User;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.SellerRepository;
import org.example.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SellerMapper sellerMapper;
    private final AddressMapper addressMapper;
    private final EmailService emailService;
    private final DealerRepository dealerRepository;

    public SellerService(SellerRepository sellerRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, SellerMapper sellerMapper, AddressMapper addressMapper, EmailService emailService, DealerRepository dealerRepository) {
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sellerMapper = sellerMapper;
        this.addressMapper = addressMapper;
        this.emailService = emailService;
        this.dealerRepository = dealerRepository;
    }

    public SellerResponseDTO create(User user, SellerRequestDTO sellerRequestDTO) {

        if (!user.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode cadastrar vendedor.");
        }

        if (userRepository.existsByEmail(sellerRequestDTO.email())) {
            throw new DataAlreadyExistsException("Email já existe.");
        }

        if (sellerRepository.existsByPhone(sellerRequestDTO.phone())) {
            throw new DataAlreadyExistsException("Telefone já existe.");
        }

        Dealer dealer = dealerRepository.findById(sellerRequestDTO.dealerId())
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado."));

        User newUser = new User();
        newUser.setFullName(sellerRequestDTO.fullName());
        newUser.setEmail(sellerRequestDTO.email());
        newUser.setPassword(passwordEncoder.encode(sellerRequestDTO.password()));
        newUser.setRole(UserRole.VENDEDOR);
        newUser.setStatus(UserStatus.ATIVO);

        Seller seller = new Seller();
        seller.setPhone(sellerRequestDTO.phone());
        seller.setCPF(sellerRequestDTO.CPF());
        seller.setBirthData(sellerRequestDTO.birthData());
        seller.setAddress(addressMapper.toEntity(sellerRequestDTO.address()));
        seller.setUser(newUser);
        seller.setCanView(sellerRequestDTO.canView() != null ? sellerRequestDTO.canView() : true);
        seller.setCanCreate(sellerRequestDTO.canCreate() != null ? sellerRequestDTO.canCreate() : true);
        seller.setCanUpdate(sellerRequestDTO.canUpdate() != null ? sellerRequestDTO.canUpdate() : true);
        seller.setCanDelete(sellerRequestDTO.canDelete() != null ? sellerRequestDTO.canDelete() : true);
        seller.setDealer(dealer);

        newUser.setSeller(seller);

        emailService.sendPasswordToEmail(sellerRequestDTO.email(), sellerRequestDTO.password());

        return sellerMapper.toDTO(sellerRepository.save(seller));
    }

    public List<SellerResponseDTO> findAll(Long dealerId) {
        List<Seller> sellers = dealerId != null
                ? sellerRepository.findByDealerId(dealerId)
                : sellerRepository.findAll();

        return sellers
                .stream()
                .map(sellerMapper::toDTO)
                .collect(Collectors.toList());
    }

    public SellerResponseDTO findById(@PathVariable Long id) {
        return sellerMapper.toDTO(sellerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    public SellerResponseDTO updateDealer(User requester, Long sellerId, Long dealerId) {
        if (!requester.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode reatribuir vendedor.");
        }

        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new RecordNotFoundException(sellerId));

        if (dealerId != null) {
            Dealer dealer = dealerRepository.findById(dealerId)
                    .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado."));
            seller.setDealer(dealer);
        } else {
            seller.setDealer(null);
        }

        sellerRepository.save(seller);
        return sellerMapper.toDTO(seller);
    }

    public SellerResponseDTO update(Long id, SellerRequestDTO sellerRequestDTO) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User user = seller.getUser();
        Dealer dealer = dealerRepository.findById(sellerRequestDTO.dealerId())
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado."));

        user.setFullName(sellerRequestDTO.fullName());
        user.setEmail(sellerRequestDTO.email());

        seller.setPhone(sellerRequestDTO.phone());
        seller.setCPF(sellerRequestDTO.CPF());
        seller.setBirthData(sellerRequestDTO.birthData());
        seller.setCanView(sellerRequestDTO.canView() != null ? sellerRequestDTO.canView() : seller.getCanView());
        seller.setCanCreate(sellerRequestDTO.canCreate() != null ? sellerRequestDTO.canCreate() : seller.getCanCreate());
        seller.setCanUpdate(sellerRequestDTO.canUpdate() != null ? sellerRequestDTO.canUpdate() : seller.getCanUpdate());
        seller.setCanDelete(sellerRequestDTO.canDelete() != null ? sellerRequestDTO.canDelete() : seller.getCanDelete());
        seller.setDealer(dealer);

        userRepository.save(user);
        sellerRepository.save(seller);

        return sellerMapper.toDTO(seller);
    }

    public void delete(User requester, Long sellerId) {
        if (!requester.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Apenas ADMIN pode remover vendedor.");
        }
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new RecordNotFoundException(sellerId));
        sellerRepository.delete(seller);
    }
}
