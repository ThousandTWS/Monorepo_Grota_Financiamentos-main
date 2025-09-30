package org.example.server.service;

import org.example.server.dto.auth.ChangePassword;
import org.example.server.exception.InvalidPasswordException;
import org.example.server.exception.RecordNotFoundException;
import org.example.server.model.User;
import org.example.server.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(String email, ChangePassword changePassword){
       var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RecordNotFoundException("Usuário não encontrado"));

       if (!passwordEncoder.matches(changePassword.oldPassword(), user.getPassword())){
           throw new InvalidPasswordException("Senha atual incorreta");
       }

       if (passwordEncoder.matches(changePassword.newPassword(), user.getPassword())){
           throw new InvalidPasswordException("A nova senha não pode ser igual à senha atual");
       }

       user.setPassword(passwordEncoder.encode(changePassword.newPassword()));
       userRepository.save(user);
    }
}
