package org.example.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.server.dto.Api_Response;
import org.example.server.dto.UserResponseDTO;
import org.example.server.dto.auth.*;
import org.example.server.dto.dealer.DealerRegistrationRequestDTO;
import org.example.server.dto.dealer.DealerRegistrationResponseDTO;
import org.example.server.model.User;
import org.example.server.repository.UserRepository;
import org.example.server.service.JwtService;
import org.example.server.service.DealerService;
import org.example.server.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/auth")
@Tag(name = "Auth", description = "Gerenciamento de autenticação")
public class AuthController {

    private final AuthenticationManager manager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final DealerService dealerService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager manager, JwtService jwtService, UserRepository userRepository, UserService userService, DealerService dealerService, PasswordEncoder passwordEncoder) {
        this.manager = manager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userService = userService;
        this.dealerService = dealerService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    @Operation(
            summary = "Cadastrar Lojista",
            description = "Cadastra um Lojista no banco de dados"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Lojista cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<DealerRegistrationResponseDTO> create(@Valid @RequestBody DealerRegistrationRequestDTO dealerRegistrationRequestDTO){
        DealerRegistrationResponseDTO responseDTO = dealerService.create(dealerRegistrationRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PostMapping("/login")
    @Operation(
            summary = "Login do Lojista",
            description = "Realiza a autenticação de um lojista no sistema, retornando o token de acesso em caso de sucesso."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso. Token de autenticação retornado."),
            @ApiResponse(responseCode = "401", description = "Credencias inválidas"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<Api_Response> login(@RequestBody @Valid AuthRequest request){
        String token = userService.login(request);
        ResponseCookie cookie = createAuthCookie(token, false);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new Api_Response(true,"Login realizado com sucesso"));
    }


    @PostMapping("/logout")
    @Operation(
            summary = "Realizar logout",
            description = "Remover o cookie de autenticação"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<Api_Response> logout(){
        ResponseCookie expiredCookie = createAuthCookie("", true);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expiredCookie.toString())
                .body(new Api_Response(true,"Logout realizado com sucesso"));
    }

    @GetMapping("/me")
    @Operation(
            summary = "Obter usuário autenticado",
            description = "Retorna as informações do usuário atualmente autenticado "
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lojista autenticado retornado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não Autorizado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<?> getAuthenticatedUser(@AuthenticationPrincipal User user){
        if (user == null){
            return ResponseEntity.status(401).build();
        }

        UserResponseDTO userResponseDTO = new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getDealer().getFullName()
        );
        return ResponseEntity.ok(userResponseDTO);
    }

    @PutMapping("/verify-code")
    @Operation(
            summary = "Verificar código de autenticação do usuário",
            description = "Valida o código de verificação enviado por e-mail ao usuário para concluir o processo de login e ativar o acesso ao sistema."
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
            description = "Permite que o usuário autenticado altere sua senha informando a senha atual e a nova senha desejada."
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
            description = "Permite que o usuário solicite a redefinição de senha. Um código de verificação será enviado para o e-mail cadastrado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Código de redefinição enviado com sucesso para o e-mail do usuário."),
            @ApiResponse(responseCode = "400", description = "Requisição inválida. Verifique o e-mail informado."),
            @ApiResponse(responseCode = "404", description = "E-mail não encontrado."),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<Api_Response> resetPassword(@Valid @RequestBody PasswordResetRequestDTO passwordResetRequestDTO){
        userService.requestPasswordReset(passwordResetRequestDTO);
        return ResponseEntity.ok(new Api_Response(true,"Código de redefinição enviado para o email"));
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Confirmar redefinição de senha do usuário",
            description = "Permite que o usuario redefina a senha utilizando o código enviado por e-mail e informando a nova senha desejada."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Senha alterada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Requisição inválida. Verifique os dados informados, incluindo o código de verificação."),
            @ApiResponse(responseCode = "401", description = "Código de verificação inválido ou expirado."),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado."),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor. Tente novamente mais tarde.")
    })
    public ResponseEntity<Api_Response> resetPassword(@Valid @RequestBody PasswordResetConfirmRequestDTO passwordResetConfirmRequestDTO){
        userService.resetPassword(passwordResetConfirmRequestDTO);
        return ResponseEntity.ok(new Api_Response(true, "Senha alterada com sucesso"));
    }

    private ResponseCookie createAuthCookie(String token, boolean expire){
        return ResponseCookie.from("access_token", expire ? "" : token)
                .httpOnly(true)
                .secure(false) // ajustar via application.yml em produção
                .sameSite("Lax")
                .domain(null)
                .path("/")
                .maxAge(expire ? Duration.ZERO : Duration.ofHours(1))
                .build();
    }
}
