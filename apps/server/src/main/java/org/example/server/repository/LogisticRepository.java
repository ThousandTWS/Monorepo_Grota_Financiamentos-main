package org.example.server.repository;

import org.example.server.model.Logistic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogisticRepository extends JpaRepository<Logistic, Long> {
}
