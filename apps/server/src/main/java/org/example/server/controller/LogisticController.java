package org.example.server.controller;

import org.example.server.model.Logistic;
import org.example.server.service.LogisticService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/grota-financiamentos/logistics")
public class LogisticController {

    private final LogisticService logisticService;

    public LogisticController(LogisticService logisticService) {
        this.logisticService = logisticService;
    }

    @PostMapping
    public Logistic create(@RequestBody Logistic logistic){
        return logisticService.create(logistic);
    }
}
