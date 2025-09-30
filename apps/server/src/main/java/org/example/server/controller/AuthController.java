package org.example.server.controller;

import jakarta.validation.Valid;
import org.example.server.dto.auth.AuthRequest;
import org.example.server.dto.auth.AuthResponse;
import org.example.server.dto.auth.ChangePassword;
import org.example.server.exception.RecordNotFoundException;
import org.example.server.repository.UserRepository;
import org.example.server.service.JwtService;
import org.example.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/auth")
public class AuthController {

    private final AuthenticationManager manager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(AuthenticationManager manager, JwtService jwtService, UserRepository userRepository, UserService userService) {
        this.manager = manager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest request){
       manager.authenticate(
               new UsernamePasswordAuthenticationToken(request.email(), request.password())
       );
       var user = userRepository.findByEmail(request.email())
               .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado"));

       var jwt = jwtService.generateToken(user);
       return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody @Valid ChangePassword changePassword, Authentication authentication){
        String email = authentication.getName();
        userService.changePassword(email, changePassword);
        return ResponseEntity.ok().body(Map.of("message", "Senha alterada com sucesso"));
    }
}
