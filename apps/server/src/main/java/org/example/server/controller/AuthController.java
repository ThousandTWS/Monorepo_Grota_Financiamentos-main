package org.example.server.controller;

import jakarta.validation.Valid;
import org.example.server.dto.ApiResponse;
import org.example.server.dto.auth.*;
import org.example.server.repository.UserRepository;
import org.example.server.service.JwtService;
import org.example.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    public AuthResponseDTO login(@RequestBody @Valid AuthRequest request){
       return userService.login(request);
    }

    @PutMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody @Valid VerificationCodeRequestDTO verificationCodeRequestDTO){
        userService.verifiUser(verificationCodeRequestDTO);
        return ResponseEntity.ok(new ApiResponse(true, "Usuário verificado com sucesso"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody @Valid ChangePasswordDTO changePasswordDTO, Authentication authentication){
        String email = authentication.getName();
        userService.changePassword(email, changePasswordDTO);
        return ResponseEntity.ok(new ApiResponse(true, "Senha alterada com sucesso"));
    }

    @PostMapping("forgot-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequestDTO passwordResetRequestDTO){
        userService.requestPasswordReset(passwordResetRequestDTO);
        return ResponseEntity.ok("Código de redefinição enviado para o email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetConfirmRequestDTO passwordResetConfirmRequestDTO){
        userService.resetPassword(passwordResetConfirmRequestDTO);
        return ResponseEntity.ok("Senha alterada com sucesso");
    }
}
