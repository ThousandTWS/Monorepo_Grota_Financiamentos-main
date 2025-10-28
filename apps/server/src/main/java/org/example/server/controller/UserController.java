package org.example.server.controller;

import org.example.server.dto.user.UserRequestDTO;
import org.example.server.dto.user.UserResponseDTO;
import org.example.server.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/grota-financiamentos/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> create(@RequestBody UserRequestDTO userRequestDTO){
        UserResponseDTO userResponseDTO =  userService.create(userRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDTO);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> findAll(){
        List<UserResponseDTO> userResponseDTOs = userService.findAll();
        return ResponseEntity.ok(userResponseDTOs);
    }
}
