package org.example.server.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import org.example.server.enums.UserRole;
import org.example.server.enums.UserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "tb_user")
public class User implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus verified;

    private String verificationCode; // Para ativação da conta
    private LocalDateTime codeExpiration; // Expiração da ativação

    private String resetCode; // Para reset de senha
    private LocalDateTime resetCodeExpiration; // Expiração de reset

    @Column(updatable = false, nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Dealer dealer;

    public User(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities) {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public User() {
    }
    public User(String email, String password) {
        this.email = email;
        this.password = password;
        this.verified = UserStatus.PENDENTE;
    }

    public void markAsVerified(){
        this.verified = UserStatus.ATIVO;
        clearVerificationCode();
    }

    public void generateVerificationCode(String code, Duration validity){
        this.verificationCode = code;
        this.codeExpiration = LocalDateTime.now().plus(validity);
        this.verified = UserStatus.PENDENTE;
    }

    public boolean isVerificationCodeValid(String code){
        return  this.verificationCode != null &&
                this.verificationCode.equalsIgnoreCase(code) &&
                this.codeExpiration != null &&
                LocalDateTime.now().isBefore(this.codeExpiration);
    }

    public void clearVerificationCode() {
        this.verificationCode = null;
        this.codeExpiration = null;
    }

    public void generateResetCode(String code, Duration validity){
        this.resetCode = code;
        this.resetCodeExpiration = LocalDateTime.now().plus(validity);
    }

    public boolean isResetCodeValid(String code){
        return  this.resetCode != null &&
                this.resetCode.equalsIgnoreCase(code) &&
                this.resetCodeExpiration != null &&
                LocalDateTime.now().isBefore(this.resetCodeExpiration);
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserStatus getVerificationStatus() {
        return verified;
    }

    public UserStatus getVerified() {
        return verified;
    }

    public void setVerified(UserStatus verified) {
        this.verified = verified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Dealer getDealer() {
        return dealer;
    }

    public void setDealer(Dealer dealer) {
        this.dealer = dealer;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(this.role);
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
