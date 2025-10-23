package org.example.server.service;

import org.example.server.dto.vehicle.VehicleMapper;
import org.example.server.dto.vehicle.VehicleRequestDTO;
import org.example.server.dto.vehicle.VehicleResponseDTO;
import org.example.server.exception.RecordNotFoundException;
import org.example.server.model.Dealer;
import org.example.server.model.Vehicle;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.VehicleRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DealerRepository dealerRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleService(VehicleRepository vehicleRepository, DealerRepository dealerRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.dealerRepository = dealerRepository;
        this.vehicleMapper = vehicleMapper;
    }

    public VehicleResponseDTO create(Long id, VehicleRequestDTO vehicleRequestDTO){
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Lojista não encontrado"));

        Vehicle vehicle = vehicleMapper.toEntity(vehicleRequestDTO);
        vehicle.setDealer(dealer);
        dealer.addVehicle(vehicle);

       return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
    }

    public List<VehicleResponseDTO> findAll() {
       return vehicleRepository.findAll().stream()
               .map(vehicle -> vehicleMapper.toDTO(vehicle)).collect(Collectors.toList());
    }

    public VehicleResponseDTO findById(Long vehicleId) {
        return vehicleMapper.toDTO(findVehicleById(vehicleId));
    }

    public VehicleResponseDTO update(Long userId, Long vehicleId, VehicleRequestDTO vehicleRequestDTO) {
        Vehicle vehicleUpdate = findVehicleById(vehicleId);

        if (!vehicleUpdate.getDealer().getUser().getId().equals(userId)){
            throw new AccessDeniedException("Você não tem permissão para alterar este veículo");
        }

        vehicleUpdate.setName(vehicleRequestDTO.name());
        vehicleUpdate.setColor(vehicleRequestDTO.color());
        vehicleUpdate.setKm(vehicleRequestDTO.km());
        vehicleUpdate.setPlate(vehicleRequestDTO.plate());
        vehicleUpdate.setModelYear(vehicleRequestDTO.modelYear());
        vehicleUpdate.setPrice(vehicleRequestDTO.price());
        vehicleUpdate.setCondition(vehicleRequestDTO.vehicleCondition());
        vehicleUpdate.setTransmission(vehicleRequestDTO.vehicleTransmission());

        return vehicleMapper.toDTO(vehicleRepository.save(vehicleUpdate));
    }

    private Vehicle findVehicleById(Long vehicleId){
       Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RecordNotFoundException("Veiculo não encontrado com o id: " + vehicleId));
       return vehicle;
    }

    public List<VehicleResponseDTO> getVehicleByDealer(Long id) {
       List<Vehicle> vehicles = vehicleRepository.findByDealerId(id);

      return vehicles.stream()
              .map(vehicle -> vehicleMapper.toDTO(vehicle))
              .collect(Collectors.toList());
    }
}
