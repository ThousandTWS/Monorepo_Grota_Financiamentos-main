import axios, { isAxiosError } from "axios";
import { z } from "zod";
import {
  BillingContractCreatePayload,
  BillingContractDetails,
  BillingContractFilters,
  BillingContractSummary,
  BillingInstallment,
  BillingInstallmentUpdatePayload,
  BillingOccurrence,
  BillingOccurrencePayload,
  BillingStatus,
} from "@/application/core/@types/Billing/Billing";

const billingApi = axios.create({
  baseURL: "/api/billing",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getServerCookieHeader(): Promise<Record<string, string>> {
  if (typeof window !== "undefined") return {};

  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const serialized = cookieStore.toString();
  return serialized ? { Cookie: serialized } : {};
}

async function requestWithSession<T>(
  config: Parameters<typeof billingApi.request>[0],
): Promise<T> {
  const serverCookies = await getServerCookieHeader();
  const response = await billingApi.request({
    ...config,
    headers: { ...(config.headers ?? {}), ...serverCookies },
  });
  return response.data as T;
}

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

function buildErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const payload = error.response?.data as { error?: string; message?: string } | undefined;
    return (
      payload?.message ??
      payload?.error ??
      error.message ??
      "Falha ao comunicar com o servidor."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Falha ao comunicar com o servidor.";
}

export const listBillingContracts = async (
  filters: BillingContractFilters = {},
): Promise<BillingContractSummary[]> => {
  try {
    const response = await requestWithSession<unknown>(
      {
        method: "GET",
        url: `/contracts${buildQueryString(filters)}`,
      },
    );
    const listPayload = extractArrayPayload(response);
    return BillingContractSummaryListSchema.parse(listPayload);
  } catch (error) {
    throw new Error(buildErrorMessage(error));
  }
};

export const createBillingContract = async (
  payload: BillingContractCreatePayload,
): Promise<BillingContractDetails> => {
  try {
    const response = await requestWithSession<unknown>({
      method: "POST",
      url: "/contracts",
      data: payload,
    });
    return BillingContractDetailsSchema.parse(response);
  } catch (error) {
    throw new Error(buildErrorMessage(error));
  }
};

export const getBillingContractDetails = async (
  contractNumber: string,
): Promise<BillingContractDetails> => {
  try {
    const response = await requestWithSession<unknown>({
      method: "GET",
      url: `/contracts/${contractNumber}`,
    });
    return BillingContractDetailsSchema.parse(response);
  } catch (error) {
    throw new Error(buildErrorMessage(error));
  }
};

export const updateBillingInstallment = async (
  contractNumber: string,
  installmentNumber: number,
  payload: BillingInstallmentUpdatePayload,
): Promise<BillingInstallment> => {
  try {
    const response = await requestWithSession<unknown>({
      method: "PATCH",
      url: `/contracts/${contractNumber}/installments/${installmentNumber}`,
      data: payload,
    });

    return BillingInstallmentSchema.parse(response);
  } catch (error) {
    throw new Error(buildErrorMessage(error));
  }
};

export const createBillingOccurrence = async (
  contractNumber: string,
  payload: BillingOccurrencePayload,
): Promise<BillingOccurrence> => {
  try {
    const response = await requestWithSession<unknown>({
      method: "POST",
      url: `/contracts/${contractNumber}/occurrences`,
      data: payload,
    });

    return BillingOccurrenceSchema.parse(response);
  } catch (error) {
    throw new Error(buildErrorMessage(error));
  }
};
