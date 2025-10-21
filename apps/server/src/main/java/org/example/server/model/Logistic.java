package org.example.server.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "tb_logistic")
public class Logistic {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    private LocalDate birthData;

    @Column(nullable = false, unique = true, length = 50)
    private String phone;

    @Column(length = 150)
    private String enterprise;

    private String fullNameEnterprise;

    private String cnpj;

    @Embedded
    private Address address;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "logistic", fetch = FetchType.LAZY)
    private List<Vehicle> vehicles;

    public Logistic() {
    }

    public Logistic(String fullName, LocalDate birthData, String phone, String enterprise, String fullNameEnterprise, String cnpj, Address address, User user) {
        this.fullName = fullName;
        this.birthData = birthData;
        this.phone = phone;
        this.enterprise = enterprise;
        this.fullNameEnterprise = fullNameEnterprise;
        this.cnpj = cnpj;
        this.address = address;
        this.user = user;
    }

    public void addVehicle(Vehicle vehicle){
        this.vehicles.add(vehicle);
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

    public LocalDate getBirthData() {
        return birthData;
    }

    public void setBirthData(LocalDate birthData) {
        this.birthData = birthData;
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

    public String getFullNameEnterprise() {
        return fullNameEnterprise;
    }

    public void setFullNameEnterprise(String fullNameEnterprise) {
        this.fullNameEnterprise = fullNameEnterprise;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


}
