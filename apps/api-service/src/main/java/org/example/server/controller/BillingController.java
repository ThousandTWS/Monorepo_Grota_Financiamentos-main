package org.example.server.controller;

import jakarta.validation.Valid;
import org.example.server.dto.billing.*;
import org.example.server.enums.BillingStatus;
import org.example.server.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/grota-financiamentos/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @PostMapping("/contracts")
    public ResponseEntity<BillingContractDetailsDTO> createContract(
            @Valid @RequestBody BillingContractCreateDTO dto
    ) {
        return ResponseEntity.ok(billingService.createContract(dto));
    }

    @GetMapping("/contracts")
    public ResponseEntity<List<BillingContractSummaryDTO>> listContracts(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "document", required = false) String document,
            @RequestParam(name = "contractNumber", required = false) String contractNumber,
            @RequestParam(name = "status", required = false) BillingStatus status
    ) {
        return ResponseEntity.ok(
                billingService.listContracts(
                        Optional.ofNullable(name),
                        Optional.ofNullable(document),
                        Optional.ofNullable(contractNumber),
                        Optional.ofNullable(status)
                )
        );
    }

    // Rotas aninhadas devem vir ANTES da rota genérica para garantir matching correto
    @PatchMapping("/contracts/{contractNumber:.+}/installments/{installmentNumber}/due-date")
    public ResponseEntity<BillingInstallmentDTO> updateInstallmentDueDate(
            @PathVariable String contractNumber,
            @PathVariable Integer installmentNumber,
            @Valid @RequestBody BillingInstallmentDueDateUpdateDTO dto
    ) {
        return ResponseEntity.ok(
                billingService.updateInstallmentDueDate(contractNumber, installmentNumber, dto)
        );
    }

    @PatchMapping("/contracts/{contractNumber:.+}/installments/{installmentNumber}")
    public ResponseEntity<BillingInstallmentDTO> updateInstallment(
            @PathVariable String contractNumber,
            @PathVariable Integer installmentNumber,
            @Valid @RequestBody BillingInstallmentUpdateDTO dto
    ) {
        return ResponseEntity.ok(
                billingService.updateInstallment(contractNumber, installmentNumber, dto)
        );
    }

    @PatchMapping("/contracts/{contractNumber:.+}/contract-number")
    public ResponseEntity<BillingContractDetailsDTO> updateContractNumber(
            @PathVariable String contractNumber,
            @Valid @RequestBody BillingContractNumberUpdateDTO dto
    ) {
        return ResponseEntity.ok(billingService.updateContractNumber(contractNumber, dto));
    }

    @PatchMapping("/contracts/{contractNumber:.+}/vehicle")
    public ResponseEntity<BillingContractDetailsDTO> updateVehicle(
            @PathVariable String contractNumber,
            @Valid @RequestBody BillingVehicleUpdateDTO dto
    ) {
        return ResponseEntity.ok(billingService.updateVehicle(contractNumber, dto));
    }

    @PostMapping("/contracts/{contractNumber:.+}/occurrences")
    public ResponseEntity<BillingOccurrenceDTO> createOccurrence(
            @PathVariable String contractNumber,
            @Valid @RequestBody BillingOccurrenceRequestDTO dto
    ) {
        return ResponseEntity.ok(billingService.addOccurrence(contractNumber, dto));
    }

    // Rotas genéricas vêm por último
    // Usa regex .+ em vez de .* para garantir que capture pelo menos um caractere
    @GetMapping("/contracts/{contractNumber:.+}")
    public ResponseEntity<BillingContractDetailsDTO> getContract(@PathVariable String contractNumber) {
        // O Spring Boot já decodifica automaticamente path variables
        // Se vier codificado, decodifica explicitamente
        String decodedContractNumber = contractNumber;
        try {
            // Tenta decodificar caso tenha sido duplamente codificado
            if (contractNumber.contains("%")) {
                decodedContractNumber = java.net.URLDecoder.decode(contractNumber, java.nio.charset.StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            // Se falhar, usa o original
            decodedContractNumber = contractNumber;
        }
        return ResponseEntity.ok(billingService.getContractDetails(decodedContractNumber));
    }

    @PatchMapping("/contracts/{contractNumber:.+}")
    public ResponseEntity<BillingContractDetailsDTO> updateContract(
            @PathVariable String contractNumber,
            @Valid @RequestBody BillingContractUpdateDTO dto
    ) {
        return ResponseEntity.ok(billingService.updateContract(contractNumber, dto));
    }

    @DeleteMapping("/contracts/{contractNumber:.+}")
    public ResponseEntity<Void> deleteContract(@PathVariable String contractNumber) {
        billingService.deleteContract(contractNumber);
        return ResponseEntity.noContent().build();
    }
}
