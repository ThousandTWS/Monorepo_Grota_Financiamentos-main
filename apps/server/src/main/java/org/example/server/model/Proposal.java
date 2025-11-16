package org.example.server.model;

import jakarta.persistence.*;
import org.example.server.enums.ProposalStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "tb_proposal")
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealer_id")
    private Dealer dealer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @Column(nullable = false, length = 120)
    private String customerName;

    @Column(nullable = false, length = 20)
    private String customerCpf;

    private LocalDate customerBirthDate;

    @Column(length = 140)
    private String customerEmail;

    @Column(length = 30)
    private String customerPhone;

    @Column(length = 5)
    private String cnhCategory;

    private boolean hasCnh;

    @Column(length = 10)
    private String vehiclePlate;

    @Column(length = 40)
    private String fipeCode;

    private BigDecimal fipeValue;

    @Column(length = 80)
    private String vehicleBrand;

    @Column(length = 80)
    private String vehicleModel;

    private Integer vehicleYear;

    private BigDecimal downPaymentValue;

    private BigDecimal financedValue;

    @Enumerated(EnumType.STRING)
    private ProposalStatus status = ProposalStatus.SUBMITTED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Proposal() {
    }

    public Long getId() {
        return id;
    }

    public Dealer getDealer() {
        return dealer;
    }

    public void setDealer(Dealer dealer) {
        this.dealer = dealer;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerCpf() {
        return customerCpf;
    }

    public void setCustomerCpf(String customerCpf) {
        this.customerCpf = customerCpf;
    }

    public LocalDate getCustomerBirthDate() {
        return customerBirthDate;
    }

    public void setCustomerBirthDate(LocalDate customerBirthDate) {
        this.customerBirthDate = customerBirthDate;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCnhCategory() {
        return cnhCategory;
    }

    public void setCnhCategory(String cnhCategory) {
        this.cnhCategory = cnhCategory;
    }

    public boolean isHasCnh() {
        return hasCnh;
    }

    public void setHasCnh(boolean hasCnh) {
        this.hasCnh = hasCnh;
    }

    public String getVehiclePlate() {
        return vehiclePlate;
    }

    public void setVehiclePlate(String vehiclePlate) {
        this.vehiclePlate = vehiclePlate;
    }

    public String getFipeCode() {
        return fipeCode;
    }

    public void setFipeCode(String fipeCode) {
        this.fipeCode = fipeCode;
    }

    public BigDecimal getFipeValue() {
        return fipeValue;
    }

    public void setFipeValue(BigDecimal fipeValue) {
        this.fipeValue = fipeValue;
    }

    public String getVehicleBrand() {
        return vehicleBrand;
    }

    public void setVehicleBrand(String vehicleBrand) {
        this.vehicleBrand = vehicleBrand;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public Integer getVehicleYear() {
        return vehicleYear;
    }

    public void setVehicleYear(Integer vehicleYear) {
        this.vehicleYear = vehicleYear;
    }

    public BigDecimal getDownPaymentValue() {
        return downPaymentValue;
    }

    public void setDownPaymentValue(BigDecimal downPaymentValue) {
        this.downPaymentValue = downPaymentValue;
    }

    public BigDecimal getFinancedValue() {
        return financedValue;
    }

    public void setFinancedValue(BigDecimal financedValue) {
        this.financedValue = financedValue;
    }

    public ProposalStatus getStatus() {
        return status;
    }

    public void setStatus(ProposalStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Proposal proposal = (Proposal) o;
        return Objects.equals(id, proposal.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
