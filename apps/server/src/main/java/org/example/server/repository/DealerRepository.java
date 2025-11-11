package org.example.server.repository;

import org.example.server.model.Dealer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DealerRepository extends JpaRepository<Dealer, Long> {
    boolean existsByPhone(String phone);

    Optional<Dealer> findByUserId(Long id);
}
