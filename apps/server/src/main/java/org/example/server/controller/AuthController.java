package org.example.server.controller;

import jakarta.validation.Valid;
import org.example.server.dto.auth.AuthRequest;
import org.example.server.dto.auth.AuthResponse;
import org.example.server.exception.RecordNotFoundException;
import org.example.server.repository.UserRepository;
import org.example.server.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/grota-financiamentos/auth")
public class AuthController {

    private final AuthenticationManager manager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager manager, JwtService jwtService, UserRepository userRepository) {
        this.manager = manager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
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
}
