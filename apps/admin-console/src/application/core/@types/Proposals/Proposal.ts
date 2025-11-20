export type ProposalStatus = "SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";

export interface Proposal {
  id: number;
  dealerId?: number | null;
  sellerId?: number | null;
  customerName: string;
  customerCpf: string;
  customerBirthDate: string;
  customerEmail: string;
  customerPhone: string;
  cnhCategory: string;
  hasCnh: boolean;
  vehiclePlate: string;
  fipeCode: string;
  fipeValue: number;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  downPaymentValue: number;
  financedValue: number;
  status: ProposalStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalFilters {
  search?: string;
  dealerId?: number;
  status?: ProposalStatus;
}

export interface CreateProposalPayload {
  dealerId?: number;
  sellerId?: number;
  customerName: string;
  customerCpf: string;
  customerBirthDate: string;
  customerEmail: string;
  customerPhone: string;
  cnhCategory: string;
  hasCnh: boolean;
  vehiclePlate: string;
  fipeCode: string;
  fipeValue: number;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  downPaymentValue: number;
  financedValue: number;
  notes?: string;
}

export interface UpdateProposalStatusPayload {
  status: ProposalStatus;
  notes?: string;
}
