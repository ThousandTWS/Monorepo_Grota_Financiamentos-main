/* eslint-disable turbo/no-undeclared-env-vars */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  dispatchBridgeEvent,
  parseBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import {
  Proposal,
  ProposalFilters,
  ProposalStatus,
} from "@/application/core/@types/Proposals/Proposal";
import {
  fetchProposals,
  updateProposalStatus,
} from "@/application/services/Proposals/proposalService";
import { useToast } from "@/application/core/hooks/use-toast";
import {
  QueueStats,
  ProposalsDashboardSummary,
} from "./components/QueueStats";
import { StatusLegend } from "./components/StatusLegend";
import { QueueFilters } from "./components/QueueFilters";
import { ProposalsTable } from "./components/ProposalsTable";
import { getAllLogistics } from "@/application/services/Logista/logisticService";
import { getAllSellers } from "@/application/services/Seller/sellerService";
import { getRealtimeUrl } from "@/application/config/realtime";

const ADMIN_PROPOSALS_IDENTITY = "admin-esteira";

const statusConfig: Record<
  ProposalStatus,
  { label: string; bulletColor: string; barColor: string }
> = {
  SUBMITTED: {
    label: "Enviadas",
    bulletColor: "bg-sky-500",
    barColor: "bg-sky-500",
  },
  PENDING: {
    label: "Pendentes",
    bulletColor: "bg-amber-400",
    barColor: "bg-amber-400",
  },
  APPROVED: {
    label: "Aprovadas",
    bulletColor: "bg-emerald-500",
    barColor: "bg-emerald-500",
  },
  REJECTED: {
    label: "Recusadas",
    bulletColor: "bg-red-500",
    barColor: "bg-red-500",
  },
};

const statusOptions: { value: ProposalStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "(todos)" },
  ...Object.entries(statusConfig).map(([key, config]) => ({
    value: key as ProposalStatus,
    label: config.label,
  })),
];

type LocalFilters = {
  search: string;
  status: ProposalStatus | "ALL";
  dealerId?: string;
  dealerCode?: string;
  operatorId?: string;
};

const initialFilters: LocalFilters = {
  search: "",
  status: "ALL",
  dealerId: undefined,
  dealerCode: "",
  operatorId: undefined,
};

