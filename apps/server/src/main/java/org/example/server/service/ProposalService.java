package org.example.server.service;

import org.example.server.dto.proposal.ProposalRequestDTO;
import org.example.server.dto.proposal.ProposalResponseDTO;
import org.example.server.dto.proposal.ProposalStatusUpdateDTO;
import org.example.server.enums.ProposalStatus;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.Dealer;
import org.example.server.model.Proposal;
import org.example.server.model.Seller;
import org.example.server.repository.DealerRepository;
import org.example.server.repository.ProposalRepository;
import org.example.server.repository.SellerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final DealerRepository dealerRepository;
    private final SellerRepository sellerRepository;

    public ProposalService(
            ProposalRepository proposalRepository,
            DealerRepository dealerRepository,
            SellerRepository sellerRepository
    ) {
        this.proposalRepository = proposalRepository;
        this.dealerRepository = dealerRepository;
        this.sellerRepository = sellerRepository;
    }

    @Transactional
    public ProposalResponseDTO createProposal(ProposalRequestDTO dto) {
        Proposal proposal = new Proposal();
        applyRequestData(proposal, dto);
        Proposal saved = proposalRepository.save(proposal);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProposalResponseDTO> listProposals(Optional<Long> dealerId, Optional<ProposalStatus> status) {
        List<Proposal> proposals;
        if (dealerId.isPresent() && status.isPresent()) {
            @SuppressWarnings("null")
            Dealer dealer = dealerRepository.findById(dealerId.get())
                    .orElseThrow(() -> new RecordNotFoundException("Dealer não encontrado"));
            proposals = proposalRepository.findByDealerAndStatus(dealer, status.get());
        } else if (dealerId.isPresent()) {
            @SuppressWarnings("null")
            Dealer dealer = dealerRepository.findById(dealerId.get())
                    .orElseThrow(() -> new RecordNotFoundException("Dealer não encontrado"));
            proposals = proposalRepository.findByDealer(dealer);
        } else if (status.isPresent()) {
            proposals = proposalRepository.findByStatus(status.get());
        } else {
            proposals = proposalRepository.findAll();
        }
        return proposals.stream().map(this::toResponse).toList();
    }

    @SuppressWarnings("null")
    @Transactional
    public ProposalResponseDTO updateStatus(Long id, ProposalStatusUpdateDTO dto) {
        @SuppressWarnings("null")
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Proposta não encontrada"));
        if (dto.status() != null) {
            proposal.setStatus(dto.status());
        }
        if (dto.notes() != null) {
            proposal.setNotes(dto.notes());
        }
        return toResponse(proposalRepository.save(proposal));
    }

    private void applyRequestData(Proposal proposal, ProposalRequestDTO dto) {
        if (dto.dealerId() != null) {
            @SuppressWarnings("null")
            Dealer dealer = dealerRepository.findById(dto.dealerId())
                    .orElseThrow(() -> new RecordNotFoundException("Dealer não encontrado"));
            proposal.setDealer(dealer);
        }
        if (dto.sellerId() != null) {
            @SuppressWarnings("null")
            Seller seller = sellerRepository.findById(dto.sellerId())
                    .orElseThrow(() -> new RecordNotFoundException("Vendedor não encontrado"));
            proposal.setSeller(seller);
        }
        proposal.setCustomerName(dto.customerName());
        proposal.setCustomerCpf(dto.customerCpf());
        proposal.setCustomerBirthDate(dto.customerBirthDate());

        proposal.setCustomerEmail(dto.customerEmail());
        proposal.setCustomerPhone(dto.customerPhone());
        proposal.setCnhCategory(dto.cnhCategory());
        proposal.setHasCnh(dto.hasCnh());
        proposal.setVehiclePlate(dto.vehiclePlate());
        proposal.setFipeCode(dto.fipeCode());
        proposal.setFipeValue(dto.fipeValue());
        proposal.setVehicleBrand(dto.vehicleBrand());
        proposal.setVehicleModel(dto.vehicleModel());
        proposal.setVehicleYear(dto.vehicleYear());
        proposal.setDownPaymentValue(dto.downPaymentValue());
        proposal.setFinancedValue(dto.financedValue());
        proposal.setNotes(dto.notes());
    }

    private ProposalResponseDTO toResponse(Proposal proposal) {
        return new ProposalResponseDTO(
                proposal.getId(),
                proposal.getDealer() != null ? proposal.getDealer().getId() : null,
                proposal.getSeller() != null ? proposal.getSeller().getId() : null,
                proposal.getCustomerName(),
                proposal.getCustomerCpf(),
                proposal.getCustomerBirthDate(),
                proposal.getCustomerEmail(),
                proposal.getCustomerPhone(),
                proposal.getCnhCategory(),
                proposal.isHasCnh(),
                proposal.getVehiclePlate(),
                proposal.getFipeCode(),
                proposal.getFipeValue(),
                proposal.getVehicleBrand(),
                proposal.getVehicleModel(),
                proposal.getVehicleYear(),
                proposal.getDownPaymentValue(),
                proposal.getFinancedValue(),
                proposal.getStatus(),
                proposal.getNotes(),
                proposal.getCreatedAt(),
                proposal.getUpdatedAt()
        );
    }
}
