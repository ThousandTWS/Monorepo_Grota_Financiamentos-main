import { z } from "zod";
import api from "../server/api";
import {
  CreateProposalPayload,
  Proposal,
  ProposalFilters,
  ProposalStatus,
  UpdateProposalStatusPayload,
} from "@/application/core/@types/Proposals/Proposal";

const PROPOSALS_ENDPOINT = "/proposals";

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

const buildFilters = (filters: ProposalFilters) => {
  const params: Record<string, unknown> = {};
  if (typeof filters.dealerId === "number") {
    params.dealerId = filters.dealerId;
  }
  if (filters.status) {
    params.status = filters.status;
  }
  return params;
};

export const fetchProposals = async (
  filters: ProposalFilters = {},
): Promise<Proposal[]> => {
  const response = await api.get(PROPOSALS_ENDPOINT, {
    params: buildFilters(filters),
  });
  return ProposalListSchema.parse(response.data);
};

export const createProposal = async (
  payload: CreateProposalPayload,
): Promise<Proposal> => {
  const response = await api.post(PROPOSALS_ENDPOINT, payload);
  return ProposalSchema.parse(response.data);
};

export const updateProposalStatus = async (
  proposalId: number,
  payload: UpdateProposalStatusPayload,
): Promise<Proposal> => {
  const response = await api.patch(
    `${PROPOSALS_ENDPOINT}/${proposalId}/status`,
    payload,
  );
  return ProposalSchema.parse(response.data);
};