export default function EsteiraDePropostasFeature() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<LocalFilters>(initialFilters);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [dealerIndex, setDealerIndex] = useState<Record<number, { name: string; enterprise?: string }>>({});
  const [sellerIndex, setSellerIndex] = useState<Record<number, string>>({});

  const { messages, sendMessage } = useRealtimeChannel({
    channel: REALTIME_CHANNELS.PROPOSALS,
    identity: ADMIN_PROPOSALS_IDENTITY,
    url: getRealtimeUrl(),
  });

  const latestRealtimeMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;

  const loadProposals = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (!silent) {
        setIsLoading(true);
      }
      setIsRefreshing(true);
      try {
        const queryFilters: ProposalFilters = {};
        if (filters.status !== "ALL") {
          queryFilters.status = filters.status;
        }
        if (filters.dealerId) {
          queryFilters.dealerId = Number(filters.dealerId);
        }
        const result = await fetchProposals(queryFilters);
        setProposals(result);
      } catch (error) {
        console.error("[Admin Esteira] Falha ao buscar propostas", error);
        toast({
          title: "Falha ao carregar",
          description: "Não conseguimos sincronizar as fichas agora.",
          variant: "destructive",
        });
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
        setIsRefreshing(false);
      }
    },
    [filters.dealerId, filters.status, toast],
  );

  const applyRealtimeSnapshot = useCallback((snapshot: Proposal) => {
    if (!snapshot?.id) return;
    setProposals((current) => {
      const index = current.findIndex((item) => item.id === snapshot.id);
      if (index >= 0) {
        const clone = [...current];
        clone[index] = snapshot;
        return clone;
      }
      return [snapshot, ...current];
    });
  }, []);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  useEffect(() => {
    const loadNames = async () => {
      try {
        const [dealers, sellers] = await Promise.all([
          getAllLogistics(),
          getAllSellers(),
        ]);

        const dealerMap = dealers.reduce<Record<number, { name: string; enterprise?: string }>>((acc, dealer) => {
          if (dealer.id) {
            const name = dealer.fullName || dealer.enterprise || dealer.razaoSocial || `Lojista #${dealer.id}`;
            acc[dealer.id] = {
              name,
              enterprise: dealer.enterprise || dealer.razaoSocial || dealer.fullNameEnterprise || undefined,
            };
          }
          return acc;
        }, {});

        const sellerMap = sellers.reduce<Record<number, string>>((acc, seller) => {
          if (seller.id) {
            const name = seller.fullName || seller.email || `Operador #${seller.id}`;
            acc[seller.id] = name;
          }
          return acc;
        }, {});

        setDealerIndex(dealerMap);
        setSellerIndex(sellerMap);
      } catch (error) {
        console.warn("[Admin Esteira] Não foi possível carregar nomes de lojistas/vendedores", error);
      }
    };

    loadNames();
  }, []);

  useEffect(() => {
    if (!latestRealtimeMessage) return;
    const parsed = parseBridgeEvent(latestRealtimeMessage);
    if (!parsed) return;

    const payload = (parsed.payload ?? {}) as {
      proposal?: Proposal;
      source?: string;
    };

    if (
      parsed.event === REALTIME_EVENT_TYPES.PROPOSAL_CREATED &&
      payload.proposal
    ) {
      applyRealtimeSnapshot(payload.proposal);
      toast({
        title: "Nova ficha do lojista",
        description: `${payload.proposal.customerName} aguardando análise.`,
      });
      return;
    }

    if (
      parsed.event === REALTIME_EVENT_TYPES.PROPOSAL_STATUS_UPDATED &&
      payload.proposal &&
      payload.source !== ADMIN_PROPOSALS_IDENTITY
    ) {
      applyRealtimeSnapshot(payload.proposal);
      return;
    }

    if (parsed.event === REALTIME_EVENT_TYPES.PROPOSALS_REFRESH_REQUEST) {
      loadProposals({ silent: true });
    }
  }, [
    latestRealtimeMessage,
    applyRealtimeSnapshot,
    loadProposals,
    toast,
  ]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesStatus =
        filters.status === "ALL" || proposal.status === filters.status;
      const searchInput = filters.search.trim().toLowerCase();
      const matchesSearch = searchInput
        ? proposal.customerName.toLowerCase().includes(searchInput) ||
          proposal.customerCpf.toLowerCase().includes(searchInput) ||
          proposal.vehiclePlate.toLowerCase().includes(searchInput)
        : true;
      const matchesDealer = filters.dealerId
        ? String(proposal.dealerId ?? "") === filters.dealerId
        : true;
      const matchesDealerCode = filters.dealerCode
        ? String(proposal.dealerId ?? "").includes(filters.dealerCode)
        : true;
      const matchesOperator = filters.operatorId
        ? String(proposal.sellerId ?? "") === filters.operatorId
        : true;

      return (
        matchesStatus &&
        matchesSearch &&
        matchesDealer &&
        matchesDealerCode &&
        matchesOperator
      );
    });
  }, [filters, proposals]);

  const summary = useMemo<ProposalsDashboardSummary>(() => {
    const overallTotal = proposals.length;
    const statusTotals = Object.entries(statusConfig).map(([key, config]) => {
      const value = proposals.filter(
        (proposal) => proposal.status === key,
      ).length;
      return {
        key: key as ProposalStatus,
        label: config.label,
        value,
        total: overallTotal,
        color: config.barColor,
      };
    });
    const myTickets = statusTotals.map((item) => ({
      label: item.label,
      value: item.value,
      total: overallTotal,
      color: statusConfig[item.key].bulletColor,
      status: item.key,
    }));

    return {
      overallTotal,
      myTickets,
      statusTotals,
    };
  }, [proposals]);

  const availableOperators = useMemo(() => {
    const ids = new Set<string>();
    proposals.forEach((proposal) => {
      if (proposal.sellerId) {
        ids.add(String(proposal.sellerId));
      }
    });
    return Array.from(ids).map((value) => ({
      value,
      label: sellerIndex[Number(value)] ?? `Operador #${value}`,
    }));
  }, [proposals, sellerIndex]);

  const availableDealers = useMemo(() => {
    const ids = new Set<string>();
    proposals.forEach((proposal) => {
      if (proposal.dealerId) {
        ids.add(String(proposal.dealerId));
      }
    });
    return Array.from(ids).map((value) => ({
      value,
      label: dealerIndex[Number(value)]
        ? dealerIndex[Number(value)].enterprise
          ? `${dealerIndex[Number(value)].name} (${dealerIndex[Number(value)].enterprise})`
          : dealerIndex[Number(value)].name
        : `Lojista #${value}`,
    }));
  }, [proposals, dealerIndex]);

  const handleFiltersChange = (partial: Partial<LocalFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (filters.status !== "ALL") {
      params.set("status", filters.status);
    }
    if (filters.dealerId) {
      params.set("dealerId", filters.dealerId);
    }
    const query = params.toString();
    const url = `/api/proposals/export${query ? `?${query}` : ""}`;
    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Falha ao exportar CSV.");
      }
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = "propostas.csv";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(href);
    } catch (error) {
      console.error("[Admin Esteira] export", error);
      toast({
        title: "Não foi possível exportar",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    loadProposals();
    dispatchBridgeEvent(sendMessage, REALTIME_EVENT_TYPES.PROPOSALS_REFRESH_REQUEST, {
      source: ADMIN_PROPOSALS_IDENTITY,
      reason: "admin-manual-refresh",
    });
  };

  const handleStatusUpdate = async (
    proposal: Proposal,
    nextStatus: ProposalStatus,
  ) => {
    setUpdatingId(proposal.id);
    try {
      const updated = await updateProposalStatus(proposal.id, {
        status: nextStatus,
        notes: proposal.notes ?? undefined,
        actor: "admin-console",
      });
      applyRealtimeSnapshot(updated);
      toast({
        title: "Status atualizado",
        description: `${proposal.customerName} agora está ${statusOptions.find((item) => item.value === nextStatus)?.label}.`,
      });
    } catch (error) {
      console.error("[Admin Esteira] Falha ao atualizar status", error);
      toast({
        title: "Não foi possível atualizar",
        description: "Revise o status no admin e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreate = () => {
    toast({
      title: "Fluxo de cadastro em desenvolvimento",
      description: "Em breve será possível abrir fichas direto pelo admin.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <QueueStats summary={summary} isLoading={isLoading && proposals.length === 0} />
        <StatusLegend summary={summary} />
      </div>

      <QueueFilters
        filters={filters}
        operators={availableOperators}
        dealers={availableDealers}
        statuses={statusOptions}
        onFiltersChange={handleFiltersChange}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
        onExport={handleExport}
        isRefreshing={isRefreshing}
      />

      <ProposalsTable
        proposals={filteredProposals}
        isLoading={isLoading}
        onStatusChange={handleStatusUpdate}
        updatingId={updatingId}
        dealersById={dealerIndex}
        sellersById={sellerIndex}
      />
    </div>
  );
}
