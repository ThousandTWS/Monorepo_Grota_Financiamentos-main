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

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Logistic() {
    }

    public Logistic(String fullName, String phone, String enterprise, User user) {
        this.fullName = fullName;
        this.phone = phone;
        this.enterprise = enterprise;
        this.user = user;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
