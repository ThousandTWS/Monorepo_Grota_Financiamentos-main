export type ProposalQueueStatus =
  | "triage"
  | "awaiting_input"
  | "analysis"
  | "filling"
  | "sent"
  | "pre_approved"
  | "rejected"
  | "awaiting_payment"
  | "paid";

export interface ProposalAsset {
  brand: string;
  model: string;
  version?: string;
  year: number;
  entryValue: number;
  financedValue: number;
  installmentValue: number;
  termMonths: number;
}

export interface ProposalProductInfo {
  bank: string;
  product: string;
  modality: string;
}

export interface ProposalStatusSnapshot {
  status: ProposalQueueStatus;
  label: string;
  updatedAt: string;
  analyst: string;
  description?: string;
}

export interface ProposalQueueItem {
  id: string;
  contract: string;
  clientName: string;
  clientDocument: string;
  dealerName: string;
  dealerCode?: string;
  operatorName: string;
  operatorSentAt: string;
  asset: ProposalAsset;
  productInfo: ProposalProductInfo;
  currentStatus: ProposalStatusSnapshot;
  timelineStatus?: ProposalStatusSnapshot[];
}

export interface ProposalQueueFilters {
  search?: string;
  operatorId?: string;
  dealerId?: string;
  dealerCode?: string;
  status?: ProposalQueueStatus[];
}

export interface ProposalSummaryBucket {
  key: ProposalQueueStatus;
  label: string;
  value: number;
  total?: number;
}

export interface ProposalSummaryPayload {
  myTickets: {
    label: string;
    value: number;
    total?: number;
    color?: string;
  }[];
  statusTotals: ProposalSummaryBucket[];
  overallTotal: number;
}
