package org.example.server.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.server.dto.LogisticMapper;
import org.example.server.dto.LogisticRequestDTO;
import org.example.server.dto.LogisticResponseDTO;
import org.example.server.exception.RecordNotFoundException;
import org.example.server.model.Logistic;
import org.example.server.model.User;
import org.example.server.repository.LogisticRepository;
import org.example.server.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

        return logisticMapper.toDTO(logisticRepository.save(logistic));
    }

    public List<LogisticResponseDTO> findAll() {
        List<Logistic> logisticList = logisticRepository.findAll();
        return logisticList.stream().map(logistic -> logisticMapper.toDTO(logistic)).collect(Collectors.toList());
    }

    public LogisticResponseDTO findById(Long id) {
      return logisticMapper.toDTO(logisticRepository.findById(id)
              .orElseThrow(() -> new RecordNotFoundException(id)));
    }

    @Transactional
    public LogisticResponseDTO update(Long id, LogisticRequestDTO logisticRequestDTO) {
        Logistic logistic = logisticRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        User user =  logistic.getUser();
        if (user == null){
            throw new EntityNotFoundException("Usuário vinculado à logística não encontrado");
        }

        logistic.setFullName(logisticRequestDTO.fullName());
        logistic.setPhone(logisticRequestDTO.phone());
        logistic.setEnterprise(logisticRequestDTO.enterprise());

        user.setEmail(logisticRequestDTO.email());
        user.setPassword(logisticRequestDTO.password());

        userRepository.save(user);
        logisticRepository.save(logistic);

        return logisticMapper.toDTO(logistic);
    }
}
