package org.example.server.repository;

import org.example.server.model.Manager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ManagerRepository extends JpaRepository<Manager, Long> {
    boolean existsByPhone(String phone);
    List<Manager> findByDealerId(Long dealerId);
    Page<Manager> findByDealerId(Long dealerId, Pageable pageable);
}
