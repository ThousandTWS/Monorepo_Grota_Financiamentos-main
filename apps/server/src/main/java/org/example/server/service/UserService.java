package org.example.server.service;

import org.example.server.dto.auth.*;
import org.example.server.dto.user.UserMapper;
import org.example.server.dto.user.UserRequestDTO;
import org.example.server.dto.user.UserResponseDTO;
import org.example.server.enums.UserRole;
import org.example.server.enums.UserStatus;
import org.example.server.exception.auth.InvalidPasswordException;
import org.example.server.exception.auth.CodeInvalidException;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.exception.user.UserAlreadyVerifiedException;
import org.example.server.exception.user.UserNotVerifiedException;
import org.example.server.model.User;
import org.example.server.repository.UserRepository;
import org.example.server.util.VerificationCodeGenerator;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager manager;
    private final EmailService emailService;
    private final UserMapper userMapper;
    private final VerificationCodeGenerator codeGenerator;
    private final SecureRandom random = new SecureRandom();

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager manager,
            EmailService emailService,
            UserMapper userMapper,
            VerificationCodeGenerator codeGenerator
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.manager = manager;
        this.emailService = emailService;
        this.userMapper = userMapper;
        this.codeGenerator = codeGenerator;
    }

    public UserResponseDTO create(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.email())){
            throw new DataAlreadyExistsException("E-mail já cadastrado");
        }
        User user = userMapper.toEntity(userRequestDTO);

        user.setRole(UserRole.ADMIN);
        user.setVerified(UserStatus.PENDENTE);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.generateVerificationCode(codeGenerator.generate(), Duration.ofMinutes(10));

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());

        return userMapper.toDto(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordDTO changePasswordDTO) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado com o id: " + email));

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
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado com id: " + request.email()));

        if (user.getVerificationStatus() == UserStatus.PENDENTE) {
            throw new UserNotVerifiedException("Conta ainda não verificada. Verifique seu e-mail.");
        }

        return jwtService.generateToken(user);
    }

    public void verifiUser(VerificationCodeRequestDTO verificationCodeRequestDTO) {
        User user = userRepository.findByEmail(verificationCodeRequestDTO.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuario não encontrado com o id: " + verificationCodeRequestDTO.email()));

        if (user.getVerificationStatus() == UserStatus.ATIVO) {
            throw new UserAlreadyVerifiedException("Usuário já verificado");
        }
        if (!user.isVerificationCodeValid(verificationCodeRequestDTO.code())) {
            throw new CodeInvalidException("Código invádo ou expirado");
        }

        user.markAsVerified();
        userRepository.save(user);
    }

    public void resendCode(EmailResponseDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RecordNotFoundException("E-mail não cadastrado"));

        if (user.getVerified() == UserStatus.ATIVO){
            throw new UserAlreadyVerifiedException("Usuário já verificado. Não é necessário reenviar o código.");
        }

        String newCode = codeGenerator.generate();
        user.generateVerificationCode(newCode, Duration.ofMinutes(10));
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), newCode);
    }

    @Transactional
    public void requestPasswordReset(PasswordResetRequestDTO passwordResetRequestDTO) {
        User user = userRepository.findByEmail(passwordResetRequestDTO.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado com email: " + passwordResetRequestDTO.email()));

        String resetCode = codeGenerator.generate();
        user.generateResetCode(resetCode, Duration.ofMinutes(10));

        userRepository.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), resetCode);
    }

    @Transactional
    public void resetPassword(PasswordResetConfirmRequestDTO passwordResetConfirmRequestDTO) {
        User user = userRepository.findByEmail(passwordResetConfirmRequestDTO.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado com email: " + passwordResetConfirmRequestDTO.email()));

        if (user.isResetCodeValid(passwordResetConfirmRequestDTO.code())) {
            throw new CodeInvalidException("Código inválido ou expirado");
        }

        user.setPassword(passwordResetConfirmRequestDTO.newPassword());
        user.clearVerificationCode();
        userRepository.save(user);
    }

    public List<UserResponseDTO> findAll() {
        List<User> usersDtos = userRepository.findAll();
        return usersDtos.stream()
                .map(userResponseDTO -> userMapper.toDto(userResponseDTO))
                .collect(Collectors.toList());
    }
}
