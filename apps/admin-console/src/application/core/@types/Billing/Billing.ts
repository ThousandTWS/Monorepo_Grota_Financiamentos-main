export type BillingStatus = "PAGO" | "EM_ABERTO" | "EM_ATRASO";

export type BillingCustomer = {
  name: string;
  document: string;
  birthDate?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
};

export type BillingVehicle = {
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  plate?: string | null;
  renavam?: string | null;
  dutIssued?: boolean | null;
};

export type BillingInstallment = {
  number: number;
  dueDate: string;
  amount: number;
  paid: boolean;
  paidAt?: string | null;
  daysLate?: number | null;
};

export type BillingInstallmentInput = {
  number: number;
  dueDate: string;
  amount: number;
  paid?: boolean;
  paidAt?: string | null;
};

export type BillingOccurrence = {
  id: number;
  date: string;
  contact: string;
  note: string;
  createdAt: string;
};

export type BillingContractSummary = {
  contractNumber: string;
  status: BillingStatus;
  paidAt: string;
  startDate: string;
  installmentValue: number;
  installmentsTotal: number;
  customer: BillingCustomer;
  createdAt: string;
};

export type BillingContractDetails = {
  contractNumber: string;
  proposalId?: number | null;
  status: BillingStatus;
  paidAt: string;
  startDate: string;
  financedValue: number;
  installmentValue: number;
  installmentsTotal: number;
  outstandingBalance: number;
  remainingBalance: number;
  customer: BillingCustomer;
  vehicle: BillingVehicle;
  installments: BillingInstallment[];
  occurrences: BillingOccurrence[];
  otherContracts: BillingContractSummary[];
  createdAt: string;
  updatedAt: string;
};

export type BillingContractCreatePayload = {
  contractNumber: string;
  proposalId?: number | null;
  status: BillingStatus;
  paidAt: string;
  startDate: string;
  financedValue: number;
  installmentValue: number;
  installmentsTotal: number;
  firstDueDate?: string | null;
  customerName: string;
  customerDocument: string;
  customerBirthDate?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  customerCity?: string | null;
  customerState?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  vehiclePlate?: string | null;
  vehicleRenavam?: string | null;
  dutIssued?: boolean | null;
  installments?: BillingInstallmentInput[];
};

export type BillingContractFilters = {
  name?: string;
  document?: string;
  contractNumber?: string;
  status?: BillingStatus;
};

export type BillingInstallmentUpdatePayload = {
  paid: boolean;
  paidAt?: string;
};

export type BillingOccurrencePayload = {
  date: string;
  contact: string;
  note: string;
};
