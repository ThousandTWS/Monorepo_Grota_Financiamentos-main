package org.example.server.model;

import org.example.server.enums.Transmission;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Vehicle {
    private String name;
    private String color;
    private String plat;
    private LocalDate yar;
    private Integer km;
    private String condition;
    private Transmission transmission;
    private BigDecimal price;
}
