package org.example.server.service;

import org.example.server.dto.vehicle.VehicleMapper;
import org.example.server.dto.vehicle.VehicleRequestDTO;
import org.example.server.dto.vehicle.VehicleResponseDTO;
import org.example.server.exception.RecordNotFoundException;
import org.example.server.model.Logistic;
import org.example.server.model.Vehicle;
import org.example.server.repository.LogisticRepository;
import org.example.server.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final LogisticRepository logisticRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleService(VehicleRepository vehicleRepository, LogisticRepository logisticRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.logisticRepository = logisticRepository;
        this.vehicleMapper = vehicleMapper;
    }

    public VehicleResponseDTO create(VehicleRequestDTO vehicleRequestDTO){
        Logistic logistic = logisticRepository.findById(vehicleRequestDTO.logisticId())
                .orElseThrow(() -> new RecordNotFoundException("Logista não encontrado com o id: " + vehicleRequestDTO.logisticId()));

        Vehicle vehicle = vehicleMapper.toEntity(vehicleRequestDTO);

        vehicle.setLogistic(logistic);
        logistic.addVehicle(vehicle);

       return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
    }

    public List<VehicleResponseDTO> findAll() {
       return vehicleRepository.findAll().stream()
               .map(vehicle -> vehicleMapper.toDTO(vehicle)).collect(Collectors.toList());
    }

    public VehicleResponseDTO findById(Long vehicleId) {
        return vehicleMapper.toDTO(findVehicleById(vehicleId));
    }

    public VehicleResponseDTO update(Long vehicleId, VehicleRequestDTO vehicleRequestDTO) {

        Vehicle vehicleUpdate = findVehicleById(vehicleId);

        vehicleUpdate.setName(vehicleRequestDTO.name());
        vehicleUpdate.setColor(vehicleRequestDTO.color());
        vehicleUpdate.setKm(vehicleRequestDTO.km());
        vehicleUpdate.setPlate(vehicleRequestDTO.plate());
        vehicleUpdate.setModelYear(vehicleRequestDTO.modelYear());
        vehicleUpdate.setPrice(vehicleRequestDTO.price());
        vehicleUpdate.setCondition(vehicleRequestDTO.condition());
        vehicleUpdate.setTransmission(vehicleRequestDTO.transmission());

        return vehicleMapper.toDTO(vehicleRepository.save(vehicleUpdate));
    }

    private Vehicle findVehicleById(Long vehicleId){
       Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RecordNotFoundException("Veiculo não encontrado com o id: " + vehicleId));
       return vehicle;
    }

    public List<VehicleResponseDTO> getVehicleByLogistic(Long id) {
       List<Vehicle> vehicles = vehicleRepository.findByLogisticId(id);

      return vehicles.stream()
              .map(vehicle -> vehicleMapper.toDTO(vehicle))
              .collect(Collectors.toList());
    }
}
