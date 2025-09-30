package org.example.server.service;

import org.example.server.dto.auth.AuthRequest;
import org.example.server.dto.auth.AuthResponse;
import org.example.server.dto.auth.ChangePassword;
import org.example.server.dto.auth.VerificationCodeRequestDTO;
import org.example.server.exception.*;
import org.example.server.model.User;
import org.example.server.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager manager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager manager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.manager = manager;
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(String email, ChangePassword changePassword){
       var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado"));

       if (!passwordEncoder.matches(changePassword.oldPassword(), user.getPassword())){
           throw new InvalidPasswordException("Senha atual incorreta");
       }

       if (passwordEncoder.matches(changePassword.newPassword(), user.getPassword())){
           throw new InvalidPasswordException("A nova senha não pode ser igual à senha atual");
       }

       user.setPassword(passwordEncoder.encode(changePassword.newPassword()));
       userRepository.save(user);
    }

    public AuthResponse login(AuthRequest request) {
        manager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado"));

        if(!user.isVerified()){
            throw new UserNotVerifiedException("Conta ainda não verificada. Verifique seu e-mail.");
        }

        var jwt = jwtService.generateToken(user);
        return new AuthResponse(jwt);
    }

    public void verifiUser(VerificationCodeRequestDTO verificationCodeRequestDTO) {
        User user = userRepository.findByEmail(verificationCodeRequestDTO.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuario não encontrado"));

        if (user.isVerified()) throw new UserAlreadyVerifiedException("Usuário já verificado");
        if (user.getVerificationCode() == null || !user.getVerificationCode().equalsIgnoreCase(verificationCodeRequestDTO.code()))
            throw new InvalidVerificationCodeException("Códico inválido");
        if (user.getCodeExpiration().isBefore(LocalDateTime.now())) throw new VerificationCodeExpiredException("Código expirado.");

        user.setVerified(true);
        user.setVerificationCode(null);
        user.setCodeExpiration(null);
        userRepository.save(user);
    }
}
