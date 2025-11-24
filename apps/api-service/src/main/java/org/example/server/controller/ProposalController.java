package org.example.server.controller;

import jakarta.validation.Valid;
import org.example.server.dto.proposal.ProposalRequestDTO;
import org.example.server.dto.proposal.ProposalResponseDTO;
import org.example.server.dto.proposal.ProposalStatusUpdateDTO;
import org.example.server.enums.ProposalStatus;
import org.example.server.service.ProposalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/proposals")
public class ProposalController {

    private final ProposalService proposalService;

    public ProposalController(ProposalService proposalService) {
        this.proposalService = proposalService;
    }

    @PostMapping
    public ResponseEntity<ProposalResponseDTO> create(@Valid @RequestBody ProposalRequestDTO dto) {
        return ResponseEntity.ok(proposalService.createProposal(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProposalResponseDTO>> list(
            @RequestParam(name = "dealerId", required = false) Long dealerId,
            @RequestParam(name = "status", required = false) ProposalStatus status
    ) {
        return ResponseEntity.ok(proposalService.listProposals(Optional.ofNullable(dealerId), Optional.ofNullable(status)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProposalResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ProposalStatusUpdateDTO dto
    ) {
        return ResponseEntity.ok(proposalService.updateStatus(id, dto));
    }
}
