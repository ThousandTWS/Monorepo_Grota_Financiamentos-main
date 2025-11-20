import { z } from "zod";
import {
  CreateProposalPayload,
  Proposal,
  ProposalFilters,
  ProposalStatus,
  UpdateProposalStatusPayload,
} from "@/application/core/@types/Proposals/Proposal";

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
  customerBirthDate: z.string(),
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
  status: statusSchema,
  notes: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ProposalListSchema = z.array(ProposalSchema);

const buildQueryString = (filters: ProposalFilters) => {
  const params = new URLSearchParams();
  if (typeof filters.dealerId === "number") {
    params.set("dealerId", String(filters.dealerId));
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
      (payload as { error?: string })?.error ??
      "Falha ao comunicar com o servidor.";
    throw new Error(message);
  }

  return (payload ?? {}) as T;
}

export const fetchProposals = async (
  filters: ProposalFilters = {},
): Promise<Proposal[]> => {
  const response = await fetch(
    `${PROPOSALS_ENDPOINT}${buildQueryString(filters)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  const payload = await handleResponse<unknown[]>(response);
  return ProposalListSchema.parse(payload);
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
