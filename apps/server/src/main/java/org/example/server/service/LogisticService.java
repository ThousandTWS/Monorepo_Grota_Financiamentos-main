package org.example.server.service;

import org.example.server.model.Logistic;
import org.example.server.repository.LogisticRepository;
import org.springframework.stereotype.Service;

@Service
public class LogisticService {

    private final LogisticRepository logisticRepository;

    public LogisticService(LogisticRepository logisticRepository) {
        this.logisticRepository = logisticRepository;
    }

    public Logistic create(Logistic logistic) {
        return logisticRepository.save(logistic);
    }
}
