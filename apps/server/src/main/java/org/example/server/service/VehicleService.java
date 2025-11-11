package org.example.server.service;

import org.example.server.dto.vehicle.VehicleMapper;
import org.example.server.dto.vehicle.VehicleRequestDTO;
import org.example.server.dto.vehicle.VehicleResponseDTO;
import org.example.server.enums.VehicleStatus;
import org.example.server.exception.auth.AccessDeniedException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Dealer;
import org.example.server.model.User;
import org.example.server.model.Vehicle;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.VehicleRepository;
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

    public VehicleResponseDTO create(User user, VehicleRequestDTO vehicleRequestDTO){
        Dealer dealer = dealerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RecordNotFoundException(user.getId()));

        Vehicle vehicle = vehicleMapper.toEntity(vehicleRequestDTO);
        vehicle.setDealer(dealer);
        dealer.addVehicle(vehicle);

        return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
    }

    public List<VehicleResponseDTO> findAll() {
        return vehicleRepository.findAll().stream()
                .map(vehicle -> vehicleMapper.toDTO(vehicle))
                .collect(Collectors.toList());
    }

    public VehicleResponseDTO findById(Long id) {
        return vehicleMapper.toDTO(findVehicleById(id));
    }

    public VehicleResponseDTO update(User user, Long vehicleId, VehicleRequestDTO vehicleRequestDTO) {
        Vehicle vehicleUpdate = findVehicleById(vehicleId);

        if (!vehicleUpdate.getDealer().getUser().getId().equals(user.getId())){
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

    public List<VehicleResponseDTO> getVehicleByDealer(Long id) {
        return vehicleRepository.findByDealerId(id).stream()
                .map(vehicle -> vehicleMapper.toDTO(vehicle))
                .collect(Collectors.toList());
    }

    public VehicleResponseDTO updateStatus(User user, Long id, VehicleStatus status) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        if (!vehicle.getDealer().getUser().getId().equals(user.getId())){
            throw new AccessDeniedException("Você não tem permissão para alterar este veículo");
        }

        vehicle.setStatus(status);
        return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
    }

    private Vehicle findVehicleById(Long vehicleId){
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RecordNotFoundException(vehicleId));
    }
}
