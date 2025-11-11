import {
  ProposalQueueItem,
  ProposalSummaryPayload,
} from "@/application/core/@types/Proposals/Proposal";

export const mockProposals: ProposalQueueItem[] = [

];

export const mockSummary: ProposalSummaryPayload = {
  overallTotal: 90,
  myTickets: [
    { label: "Fichas na análise", value: 0, total: 0 },
    { label: "Espera Digitação", value: 0 },
    { label: "Análise", value: 0 },
    { label: "Preenchimento", value: 0 },
    { label: "Enviadas", value: 0, total: 0 },
  ],
  statusTotals: [
    { key: "pre_approved", label: "Pré-aprovada", value: 0 },
    { key: "rejected", label: "Recusada", value: 0, total: 0 },
    { key: "awaiting_payment", label: "Espera Pagamento", value: 0 },
    { key: "paid", label: "Pago", value: 0 },
  ],
};
