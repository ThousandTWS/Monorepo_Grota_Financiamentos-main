import { z } from "zod";
import {
  BillingContractDetails,
  BillingContractFilters,
  BillingContractSummary,
  BillingInstallment,
  BillingInstallmentUpdatePayload,
  BillingOccurrence,
  BillingOccurrencePayload,
  BillingStatus,
} from "@/application/core/@types/Billing/Billing";

const BILLING_ENDPOINT = "/api/billing/contracts";

const statusSchema = z.enum(["PAGO", "EM_ABERTO", "EM_ATRASO"] satisfies BillingStatus[]);

const BillingCustomerSchema = z.object({
  name: z.string(),
  document: z.string(),
  birthDate: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
});

const BillingVehicleSchema = z.object({
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  year: z.coerce.number().nullable().optional(),
  plate: z.string().nullable().optional(),
});

const BillingInstallmentSchema = z.object({
  number: z.coerce.number(),
  dueDate: z.string(),
  amount: z.coerce.number(),
  paid: z.coerce.boolean(),
  paidAt: z.string().nullable().optional(),
});

const BillingOccurrenceSchema = z.object({
  id: z.coerce.number(),
  date: z.string(),
  contact: z.string(),
  note: z.string(),
  createdAt: z.string(),
});

const BillingContractSummarySchema = z.object({
  contractNumber: z.string(),
  status: statusSchema,
  paidAt: z.string(),
  startDate: z.string(),
  installmentValue: z.coerce.number(),
  installmentsTotal: z.coerce.number(),
  customer: BillingCustomerSchema,
  createdAt: z.string(),
});

const BillingContractDetailsSchema = z.object({
  contractNumber: z.string(),
  proposalId: z.coerce.number().nullable().optional(),
  status: statusSchema,
  paidAt: z.string(),
  startDate: z.string(),
  financedValue: z.coerce.number(),
  installmentValue: z.coerce.number(),
  installmentsTotal: z.coerce.number(),
  customer: BillingCustomerSchema,
  vehicle: BillingVehicleSchema,
  installments: z.array(BillingInstallmentSchema),
  occurrences: z.array(BillingOccurrenceSchema),
  otherContracts: z.array(BillingContractSummarySchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const BillingContractSummaryListSchema = z.array(BillingContractSummarySchema);

function extractArrayPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidates = ["content", "data", "items", "results"];
    for (const key of candidates) {
      if (Array.isArray(record[key])) {
        return record[key] as unknown[];
      }
    }
  }

  return [];
}

const buildQueryString = (filters: BillingContractFilters) => {
  const params = new URLSearchParams();
  if (filters.name) {
    params.set("name", filters.name);
  }
  if (filters.document) {
    params.set("document", filters.document);
  }
  if (filters.contractNumber) {
    params.set("contractNumber", filters.contractNumber);
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
};

async function handleResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string; message?: string })?.error ??
      (payload as { message?: string })?.message ??
      "Falha ao comunicar com o servidor.";
    throw new Error(message);
  }

  return (payload ?? {}) as T;
}

export const listBillingContracts = async (
  filters: BillingContractFilters = {},
): Promise<BillingContractSummary[]> => {
  const response = await fetch(
    `${BILLING_ENDPOINT}${buildQueryString(filters)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  const payload = await handleResponse<unknown>(response);
  const listPayload = extractArrayPayload(payload);
  return BillingContractSummaryListSchema.parse(listPayload);
};

export const getBillingContractDetails = async (
  contractNumber: string,
): Promise<BillingContractDetails> => {
  const response = await fetch(`${BILLING_ENDPOINT}/${contractNumber}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const payload = await handleResponse<unknown>(response);
  return BillingContractDetailsSchema.parse(payload);
};

export const updateBillingInstallment = async (
  contractNumber: string,
  installmentNumber: number,
  payload: BillingInstallmentUpdatePayload,
): Promise<BillingInstallment> => {
  const response = await fetch(
    `${BILLING_ENDPOINT}/${contractNumber}/installments/${installmentNumber}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const responsePayload = await handleResponse<unknown>(response);
  return BillingInstallmentSchema.parse(responsePayload);
};

export const createBillingOccurrence = async (
  contractNumber: string,
  payload: BillingOccurrencePayload,
): Promise<BillingOccurrence> => {
  const response = await fetch(
    `${BILLING_ENDPOINT}/${contractNumber}/occurrences`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const responsePayload = await handleResponse<unknown>(response);
  return BillingOccurrenceSchema.parse(responsePayload);
};
