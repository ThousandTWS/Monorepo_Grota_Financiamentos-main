import { z } from "zod";
import api from "../server/api";
import {
  CreateProposalPayload,
  Proposal,
  ProposalFilters,
  ProposalStatus,
  UpdateProposalStatusPayload,
} from "@/application/core/@types/Proposals/Proposal";

const PROPOSALS_ENDPOINT = "/api/proposals";
const DIRECT_ENDPOINT = "/proposals";

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

const buildQuery = (filters: ProposalFilters) => {
  const params = new URLSearchParams();
  if (filters.status && statusSchema.safeParse(filters.status).success) {
    params.set("status", filters.status);
  }
  return params;
};

export const fetchProposals = async (
  filters: ProposalFilters = {},
): Promise<Proposal[]> => {
  const query = buildQuery(filters);
  const url =
    query.toString().length > 0
      ? `${PROPOSALS_ENDPOINT}?${query.toString()}`
      : PROPOSALS_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string })?.error ??
      "Não foi possível carregar suas propostas.";
    throw new Error(message);
  }

  const normalized = Array.isArray(payload) ? payload : [];
  return ProposalListSchema.parse(normalized);
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

  const payloadResponse = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payloadResponse as { error?: string })?.error ??
      "Não foi possível enviar a proposta.";
    throw new Error(message);
  }

  return ProposalSchema.parse(payloadResponse);
};

export const updateProposalStatus = async (
  proposalId: number,
  payload: UpdateProposalStatusPayload,
): Promise<Proposal> => {
  const response = await api.patch(
    `${DIRECT_ENDPOINT}/${proposalId}/status`,
    payload,
  );
  return ProposalSchema.parse(response.data);
};
