"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ProposalQueueFilters,
  ProposalQueueItem,
  ProposalSummaryPayload,
} from "@/application/core/@types/Proposals/Proposal";
import {
  fetchProposalQueue,
  fetchProposalSummary,
} from "@/application/services/Proposals/proposalService";
import {
  mockProposals,
  mockSummary,
} from "@/application/services/Proposals/mock-data";
import { QueueStats } from "./components/QueueStats";
import { StatusLegend } from "./components/StatusLegend";
import { QueueFilters } from "./components/QueueFilters";
import { ProposalsTable } from "./components/ProposalsTable";
import {
  CreateProposalDialog,
  CreateProposalPayload,
} from "./components/CreateProposalDialog";

const statusOptions = [
  { value: "triage", label: "Triagem" },
  { value: "awaiting_input", label: "Espera Digitação" },
  { value: "analysis", label: "Análise" },
  { value: "filling", label: "Preenchimento" },
  { value: "sent", label: "Enviada" },
  { value: "pre_approved", label: "Pré-aprovada" },
  { value: "rejected", label: "Recusada" },
  { value: "awaiting_payment", label: "Espera Pagamento" },
  { value: "paid", label: "Pago" },
] as const;

export function EsteiraDePropostasFeature() {
  const router = useRouter();
  const [filters, setFilters] = useState<ProposalQueueFilters>({ status: [] });
  const [proposals, setProposals] = useState<ProposalQueueItem[]>([]);
  const [summary, setSummary] = useState<ProposalSummaryPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const creationFlowRoute =
    process.env.NEXT_PUBLIC_CREATE_PROPOSAL_ROUTE ?? "";

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    try {
      const [queueResponse, summaryResponse] = await Promise.all([
        fetchProposalQueue(filters),
        fetchProposalSummary(filters),
      ]);
      setProposals(queueResponse);
      setSummary(summaryResponse);
    } catch (error) {
      console.error("[EsteiraDePropostas] Falha ao carregar dados", error);
      setProposals(mockProposals);
      setSummary(mockSummary);
      toast.error(
        "Falha ao sincronizar com a API. Exibindo dados de demonstração.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFiltersChange = (partialFilters: Partial<ProposalQueueFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...partialFilters,
    }));
  };

  const handleCreateProposal = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateProposalSubmit = async (
    payload: CreateProposalPayload,
  ) => {
    setIsCreating(true);
    try {
      if (process.env.NODE_ENV !== "production") {
        console.table(payload);
      }
      toast.success("Rascunho salvo localmente enquanto conectamos à API.");
      setIsCreateDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRedirectToFullFlow = () => {
    if (!creationFlowRoute) {
      toast.error(
        "Defina NEXT_PUBLIC_CREATE_PROPOSAL_ROUTE para abrir o fluxo completo.",
      );
      return;
    }

    router.push(creationFlowRoute);
    setIsCreateDialogOpen(false);
  };

  const availableOperators = useMemo(() => {
    const source = proposals.length > 0 ? proposals : mockProposals;
    return Array.from(new Set(source.map((item) => item.operatorName))).sort();
  }, [proposals]);

  const availableDealers = useMemo(() => {
    const source = proposals.length > 0 ? proposals : mockProposals;
    return Array.from(new Set(source.map((item) => item.dealerName))).sort();
  }, [proposals]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <QueueStats summary={summary} isLoading={isLoading} />
        <StatusLegend summary={summary} />
      </div>

      <QueueFilters
        filters={filters}
        operators={availableOperators}
        dealers={availableDealers}
        statuses={statusOptions}
        onFiltersChange={handleFiltersChange}
        onRefresh={loadData}
        onCreate={handleCreateProposal}
        isRefreshing={isRefreshing}
      />

      <ProposalsTable proposals={proposals} isLoading={isLoading} />

      <CreateProposalDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProposalSubmit}
        isSubmitting={isCreating}
        redirectTo={creationFlowRoute || undefined}
        onRedirect={handleRedirectToFullFlow}
      />
    </div>
  );
}

export default EsteiraDePropostasFeature;
