package org.example.server.dto.vehicle;

import org.example.server.dto.dealer.DealerRegistrationMapper;
import org.example.server.model.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    @SuppressWarnings("unused")
    private final DealerRegistrationMapper dealerRegistrationMapper;

    public VehicleMapper(DealerRegistrationMapper dealerRegistrationMapper) {
        this.dealerRegistrationMapper = dealerRegistrationMapper;
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
                vehicle.getStatus(),
                vehicle.getDealer() != null ? vehicle.getDealer().getId() : null
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
                dto.vehicleCondition(),
                dto.vehicleTransmission(),
                dto.price()
        );
        return vehicle;
    }
}
