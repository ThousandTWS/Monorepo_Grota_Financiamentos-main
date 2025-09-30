package org.example.server.controller;

import jakarta.validation.Valid;
import org.example.server.dto.ApiResponse;
import org.example.server.dto.auth.AuthRequest;
import org.example.server.dto.auth.AuthResponse;
import org.example.server.dto.auth.ChangePassword;
import org.example.server.dto.auth.VerificationCodeRequestDTO;
import org.example.server.exception.RecordNotFoundException;
import org.example.server.exception.UserNotVerifiedException;
import org.example.server.model.User;
import org.example.server.repository.UserRepository;
import org.example.server.service.JwtService;
import org.example.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/auth")
public class AuthController {

    private final AuthenticationManager manager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager manager, JwtService jwtService, UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder) {
        this.manager = manager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid AuthRequest request){
       return userService.login(request);
    }

    @PutMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody @Valid VerificationCodeRequestDTO verificationCodeRequestDTO){
        userService.verifiUser(verificationCodeRequestDTO);
        return ResponseEntity.ok(new ApiResponse(true, "Usuário verificado com sucesso"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody @Valid ChangePassword changePassword, Authentication authentication){
        String email = authentication.getName();
        userService.changePassword(email, changePassword);
        return ResponseEntity.ok(new ApiResponse(true, "Senha alterada com sucesso"));
    }
}
