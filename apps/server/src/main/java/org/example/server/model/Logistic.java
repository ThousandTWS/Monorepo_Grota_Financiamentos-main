package org.example.server.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "tb_logistic")
public class Logistic {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 50)
    private String phone;

    @Column(length = 150)
    private String enterprise;

    public Logistic() {
    }

    public Logistic(Long id, String fullName, String phone, String enterprise) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.enterprise = enterprise;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(String enterprise) {
        this.enterprise = enterprise;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (object == null || getClass() != object.getClass()) return false;
        Logistic logistic = (Logistic) object;
        return Objects.equals(id, logistic.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
