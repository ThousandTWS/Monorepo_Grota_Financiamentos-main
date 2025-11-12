/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QueueFilters } from "./components/QueueFilters";
import { QueueStats } from "./components/QueueStats";
import { StatusLegend } from "./components/StatusLegend";
import { ProposalsTable } from "./components/ProposalsTable";
import { CreateProposalDialog, CreateProposalPayload } from "./components/CreateProposalDialog";
import {
  ProposalQueueFilters,
  ProposalQueueItem,
  ProposalSummaryPayload,
} from "@/application/core/@types/Proposals/Proposal";
import {
  fetchProposalQueue,
  fetchProposalSummary,
} from "@/application/services/Proposals/proposalService";
import { mockProposals, mockSummary } from "./data/mock-data";
import { useToast } from "@/application/core/hooks/use-toast";
import { useRouter } from "next/navigation";

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

export default function EsteiraDePropostasFeature() {
  const { toast } = useToast();
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
      console.error("Falha ao carregar a esteira de propostas:", error);
      setProposals(mockProposals);
      setSummary(mockSummary);
      toast({
        title: "Não foi possível sincronizar",
        description: "Mostrando dados de demonstração enquanto conectamos à API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters, toast]);

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
      toast({
        title: "Rascunho salvo",
        description:
          "Assim que o endpoint estiver disponível esse formulário disparará a criação da ficha.",
      });
      setIsCreateDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRedirectToFullFlow = () => {
    if (!creationFlowRoute) {
      toast({
        title: "Fluxo completo indisponível",
        description:
          "Defina NEXT_PUBLIC_CREATE_PROPOSAL_ROUTE para apontar para a rota do fluxo definitivo.",
        variant: "destructive",
      });
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
    <div className="space-y-6" data-oid="qnyp7p0">
      

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]" data-oid="knyqnfc">
        <QueueStats summary={summary} isLoading={isLoading} />
        <StatusLegend summary={summary} />
      </div>
      <QueueFilters
        filters={filters}
        operators={availableOperators}
        dealers={availableDealers}
        //@ts-ignore
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
