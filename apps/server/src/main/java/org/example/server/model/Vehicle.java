package org.example.server.model;

import jakarta.persistence.*;
import org.example.server.enums.VehicleCondition;
import org.example.server.enums.VehicleStatus;
import org.example.server.enums.VehicleTransmission;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "tb_vehicle")
public class Vehicle {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String color;
    private String plate;
    private LocalDate modelYear;
    private Integer km;

    @Enumerated(EnumType.STRING)
    private VehicleCondition vehicleCondition;

    @Enumerated(EnumType.STRING)
    private VehicleTransmission vehicleTransmission;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    private Dealer dealer;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Vehicle() {
    }

    public Vehicle(String name, String color, String plate, LocalDate modelYear, Integer km, VehicleCondition vehicleCondition, VehicleTransmission vehicleTransmission, BigDecimal price) {
        this.name = name;
        this.color = color;
        this.plate = plate;
        this.modelYear = modelYear;
        this.km = km;
        this.vehicleCondition = vehicleCondition;
        this.vehicleTransmission = vehicleTransmission;
        this.price = price;
        this.status = VehicleStatus.DISPONIVEL;
    }

    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public LocalDate getModelYear() {
        return modelYear;
    }

    public void setModelYear(LocalDate modelYear) {
        this.modelYear = modelYear;
    }

    public Integer getKm() {
        return km;
    }

    public void setKm(Integer km) {
        this.km = km;
    }

    public VehicleCondition getCondition() {
        return vehicleCondition;
    }

    public void setCondition(VehicleCondition vehicleCondition) {
        this.vehicleCondition = vehicleCondition;
    }

    public VehicleTransmission getTransmission() {
        return vehicleTransmission;
    }

    public void setTransmission(VehicleTransmission vehicleTransmission) {
        this.vehicleTransmission = vehicleTransmission;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }

    public Dealer getDealer() {
        return dealer;
    }

    public void setDealer(Dealer dealer) {
        this.dealer = dealer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Vehicle)) return false;
        Vehicle vehicle = (Vehicle) o;
        return Objects.equals(id, vehicle.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
