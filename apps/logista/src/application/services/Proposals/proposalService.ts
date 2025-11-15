/* eslint-disable @typescript-eslint/ban-ts-comment */
import api from "../server/api";
import { z } from "zod";
import {
  ProposalQueueFilters,
  ProposalQueueItem,
  ProposalQueueStatus,
  ProposalSummaryPayload,
} from "@/application/core/@types/Proposals/Proposal";
import { mockProposals, mockSummary } from "./mock-data";

const PROPOSALS_QUEUE_ENDPOINT = "/workflow/proposals/queue";
const PROPOSALS_SUMMARY_ENDPOINT = "/workflow/proposals/summary";
const proposalsApiMode = (
  process.env.NEXT_PUBLIC_PROPOSALS_API_MODE ?? "mock"
).toLowerCase();
const shouldUseMock = proposalsApiMode !== "api";

const statusEnum = z.enum([
  "triage",
  "awaiting_input",
  "analysis",
  "filling",
  "sent",
  "pre_approved",
  "rejected",
  "awaiting_payment",
  "paid",
] satisfies ProposalQueueStatus[]);

const ProposalStatusSnapshotSchema = z.object({
  status: statusEnum,
  label: z.string(),
  updatedAt: z.string(),
  analyst: z.string(),
  description: z.string().optional(),
});

const ProposalAssetSchema = z.object({
  brand: z.string(),
  model: z.string(),
  version: z.string().optional().nullable(),
  year: z.coerce.number(),
  entryValue: z.coerce.number(),
  financedValue: z.coerce.number(),
  installmentValue: z.coerce.number(),
  termMonths: z.coerce.number(),
});

const ProposalProductInfoSchema = z.object({
  bank: z.string(),
  product: z.string(),
  modality: z.string(),
});

const ProposalQueueItemSchema = z.object({
  id: z.string(),
  contract: z.string(),
  clientName: z.string(),
  clientDocument: z.string(),
  dealerName: z.string(),
  dealerCode: z.string().optional().nullable(),
  operatorName: z.string(),
  operatorSentAt: z.string(),
  asset: ProposalAssetSchema,
  productInfo: ProposalProductInfoSchema,
  currentStatus: ProposalStatusSnapshotSchema,
  timelineStatus: z.array(ProposalStatusSnapshotSchema).optional(),
});

const ProposalQueueResponseSchema = z.array(ProposalQueueItemSchema);

const ProposalSummarySchema = z.object({
  overallTotal: z.coerce.number().default(0),
  myTickets: z
    .array(
      z.object({
        label: z.string(),
        value: z.coerce.number(),
        total: z.coerce.number().optional(),
        color: z.string().optional(),
      }),
    )
    .default([]),
  statusTotals: z
    .array(
      z.object({
        key: statusEnum,
        label: z.string(),
        value: z.coerce.number(),
        total: z.coerce.number().optional(),
      }),
    )
    .default([]),
});

const fetchQueueFromApi = async (
  filters: ProposalQueueFilters,
): Promise<ProposalQueueItem[]> => {
  const response = await api.get(PROPOSALS_QUEUE_ENDPOINT, {
    params: filters,
  });
  //@ts-ignore
  return ProposalQueueResponseSchema.parse(response.data);
};

const fetchSummaryFromApi = async (
  filters: ProposalQueueFilters,
): Promise<ProposalSummaryPayload> => {
  const response = await api.get(PROPOSALS_SUMMARY_ENDPOINT, {
    params: filters,
  });

  return ProposalSummarySchema.parse(response.data);
};

export const fetchProposalQueue = async (
  filters: ProposalQueueFilters = {},
): Promise<ProposalQueueItem[]> => {
  if (!shouldUseMock) {
    try {
      return await fetchQueueFromApi(filters);
    } catch (error) {
      console.warn(
        "[proposalService] Falha ao consultar API, usando mock para a fila.",
        error,
      );
    }
  }

  return mockProposals;
};

export const fetchProposalSummary = async (
  filters: ProposalQueueFilters = {},
): Promise<ProposalSummaryPayload> => {
  if (!shouldUseMock) {
    try {
      return await fetchSummaryFromApi(filters);
    } catch (error) {
      console.warn(
        "[proposalService] Falha ao consultar API, usando mock para o resumo.",
        error,
      );
    }
  }

  return mockSummary;
};
