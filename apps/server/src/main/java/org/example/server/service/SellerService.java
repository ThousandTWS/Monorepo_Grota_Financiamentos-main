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
import org.example.server.model.Seller;
import org.example.server.model.User;
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

    public SellerService(SellerRepository sellerRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, SellerMapper sellerMapper, AddressMapper addressMapper, EmailService emailService) {
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sellerMapper = sellerMapper;
        this.addressMapper = addressMapper;
        this.emailService = emailService;
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

        user.setSeller(seller);

        emailService.sendPasswordToEmail(sellerRequestDTO.email(), sellerRequestDTO.password());

        return sellerMapper.toDTO(sellerRepository.save(seller));
    }

    public List<SellerResponseDTO> findAll() {
        return sellerRepository.findAll()
                .stream()
                .map(seller -> sellerMapper.toDTO(seller))
                .collect(Collectors.toList());
    }

    public SellerResponseDTO findById(@PathVariable Long id) {
        return sellerMapper.toDTO(sellerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    public SellerResponseDTO update(Long id, SellerRequestDTO sellerRequestDTO) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User user = seller.getUser();

        user.setFullName(sellerRequestDTO.fullName());
        user.setEmail(sellerRequestDTO.email());

        seller.setPhone(sellerRequestDTO.phone());
        seller.setCPF(sellerRequestDTO.CPF());
        seller.setBirthData(sellerRequestDTO.birthData());

        userRepository.save(user);
        sellerRepository.save(seller);

        return sellerMapper.toDTO(seller);
    }
}
