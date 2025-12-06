import { z } from "zod";
import {
  CreateProposalPayload,
  Proposal,
  ProposalFilters,
  ProposalStatus,
  UpdateProposalStatusPayload,
} from "@/application/core/@types/Proposals/Proposal";
import { PagedResponse, toPagedResponse } from "@/application/core/@types/pagination";

const PROPOSALS_ENDPOINT = "/api/proposals";

const statusSchema = z.enum(
  ["SUBMITTED", "PENDING", "APPROVED", "REJECTED"] satisfies ProposalStatus[],
);

const ProposalSchema = z.object({
  id: z.coerce.number(),
  dealerId: z.coerce.number().nullable().optional(),
  sellerId: z.coerce.number().nullable().optional(),
  customerName: z.string(),
  customerCpf: z.string(),
  customerBirthDate: z.string().nullable(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  cnhCategory: z.string(),
  hasCnh: z.coerce.boolean().default(false),
  vehiclePlate: z.string(),
  fipeCode: z.string(),
  fipeValue: z.coerce.number(),
  vehicleBrand: z.string(),
  vehicleModel: z.string(),
  vehicleYear: z.coerce.number(),
  downPaymentValue: z.coerce.number(),
  financedValue: z.coerce.number(),
  termMonths: z.coerce.number().nullable().optional(),
  vehicle0km: z.coerce.boolean().nullable().optional(),
  status: statusSchema,
  notes: z.string().nullable().optional(),
  maritalStatus: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  addressNumber: z.string().nullable().optional(),
  addressComplement: z.string().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  income: z.coerce.number().nullable().optional(),
  otherIncomes: z.coerce.number().nullable().optional(),
  metadata: z.union([z.record(z.string(), z.any()), z.string()]).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ProposalListSchema = z.array(ProposalSchema);

const PagedProposalSchema = z.object({
  content: ProposalListSchema,
  totalElements: z.number(),
  totalPages: z.number(),
  page: z.number(),
  size: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

const ProposalEventSchema = z.object({
  id: z.coerce.number(),
  proposalId: z.coerce.number(),
  type: z.string(),
  statusFrom: statusSchema.nullable().optional(),
  statusTo: statusSchema.nullable().optional(),
  note: z.string().nullable().optional(),
  actor: z.string().nullable().optional(),
  payload: z.unknown().nullable().optional(),
  createdAt: z.string(),
});

const ProposalEventListSchema = z.array(ProposalEventSchema);

const buildQueryString = (filters: ProposalFilters) => {
  const params = new URLSearchParams();
  if (typeof filters.dealerId === "number") {
    params.set("dealerId", String(filters.dealerId));
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (typeof filters.page === "number") {
    params.set("page", String(filters.page));
  }
  if (typeof filters.size === "number") {
    params.set("size", String(filters.size));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
};

async function handleResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string })?.error ??
      "Falha ao comunicar com o servidor.";
    throw new Error(message);
  }

  return (payload ?? {}) as T;
}

const DEFAULT_PAGE_SIZE = 10;

export const fetchProposals = async (
  filters: ProposalFilters = {},
): Promise<Proposal[]> => {
  const paged = await fetchProposalsPaged(filters);
  return paged.content;
};

export const fetchProposalsPaged = async (
  filters: ProposalFilters = {},
): Promise<PagedResponse<Proposal>> => {
  const page = typeof filters.page === "number" ? filters.page : 0;
  const size = typeof filters.size === "number" ? filters.size : DEFAULT_PAGE_SIZE;

  const response = await fetch(
    `${PROPOSALS_ENDPOINT}${buildQueryString({
      page,
      size,
      ...filters,
    })}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  const payload = await handleResponse<unknown>(response);
  const parsed = PagedProposalSchema.safeParse(payload);
  if (parsed.success) {
    return parsed.data;
  }

  const normalized = toPagedResponse<unknown>(payload);
  return {
    ...normalized,
    content: normalized.content.map((item) => ProposalSchema.parse(item)),
  };
};

export const createProposal = async (
  payload: CreateProposalPayload,
): Promise<Proposal> => {
  const response = await fetch(PROPOSALS_ENDPOINT, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const payloadResponse = await handleResponse<unknown>(response);
  return ProposalSchema.parse(payloadResponse);
};

export const updateProposalStatus = async (
  proposalId: number,
  payload: UpdateProposalStatusPayload,
): Promise<Proposal> => {
  const response = await fetch(
    `${PROPOSALS_ENDPOINT}/${proposalId}/status`,
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

  const payloadResponse = await handleResponse<unknown>(response);
  return ProposalSchema.parse(payloadResponse);
};

export const fetchProposalTimeline = async (
  proposalId: number,
): Promise<z.infer<typeof ProposalEventSchema>[]> => {
  const response = await fetch(
    `${PROPOSALS_ENDPOINT}/${proposalId}/events`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  const payload = await handleResponse<unknown>(response);
  return ProposalEventListSchema.parse(Array.isArray(payload) ? payload : []);
};
