package org.example.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.example.server.dto.Api_Response;
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
    @Operation(
            summary = "Login do Lojista",
            description = "Realiza a autenticação de um lojista no sistema, retornando o token de acesso em caso de sucesso.",
            tags = "Auth"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Login realizado com sucesso. Token de autenticação retornado."),
            @ApiResponse(responseCode = "400", description = "Requisição inválida. Verifique os dados informados."),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public AuthResponseDTO login(@RequestBody @Valid AuthRequest request){
       return userService.login(request);
    }

    @PutMapping("/verify-code")
    @Operation(
            summary = "Verificar código de autenticação do usuário",
            description = "Valida o código de verificação enviado por e-mail ao usuário para concluir o processo de login e ativar o acesso ao sistema.",
            tags = "Auth"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Código verificado com sucesso. usuário autenticado."),
            @ApiResponse(responseCode = "400", description = "Requisição inválida. Verifique os dados informados."),
            @ApiResponse(responseCode = "401", description = "Código inválido ou expirado."),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<Api_Response> verifyCode(@RequestBody @Valid VerificationCodeRequestDTO verificationCodeRequestDTO){
        userService.verifiUser(verificationCodeRequestDTO);
        return ResponseEntity.ok(new Api_Response(true, "Usuário verificado com sucesso"));
    }

    @PutMapping("/change-password")
    @Operation(
            summary = "Alterar senha do usuário",
            description = "Permite que o usuário autenticado altere sua senha informando a senha atual e a nova senha desejada.",
            tags = "Auth"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Senha alterada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Requisição inválida. Verifique os dados informados."),
            @ApiResponse(responseCode = "401", description = "Não autorizado. É necessário estar autenticado para alterar a senha."),
            @ApiResponse(responseCode = "403", description = "Senha atual incorreta."),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<Api_Response> changePassword(@RequestBody @Valid ChangePasswordDTO changePasswordDTO, Authentication authentication){
        String email = authentication.getName();
        userService.changePassword(email, changePasswordDTO);
        return ResponseEntity.ok(new Api_Response(true, "Senha alterada com sucesso"));
    }

    @PostMapping("forgot-password")
    @Operation(
            summary = "Solicitar redefinição de senha do usuário",
            description = "Permite que o usuário solicite a redefinição de senha. Um código de verificação será enviado para o e-mail cadastrado.",
            tags = "Auth"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Código de redefinição enviado com sucesso para o e-mail do usuário."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Requisição inválida. Verifique o e-mail informado."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "E-mail não encontrado."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequestDTO passwordResetRequestDTO){
        userService.requestPasswordReset(passwordResetRequestDTO);
        return ResponseEntity.ok("Código de redefinição enviado para o email");
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Confirmar redefinição de senha do usuário",
            description = "Permite que o usuario redefina a senha utilizando o código enviado por e-mail e informando a nova senha desejada.",
            tags = "Auth"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Senha alterada com sucesso."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Requisição inválida. Verifique os dados informados, incluindo o código de verificação."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Código de verificação inválido ou expirado."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Usuário não encontrado."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetConfirmRequestDTO passwordResetConfirmRequestDTO){
        userService.resetPassword(passwordResetConfirmRequestDTO);
        return ResponseEntity.ok("Senha alterada com sucesso");
    }
}
