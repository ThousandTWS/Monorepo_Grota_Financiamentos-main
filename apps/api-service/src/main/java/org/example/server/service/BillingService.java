package org.example.server.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.server.dto.billing.*;
import org.example.server.enums.BillingStatus;
import org.example.server.exception.generic.DataAlreadyExistsException;
import org.example.server.exception.generic.RecordNotFoundException;
import org.example.server.model.BillingContract;
import org.example.server.model.BillingInstallment;
import org.example.server.model.BillingOccurrence;
import org.example.server.model.Proposal;
import org.example.server.repository.BillingContractRepository;
import org.example.server.repository.BillingInstallmentRepository;
import org.example.server.repository.BillingOccurrenceRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BillingService {

    private final BillingContractRepository contractRepository;
    private final BillingInstallmentRepository installmentRepository;
    private final BillingOccurrenceRepository occurrenceRepository;
    private final ObjectMapper objectMapper;

    public BillingService(
            BillingContractRepository contractRepository,
            BillingInstallmentRepository installmentRepository,
            BillingOccurrenceRepository occurrenceRepository,
            ObjectMapper objectMapper
    ) {
        this.contractRepository = contractRepository;
        this.installmentRepository = installmentRepository;
        this.occurrenceRepository = occurrenceRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public BillingContractDetailsDTO createContract(BillingContractCreateDTO dto) {
        if (contractRepository.findByContractNumber(dto.contractNumber()).isPresent()) {
            throw new DataAlreadyExistsException("Contrato ja cadastrado na cobranca");
        }
        BillingContract contract = new BillingContract();
        applyContractData(contract, dto);

        List<BillingInstallment> installments = buildInstallments(contract, dto);
        contract.setInstallments(installments);
        BillingContract saved = contractRepository.save(contract);

        return toDetails(saved, installments, List.of());
    }

    @Transactional
    public BillingContractDetailsDTO createFromPaidProposal(Proposal proposal) {
        if (proposal == null || proposal.getId() == null) {
            throw new RecordNotFoundException("Proposta nao encontrada para cobranca");
        }

        Optional<BillingContract> existing = contractRepository.findByProposalId(proposal.getId());
        if (existing.isPresent()) {
            BillingContract current = existing.get();
            List<BillingInstallment> installments = installmentRepository.findByContractOrderByNumberAsc(current);
            List<BillingOccurrence> occurrences = occurrenceRepository.findByContractOrderByDateDesc(current);
            return toDetails(current, installments, occurrences);
        }

        Map<String, Object> metadata = parseMetadata(proposal.getMetadata());
        String contractNumber = resolveContractNumber(metadata, proposal.getId());

        BillingContract contract = new BillingContract();
        contract.setContractNumber(contractNumber);
        contract.setProposalId(proposal.getId());
        contract.setStatus(BillingStatus.EM_ABERTO);

        LocalDate paidAt = resolveDate(metadata, "paidAt", "paymentDate");
        if (paidAt == null) {
            paidAt = LocalDate.now();
        }
        LocalDate startDate = resolveDate(metadata, "startDate", "dataBase");
        if (startDate == null) {
            startDate = paidAt;
        }
        contract.setPaidAt(paidAt);
        contract.setStartDate(startDate);

        BigDecimal financedValue = proposal.getFinancedValue() != null
                ? proposal.getFinancedValue()
                : BigDecimal.ZERO;
        Integer metadataInstallments = resolveInteger(metadata, "installmentsTotal", "parcelas");
        Integer installmentsTotal = proposal.getTermMonths() != null && proposal.getTermMonths() > 0
                ? proposal.getTermMonths()
                : metadataInstallments != null && metadataInstallments > 0
                    ? metadataInstallments
                    : 1;
        BigDecimal installmentValue = resolveBigDecimal(metadata, "installmentValue", "parcelaValor");
        if (installmentValue == null) {
            if (installmentsTotal != null && installmentsTotal > 0 && financedValue != null) {
                installmentValue = financedValue.divide(
                        BigDecimal.valueOf(installmentsTotal),
                        2,
                        RoundingMode.HALF_UP
                );
            } else {
                installmentValue = BigDecimal.ZERO;
            }
        }

        contract.setFinancedValue(financedValue);
        contract.setInstallmentValue(installmentValue);
        contract.setInstallmentsTotal(installmentsTotal);

        contract.setCustomerName(proposal.getCustomerName());
        contract.setCustomerDocument(proposal.getCustomerCpf());
        contract.setCustomerBirthDate(proposal.getCustomerBirthDate());
        contract.setCustomerEmail(proposal.getCustomerEmail());
        contract.setCustomerPhone(proposal.getCustomerPhone());
        contract.setCustomerAddress(buildAddress(proposal.getAddress(), proposal.getAddressNumber(), proposal.getAddressComplement()));
        contract.setCustomerCity(proposal.getCity());
        contract.setCustomerState(proposal.getUf());

        contract.setVehicleBrand(proposal.getVehicleBrand());
        contract.setVehicleModel(proposal.getVehicleModel());
        contract.setVehicleYear(proposal.getVehicleYear());
        contract.setVehiclePlate(proposal.getVehiclePlate());

        LocalDate firstDueDate = resolveDate(metadata, "firstDueDate", "vencimento");
        if (firstDueDate == null) {
            firstDueDate = startDate.plusMonths(1);
        }

        List<BillingInstallment> installments = buildInstallments(contract, installmentValue, installmentsTotal, firstDueDate);
        contract.setInstallments(installments);
        BillingContract saved = contractRepository.save(contract);

        return toDetails(saved, installments, List.of());
    }

    @Transactional(readOnly = true)
    public List<BillingContractSummaryDTO> listContracts(
            Optional<String> name,
            Optional<String> document,
            Optional<String> contractNumber,
            Optional<BillingStatus> status
    ) {
        String nameFilter = normalizeFilter(name.orElse(null));
        String documentFilter = normalizeFilter(document.orElse(null));
        String contractFilter = normalizeFilter(contractNumber.orElse(null));
        BillingStatus statusFilter = status.orElse(null);

        Specification<BillingContract> spec = (root, query, builder) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (nameFilter != null) {
                String normalized = "%" + nameFilter.toLowerCase() + "%";
                predicates.add(
                        builder.like(
                                builder.lower(root.get("customerName").as(String.class)),
                                normalized
                        )
                );
            }
            if (documentFilter != null) {
                predicates.add(
                        builder.like(
                                root.get("customerDocument").as(String.class),
                                "%" + documentFilter + "%"
                        )
                );
            }
            if (contractFilter != null) {
                predicates.add(
                        builder.like(
                                root.get("contractNumber").as(String.class),
                                "%" + contractFilter + "%"
                        )
                );
            }
            if (statusFilter != null) {
                predicates.add(builder.equal(root.get("status"), statusFilter));
            }
            return predicates.isEmpty()
                    ? builder.conjunction()
                    : builder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        List<BillingContract> contracts = contractRepository.findAll(
                spec,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return contracts.stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public BillingContractDetailsDTO getContractDetails(String contractNumber) {
        BillingContract contract = contractRepository.findByContractNumber(contractNumber)
                .orElseThrow(() -> new RecordNotFoundException("Contrato nao encontrado"));
        List<BillingInstallment> installments = installmentRepository.findByContractOrderByNumberAsc(contract);
        List<BillingOccurrence> occurrences = occurrenceRepository.findByContractOrderByDateDesc(contract);
        return toDetails(contract, installments, occurrences);
    }

    @Transactional
    public BillingInstallmentDTO updateInstallment(
            String contractNumber,
            Integer installmentNumber,
            BillingInstallmentUpdateDTO dto
    ) {
        BillingContract contract = contractRepository.findByContractNumber(contractNumber)
                .orElseThrow(() -> new RecordNotFoundException("Contrato nao encontrado"));
        BillingInstallment installment = installmentRepository.findByContractAndNumber(contract, installmentNumber)
                .orElseThrow(() -> new RecordNotFoundException("Parcela nao encontrada"));

        boolean paid = Boolean.TRUE.equals(dto.paid());
        installment.setPaid(paid);
        if (paid) {
            installment.setPaidAt(dto.paidAt() != null ? dto.paidAt() : LocalDate.now());
        } else {
            installment.setPaidAt(null);
        }
        BillingInstallment saved = installmentRepository.save(installment);
        return toInstallment(saved);
    }

    @Transactional
    public BillingOccurrenceDTO addOccurrence(String contractNumber, BillingOccurrenceRequestDTO dto) {
        BillingContract contract = contractRepository.findByContractNumber(contractNumber)
                .orElseThrow(() -> new RecordNotFoundException("Contrato nao encontrado"));
        BillingOccurrence occurrence = new BillingOccurrence();
        occurrence.setContract(contract);
        occurrence.setDate(dto.date());
        occurrence.setContact(dto.contact());
        occurrence.setNote(dto.note());
        BillingOccurrence saved = occurrenceRepository.save(occurrence);
        return toOccurrence(saved);
    }

    @Transactional
    public void deleteContract(String contractNumber) {
        BillingContract contract = contractRepository.findByContractNumber(contractNumber)
                .orElseThrow(() -> new RecordNotFoundException("Contrato nao encontrado"));
        contractRepository.delete(contract);
    }

    private void applyContractData(BillingContract contract, BillingContractCreateDTO dto) {
        contract.setContractNumber(dto.contractNumber());
        contract.setProposalId(dto.proposalId());
        contract.setStatus(dto.status());
        contract.setPaidAt(dto.paidAt());
        contract.setStartDate(dto.startDate());
        contract.setFinancedValue(dto.financedValue());
        contract.setInstallmentValue(dto.installmentValue());
        contract.setInstallmentsTotal(dto.installmentsTotal());
        contract.setCustomerName(dto.customerName());
        contract.setCustomerDocument(dto.customerDocument());
        contract.setCustomerBirthDate(dto.customerBirthDate());
        contract.setCustomerEmail(dto.customerEmail());
        contract.setCustomerPhone(dto.customerPhone());
        contract.setCustomerAddress(dto.customerAddress());
        contract.setCustomerCity(dto.customerCity());
        contract.setCustomerState(dto.customerState());
        contract.setVehicleBrand(dto.vehicleBrand());
        contract.setVehicleModel(dto.vehicleModel());
        contract.setVehicleYear(dto.vehicleYear());
        contract.setVehiclePlate(dto.vehiclePlate());
    }

    private List<BillingInstallment> buildInstallments(BillingContract contract, BillingContractCreateDTO dto) {
        if (dto.installments() != null && !dto.installments().isEmpty()) {
            List<BillingInstallment> custom = new ArrayList<>();
            for (BillingInstallmentInputDTO installment : dto.installments()) {
                BillingInstallment entity = new BillingInstallment();
                entity.setContract(contract);
                entity.setNumber(installment.number());
                entity.setDueDate(installment.dueDate());
                entity.setAmount(installment.amount());
                entity.setPaid(Boolean.TRUE.equals(installment.paid()));
                entity.setPaidAt(installment.paidAt());
                custom.add(entity);
            }
            return custom;
        }

        List<BillingInstallment> generated = new ArrayList<>();
        LocalDate firstDueDate = dto.firstDueDate() != null
                ? dto.firstDueDate()
                : dto.startDate().plusMonths(1);
        for (int i = 0; i < dto.installmentsTotal(); i++) {
            BillingInstallment installment = new BillingInstallment();
            installment.setContract(contract);
            installment.setNumber(i + 1);
            installment.setDueDate(firstDueDate.plusMonths(i));
            installment.setAmount(dto.installmentValue());
            installment.setPaid(false);
            generated.add(installment);
        }
        return generated;
    }

    private List<BillingInstallment> buildInstallments(
            BillingContract contract,
            BigDecimal installmentValue,
            Integer installmentsTotal,
            LocalDate firstDueDate
    ) {
        int total = installmentsTotal != null && installmentsTotal > 0 ? installmentsTotal : 1;
        List<BillingInstallment> generated = new ArrayList<>();
        for (int i = 0; i < total; i++) {
            BillingInstallment installment = new BillingInstallment();
            installment.setContract(contract);
            installment.setNumber(i + 1);
            installment.setDueDate(firstDueDate.plusMonths(i));
            installment.setAmount(installmentValue);
            installment.setPaid(false);
            generated.add(installment);
        }
        return generated;
    }

    private BillingContractSummaryDTO toSummary(BillingContract contract) {
        return new BillingContractSummaryDTO(
                contract.getContractNumber(),
                contract.getStatus(),
                contract.getPaidAt(),
                contract.getStartDate(),
                contract.getInstallmentValue(),
                contract.getInstallmentsTotal(),
                toCustomer(contract),
                contract.getCreatedAt()
        );
    }

    private BillingContractDetailsDTO toDetails(
            BillingContract contract,
            List<BillingInstallment> installments,
            List<BillingOccurrence> occurrences
    ) {
        List<BillingContractSummaryDTO> otherContracts = contractRepository
                .findByCustomerDocumentAndContractNumberNot(contract.getCustomerDocument(), contract.getContractNumber())
                .stream()
                .map(this::toSummary)
                .toList();

        return new BillingContractDetailsDTO(
                contract.getContractNumber(),
                contract.getProposalId(),
                contract.getStatus(),
                contract.getPaidAt(),
                contract.getStartDate(),
                contract.getFinancedValue(),
                contract.getInstallmentValue(),
                contract.getInstallmentsTotal(),
                toCustomer(contract),
                toVehicle(contract),
                installments.stream().map(this::toInstallment).toList(),
                occurrences.stream().map(this::toOccurrence).toList(),
                otherContracts,
                contract.getCreatedAt(),
                contract.getUpdatedAt()
        );
    }

    private BillingCustomerDTO toCustomer(BillingContract contract) {
        return new BillingCustomerDTO(
                contract.getCustomerName(),
                contract.getCustomerDocument(),
                contract.getCustomerBirthDate(),
                contract.getCustomerEmail(),
                contract.getCustomerPhone(),
                contract.getCustomerAddress(),
                contract.getCustomerCity(),
                contract.getCustomerState()
        );
    }

    private BillingVehicleDTO toVehicle(BillingContract contract) {
        return new BillingVehicleDTO(
                contract.getVehicleBrand(),
                contract.getVehicleModel(),
                contract.getVehicleYear(),
                contract.getVehiclePlate()
        );
    }

    private BillingInstallmentDTO toInstallment(BillingInstallment installment) {
        return new BillingInstallmentDTO(
                installment.getNumber(),
                installment.getDueDate(),
                installment.getAmount(),
                installment.isPaid(),
                installment.getPaidAt()
        );
    }

    private BillingOccurrenceDTO toOccurrence(BillingOccurrence occurrence) {
        return new BillingOccurrenceDTO(
                occurrence.getId(),
                occurrence.getDate(),
                occurrence.getContact(),
                occurrence.getNote(),
                occurrence.getCreatedAt()
        );
    }

    private String normalizeFilter(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private Map<String, Object> parseMetadata(String metadata) {
        if (metadata == null || metadata.isBlank()) {
            return Collections.emptyMap();
        }
        try {
            return objectMapper.readValue(metadata, new TypeReference<Map<String, Object>>() {});
        } catch (Exception ignored) {
            return Collections.emptyMap();
        }
    }

    private String resolveContractNumber(Map<String, Object> metadata, Long proposalId) {
        String fromMetadata = resolveString(metadata, "contractNumber", "numeroContrato", "operacao");
        if (fromMetadata != null && !fromMetadata.isBlank()) {
            return fromMetadata;
        }
        return "PROP-" + proposalId;
    }

    private String resolveString(Map<String, Object> metadata, String... keys) {
        for (String key : keys) {
            Object value = metadata.get(key);
            if (value != null) {
                String str = String.valueOf(value).trim();
                if (!str.isEmpty()) {
                    return str;
                }
            }
        }
        return null;
    }

    private BigDecimal resolveBigDecimal(Map<String, Object> metadata, String... keys) {
        for (String key : keys) {
            Object value = metadata.get(key);
            if (value instanceof Number number) {
                return new BigDecimal(number.toString());
            }
            if (value instanceof String str && !str.isBlank()) {
                try {
                    return new BigDecimal(str);
                } catch (Exception ignored) {
                    // ignore parse error
                }
            }
        }
        return null;
    }

    private Integer resolveInteger(Map<String, Object> metadata, String... keys) {
        for (String key : keys) {
            Object value = metadata.get(key);
            if (value instanceof Number number) {
                return number.intValue();
            }
            if (value instanceof String str && !str.isBlank()) {
                try {
                    return Integer.parseInt(str);
                } catch (Exception ignored) {
                    // ignore parse error
                }
            }
        }
        return null;
    }

    private LocalDate resolveDate(Map<String, Object> metadata, String... keys) {
        for (String key : keys) {
            Object value = metadata.get(key);
            if (value instanceof String str && !str.isBlank()) {
                LocalDate parsed = parseDate(str);
                if (parsed != null) {
                    return parsed;
                }
            }
        }
        return null;
    }

    private LocalDate parseDate(String value) {
        List<DateTimeFormatter> formats = List.of(
                DateTimeFormatter.ISO_LOCAL_DATE,
                DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                DateTimeFormatter.ofPattern("dd-MM-yyyy")
        );
        for (DateTimeFormatter formatter : formats) {
            try {
                return LocalDate.parse(value, formatter);
            } catch (Exception ignored) {
                // try next format
            }
        }
        return null;
    }

    private String buildAddress(String address, String number, String complement) {
        StringBuilder builder = new StringBuilder();
        if (address != null && !address.isBlank()) {
            builder.append(address.trim());
        }
        if (number != null && !number.isBlank()) {
            if (!builder.isEmpty()) builder.append(", ");
            builder.append(number.trim());
        }
        if (complement != null && !complement.isBlank()) {
            if (!builder.isEmpty()) builder.append(" ");
            builder.append(complement.trim());
        }
        return builder.length() == 0 ? null : builder.toString();
    }
}
