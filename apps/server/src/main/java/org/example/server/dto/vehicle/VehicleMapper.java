package org.example.server.dto.vehicle;

import org.example.server.dto.logistic.LogisticMapper;
import org.example.server.model.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    private final LogisticMapper logisticMapper;

    public VehicleMapper(LogisticMapper logisticMapper) {
        this.logisticMapper = logisticMapper;
    }

    public VehicleResponseDTO toDTO(Vehicle vehicle){
        if (vehicle == null) return null;

        return new VehicleResponseDTO(
                vehicle.getId(),
                vehicle.getName(),
                vehicle.getColor(),
                vehicle.getPlate(),
                vehicle.getModelYear(),
                vehicle.getKm(),
                vehicle.getCondition().name(),
                vehicle.getTransmission().name(),
                vehicle.getPrice(),
                vehicle.getLogistic().getId()
        );
    }

    public Vehicle toEntity(VehicleRequestDTO dto){
        if (dto == null) return null;

        Vehicle vehicle = new Vehicle(
                dto.name(),
                dto.color(),
                dto.plate(),
                dto.modelYear(),
                dto.km(),
                dto.condition(),
                dto.transmission(),
                dto.price()
        );
        return vehicle;
    }
}
