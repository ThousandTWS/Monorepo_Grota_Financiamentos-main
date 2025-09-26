package org.example.server.service;

import org.example.server.dto.LogisticMapper;
import org.example.server.dto.LogisticRequestDTO;
import org.example.server.dto.LogisticResponseDTO;
import org.example.server.model.Logistic;
import org.example.server.model.User;
import org.example.server.repository.LogisticRepository;
import org.example.server.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class LogisticService {

    private final LogisticRepository logisticRepository;
    private final UserRepository userRepository;
    private  final LogisticMapper logisticMapper;

    public LogisticService(LogisticRepository logisticRepository, UserRepository userRepository, LogisticMapper logisticMapper) {
        this.logisticRepository = logisticRepository;
        this.userRepository = userRepository;
        this.logisticMapper = logisticMapper;
    }

    public LogisticResponseDTO create(LogisticRequestDTO logisticRequestDTO) {
        Logistic logistic = logisticMapper.toEntity(logisticRequestDTO);

        User user = logistic.getUser();
        userRepository.save(user);

        logistic = logisticRepository.save(logistic);

        return logisticMapper.toDTO(logistic);
    }
}
