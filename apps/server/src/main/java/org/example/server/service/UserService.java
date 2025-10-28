package org.example.server.service;

import org.example.server.dto.auth.*;
import org.example.server.enums.UserVerificationStatus;
import org.example.server.exception.*;
import org.example.server.model.User;
import org.example.server.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager manager;
    private final EmailService emailService;
    private final SecureRandom random = new SecureRandom();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager manager, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.manager = manager;
        this.emailService = emailService;
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordDTO changePasswordDTO) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(changePasswordDTO.oldPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Senha atual incorreta");
        }

        if (passwordEncoder.matches(changePasswordDTO.newPassword(), user.getPassword())) {
            throw new InvalidPasswordException("A nova senha não pode ser igual à senha atual");
        }

        user.setPassword(passwordEncoder.encode(changePasswordDTO.newPassword()));
        userRepository.save(user);
    }

    public String login(AuthRequest request) {
        manager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado"));

        if (user.getVerificationStatus() == UserVerificationStatus.PENDENTE) {
            throw new UserNotVerifiedException("Conta ainda não verificada. Verifique seu e-mail.");
        }

        return jwtService.generateToken(user);
    }

    public void verifiUser(VerificationCodeRequestDTO verificationCodeRequestDTO) {
        User user = userRepository.findByEmail(verificationCodeRequestDTO.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuario não encontrado"));

        if (user.getVerificationStatus() == UserVerificationStatus.ATIVO) {
            throw new UserAlreadyVerifiedException("Usuário já verificado");
        }
        if (!user.isVerificationCodeValid(verificationCodeRequestDTO.code())) {
            throw new InvalidVerificationCodeException("Código invádo ou expirado");
        }

        user.markAsVerified();
        userRepository.save(user);
    }

    public void resendCode(EmailResponseDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new EmailNotFoundException("E-mail não cadastrado"));

        if (user.getVerified() == UserVerificationStatus.ATIVO){
            throw new UserAlreadyVerifiedException("Usuário já verificado. Não é necessário reenviar o código.");
        }

        String newCode = generateResetCode();
        user.generateVerificationCode(newCode, Duration.ofMinutes(10));
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), newCode);
    }

    @Transactional
    public void requestPasswordReset(PasswordResetRequestDTO passwordResetRequestDTO) {
        User user = userRepository.findByEmail(passwordResetRequestDTO.email())
                .orElseThrow(() -> new EmailAlreadyExistsException("Usuário não encontrado"));

        String resetCode = generateResetCode();
        user.generateResetCode(resetCode, Duration.ofMinutes(10));

        userRepository.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), resetCode);
    }

    @Transactional
    public void resetPassword(PasswordResetConfirmRequestDTO passwordResetConfirmRequestDTO) {
        User user = userRepository.findByEmail(passwordResetConfirmRequestDTO.email())
                .orElseThrow(() -> new EmailAlreadyExistsException("Usuário não encontrado"));

        if (user.isResetCodeValid(passwordResetConfirmRequestDTO.code())) {
            throw new PasswordResetCodeExpiredException("Código inválido ou expirado");
        }

        user.setPassword(passwordResetConfirmRequestDTO.newPassword());
        user.clearVerificationCode();
        userRepository.save(user);
    }

    private String generateResetCode() {
        return String.format("%06d", random.nextInt(1_000_000));
    }

}
