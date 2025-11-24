package org.example.server.repository;

import org.example.server.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    boolean existsByPhone(String phone);
}
