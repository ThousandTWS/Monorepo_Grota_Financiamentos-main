package org.example.server.repository;

import org.example.server.model.Operator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OperatorRepository extends JpaRepository<Operator, Long> {
    boolean existsByPhone(String phone);
    List<Operator> findByDealerId(Long dealerId);
}
