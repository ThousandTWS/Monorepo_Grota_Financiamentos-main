package org.example.server.repository;

import org.example.server.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    boolean existsByPhone(String phone);
    List<Seller> findByDealerId(Long dealerId);
}
