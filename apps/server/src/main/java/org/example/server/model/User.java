package org.example.server.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Objects;

@Entity
@Table(name = "tb_user")
public class User implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    private boolean verified;

    private String verificationCode; // Para ativação da conta
    private LocalDateTime codeExpiration; // Expiração da ativação

    private String resetCode; // Para reset de senha
    private LocalDateTime resetCodeExpiration; // Expiração de reset

    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Logistic logistic;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public User() {
    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
        this.verified = false;
    }

    public void markAsVerified(){
        this.verified = true;
        clearVerificationCode();
    }

    public void generateVerificationCode(String code, Duration validity){
        this.verificationCode = code;
        this.codeExpiration = LocalDateTime.now().plus(validity);
        this.verified = false;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isVerified() {
        return verified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public LocalDateTime getCodeExpiration() {
        return codeExpiration;
    }

    public String getResetCode() {
        return resetCode;
    }

    public LocalDateTime getResetCodeExpiration() {
        return resetCodeExpiration;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Logistic getLogistic() {
        return logistic;
    }

    public void setLogistic(Logistic logistic) {
        this.logistic = logistic;
    }



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
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
