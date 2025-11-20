package org.example.server.service;

import org.example.server.dto.auth.*;
import org.example.server.dto.user.UserMapper;
import org.example.server.dto.user.UserRequestDTO;
import org.example.server.dto.user.UserResponseDTO;
import org.example.server.enums.UserRole;
import org.example.server.enums.UserStatus;
import org.example.server.exception.auth.CodeInvalidException;
import org.example.server.exception.auth.InvalidPasswordException;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.exception.user.UserAlreadyVerifiedException;
import org.example.server.exception.user.UserNotVerifiedException;
import org.example.server.model.User;
import org.example.server.repository.UserRepository;
import org.example.server.util.VerificationCodeGenerator;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager manager;
    private final EmailService emailService;
    private final UserMapper userMapper;
    private final VerificationCodeGenerator codeGenerator;

    public UserService(
            UserRepository userRepository, UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager manager,
            EmailService emailService,
            UserMapper userMapper,
            VerificationCodeGenerator codeGenerator
    ) {
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.manager = manager;
        this.emailService = emailService;
        this.userMapper = userMapper;
        this.codeGenerator = codeGenerator;
    }

    public UserResponseDTO create(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.email())) {
            throw new DataAlreadyExistsException("E-mail já cadastrado");
        }
        User user = userMapper.toEntity(userRequestDTO);

        user.setRole(UserRole.ADMIN);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.generateVerificationCode(codeGenerator.generate(), Duration.ofMinutes(10));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());
        return userMapper.toDto(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordDTO changePasswordDTO) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado com o e-mail: " + email));

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

        User user = (User) userDetailsService.loadUserByUsername(request.email());

        if (user.getVerificationStatus() == UserStatus.PENDENTE) {
            throw new UserNotVerifiedException("Conta ainda não verificada. Verifique seu e-mail.");
        }

        return jwtService.generateToken(user);
    }

    public void verifiUser(VerificationCodeRequestDTO verificationCodeRequestDTO) {
        User user = userRepository.findByEmail(verificationCodeRequestDTO.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuario não encontrado com o e-mail: " + verificationCodeRequestDTO.email()));

        if (user.getVerificationStatus() == UserStatus.ATIVO) {
            throw new UserAlreadyVerifiedException("Usuário já verificado");
        }
        if (user.isVerificationCodeExpired()) {
            throw new CodeInvalidException("Código expirado. Solicite um novo código");
        }
        if (!user.doesVerificationCodeMatch(verificationCodeRequestDTO.code())) {
            throw new CodeInvalidException("Código inválido");
        }
        user.markAsVerified();
        userRepository.save(user);
    }

    public void resendCode(EmailResponseDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuario não encontrado com e-mail: " + dto.email()));

        if (user.getVerificationStatus() == UserStatus.ATIVO) {
            throw new UserAlreadyVerifiedException("Usuário já verificado. Não é necessário reenviar o código.");
        }

        user.generateVerificationCode(codeGenerator.generate(), Duration.ofMinutes(10));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());
    }

    @Transactional
    public void requestPasswordReset(PasswordResetRequestDTO passwordResetRequestDTO) {
        User user = userRepository.findByEmail(passwordResetRequestDTO.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado com e-mail: " + passwordResetRequestDTO.email()));

        String resetCode = codeGenerator.generate();
        user.generateResetCode(resetCode, Duration.ofMinutes(10));

        userRepository.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), resetCode);
    }

    @Transactional
    public void resetPassword(PasswordResetConfirmRequestDTO passwordResetConfirmRequestDTO) {
        User user = userRepository.findByEmail(passwordResetConfirmRequestDTO.email())
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado com e-mail: " + passwordResetConfirmRequestDTO.email()));

        if (user.isResetCodeExpired()) {
            throw new CodeInvalidException("Código de redefinição expirado. Solicite um novo.");
        }
        if (!user.doesResetCodeMatch(passwordResetConfirmRequestDTO.code())) {
            throw new CodeInvalidException("Código inválido.");
        }

        user.setPassword(passwordEncoder.encode(passwordResetConfirmRequestDTO.newPassword()));
        user.clearResetCode();
        userRepository.save(user);
    }

    public List<UserResponseDTO> findAll() {
        List<User> usersDtos = userRepository.findAll();
        return usersDtos.stream()
                .map(userResponseDTO -> userMapper.toDto(userResponseDTO))
                .collect(Collectors.toList());
    }

    public UserDetails loadUserByUsername(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado com e-mail: " + email));
    }

}
