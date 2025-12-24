"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/layout/components/ui/card";
import { fetchProposals } from "@/application/services/Proposals/proposalService";
import { Proposal, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { cn } from "@/lib/utils";
import { getAllSellers, Seller } from "@/application/services/Seller/sellerService";
import { getAllLogistics } from "@/application/services/Logista/logisticService";
import { useUser } from "@/application/core/context/UserContext";
import { StatusBadge } from "../../logista/components/status-badge";

type StatusPanel = {
  key: ProposalStatus;
  title: string;
  statuses: ProposalStatus[];
};

const PANELS: StatusPanel[] = [
  {
    key: "SUBMITTED",
    title: "Propostas Enviadas",
    statuses: ["SUBMITTED"],
  },
  {
    key: "PENDING",
    title: "Em Analise",
    statuses: ["PENDING"],
  },
  {
    key: "APPROVED",
    title: "Aprovadas",
    statuses: ["APPROVED"],
  },
  {
    key: "REJECTED",
    title: "Reprovadas",
    statuses: ["REJECTED"],
  },
];

const currency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);

type TrendDirection = "up" | "down" | "flat";

const formatPercent = (value: number) => {
  const formatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatter.format(Math.abs(value))}%`;
};

const getTrend = (current: number, previous: number) => {
  if (previous === 0) {
    if (current === 0) {
      return { direction: "flat" as const, percent: 0 };
    }
    return { direction: "up" as const, percent: 100 };
  }

  const percent = ((current - previous) / previous) * 100;
  if (percent > 0) {
    return { direction: "up" as const, percent };
  }
  if (percent < 0) {
    return { direction: "down" as const, percent };
  }
  return { direction: "flat" as const, percent: 0 };
};

const trendStyles: Record<TrendDirection, string> = {
  up: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  down: "border-rose-400/40 bg-rose-500/15 text-rose-200",
  flat: "border-slate-400/40 bg-slate-500/15 text-slate-200",
};

const trendCopy: Record<TrendDirection, string> = {
  up: "Alta nas ultimas 4 semanas",
  down: "Queda nas ultimas 4 semanas",
  flat: "Estavel nas ultimas 4 semanas",
};

const trendWindowLabel = "vs 30 dias anteriores";

export function QuickStats() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [dealers, setDealers] = useState<{ id: number; fullName?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [proposalData, sellersData, dealersData] = await Promise.all([
          fetchProposals(),
          getAllSellers(),
          getAllLogistics(),
        ]);
        setProposals(proposalData);
        setSellers(sellersData);
        setDealers(Array.isArray(dealersData) ? dealersData : []);
        setHasError(false);
      } catch (error) {
        console.error("[QuickStats] Falha ao carregar propostas", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const firstName = useMemo(() => {
    const fullName = user?.fullName?.trim();
    if (!fullName) return "";
    return fullName.split(/\s+/)[0] ?? "";
  }, [user?.fullName]);

  const summary = useMemo(() => {
    const base = PANELS.map((panel) => ({
      key: panel.key,
      title: panel.title,
      count: 0,
      total: 0,
      current: 0,
      previous: 0,
    }));

    const map = Object.fromEntries(base.map((item) => [item.key, item]));

    const now = Date.now();
    const currentStart = now - 30 * 24 * 60 * 60 * 1000;
    const previousStart = now - 60 * 24 * 60 * 60 * 1000;

    proposals.forEach((proposal) => {
      const target = PANELS.find((panel) => panel.statuses.includes(proposal.status));
      if (!target) return;

      const entry = map[target.key];
      entry.count += 1;
      entry.total += proposal.financedValue ?? 0;

      const createdAt = proposal.createdAt
        ? new Date(proposal.createdAt).getTime()
        : Number.NaN;
      if (Number.isNaN(createdAt)) return;
      if (createdAt >= currentStart) {
        entry.current += 1;
      } else if (createdAt >= previousStart && createdAt < currentStart) {
        entry.previous += 1;
      }
    });

    return Object.values(map).map((item) => ({
      ...item,
      trend: getTrend(item.current, item.previous),
    }));
  }, [proposals]);

  const topSellers = useMemo(() => {
    const totals = proposals.reduce<Record<number, { count: number; total: number }>>(
      (acc, proposal) => {
        if (!proposal.sellerId) return acc;
        const entry = acc[proposal.sellerId] ?? { count: 0, total: 0 };
        entry.count += 1;
        entry.total += proposal.financedValue ?? 0;
        acc[proposal.sellerId] = entry;
        return acc;
      },
      {},
    );

    const sorted = Object.entries(totals)
      .map(([sellerId, data]) => {
        const seller = sellers.find((s) => s.id === Number(sellerId));
        return {
          sellerId: Number(sellerId),
          name: seller?.fullName ?? `Vendedor #${sellerId}`,
          count: data.count,
          total: data.total,
        };
      })
      .sort((a, b) => {
        if (b.count === a.count) return b.total - a.total;
        return b.count - a.count;
      })
      .slice(0, 3);

    while (sorted.length < 3) {
      sorted.push({
        sellerId: 0,
        name: "--",
        count: 0,
        total: 0,
      });
    }

    return sorted;
  }, [proposals, sellers]);

  const topDealers = useMemo(() => {
    const totals = proposals.reduce<Record<number, { count: number; total: number }>>(
      (acc, proposal) => {
        if (!proposal.dealerId) return acc;
        const entry = acc[proposal.dealerId] ?? { count: 0, total: 0 };
        entry.count += 1;
        entry.total += proposal.financedValue ?? 0;
        acc[proposal.dealerId] = entry;
        return acc;
      },
      {},
    );

    const sorted = Object.entries(totals)
      .map(([dealerId, data]) => {
        const dealer = dealers.find((d) => d.id === Number(dealerId));
        return {
          dealerId: Number(dealerId),
          name: dealer?.fullName ?? `Loja #${dealerId}`,
          count: data.count,
          total: data.total,
        };
      })
      .sort((a, b) => {
        if (b.count === a.count) return b.total - a.total;
        return b.count - a.count;
      })
      .slice(0, 3);

    while (sorted.length < 3) {
      sorted.push({
        dealerId: 0,
        name: "--",
        count: 0,
        total: 0,
      });
    }

    return sorted;
  }, [proposals, dealers]);

  const lastProposals = useMemo(() => {
    return [...proposals]
      .sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return bDate - aDate;
      })
      .slice(0, 5);
  }, [proposals]);

  const statusBadgeConfig: Record<ProposalStatus, string> = {
    SUBMITTED: "bg-sky-500/20 text-sky-100 border-sky-400/30",
    PENDING: "bg-amber-500/20 text-amber-100 border-amber-400/30",
    APPROVED: "bg-emerald-500/20 text-emerald-100 border-emerald-400/30",
    REJECTED: "bg-rose-500/20 text-rose-100 border-rose-400/30",
  };

  const statusLabel: Record<ProposalStatus, string> = {
    SUBMITTED: "Recebida",
    PENDING: "Em análise",
    APPROVED: "Aprovada",
    REJECTED: "Reprovada",
  };

  if (hasError) {
    return (
      <Card className="border border-destructive/30 bg-destructive/5">
        <CardContent className="py-6 text-sm text-destructive">
          Não foi possível carregar as estatísticas de propostas.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">
          Olá seja bem vindo {firstName ? `, ${firstName}` : ""}
        </h2>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Visao Geral
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const trend = item.trend;
          const TrendIcon =
            trend.direction === "up"
              ? TrendingUp
              : trend.direction === "down"
                ? TrendingDown
                : Minus;

          return (
            <Card
              key={item.key}
         
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#134B73] via-[#0f3c5a] to-[#0a2c45] text-white shadow-theme-lg  p-6 md:p-8"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-300">{item.title}</p>
                  {isLoading ? (
                    <div className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
                  ) : (
                    <span
                     
                    >
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-8 w-24 rounded-md bg-white/10 animate-pulse" />
                    <div className="h-4 w-36 rounded-md bg-white/10 animate-pulse" />
                    <div className="h-3 w-40 rounded-md bg-white/10 animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-3xl font-semibold tracking-tight">
                      {item.count}
                    </div>
                    <p className="text-sm text-slate-300">
                      {item.count === 1 ? "proposta" : "propostas"} - {currency(item.total)}
                    </p>
                   
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden border border-white/10 bg-gradient-to-r from-[#134B73] via-[#0f3c5a] to-[#0a2c45] text-white shadow-theme-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white/90">Top 3 Vendedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="h-24 rounded-md bg-white/10 animate-pulse" />
            ) : (
              <ol className="space-y-2 text-sm">
                {topSellers.map((seller, index) => (
                  <li
                    key={`${seller.sellerId}-${index}`}
                    className="flex items-center justify-between rounded-md border border-white/15 bg-white/10 px-3 py-2 text-white transition-colors hover:bg-white/15"
                  >
                    <div>
                      <p className="font-semibold">
                        {index + 1}º {seller.name}
                      </p>
                      <p className="text-xs text-slate-300">
                        {seller.count} {seller.count === 1 ? "proposta" : "propostas"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {currency(seller.total)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-white/10 bg-gradient-to-r from-[#134B73] via-[#0f3c5a] to-[#0a2c45] text-white shadow-theme-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white/90">Top 3 Lojas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="h-24 rounded-md bg-white/10 animate-pulse" />
            ) : (
              <ol className="space-y-2 text-sm">
                {topDealers.map((dealer, index) => (
                  <li
                    key={`${dealer.dealerId}-${index}`}
                    className="flex items-center justify-between rounded-md border border-white/15 bg-white/10 px-3 py-2 text-white transition-colors hover:bg-white/15"
                  >
                    <div>
                      <p className="font-semibold">
                        {index + 1}º {dealer.name}
                      </p>
                      <p className="text-xs text-slate-300">
                        {dealer.count} {dealer.count === 1 ? "proposta" : "propostas"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {currency(dealer.total)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-white/10 bg-gradient-to-r from-[#134B73] via-[#0f3c5a] to-[#0a2c45] text-white shadow-theme-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white/90">Últimas 5 Propostas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="h-24 rounded-md bg-white/10 animate-pulse" />
            ) : lastProposals.length === 0 ? (
              <p className="text-sm text-slate-300">
                Nenhuma proposta encontrada.
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                {lastProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex items-center justify-between rounded-md border border-white/15 bg-white/10 px-3 py-2 text-white transition-colors hover:bg-white/15"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        #{proposal.id} · {proposal.customerName}
                      </p>
                      <p className="text-xs text-slate-300">
                        {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <StatusBadge
                      className={cn(
                        "shadow-none px-2 py-0.5 text-[10px] font-semibold",
                        statusBadgeConfig[proposal.status],
                      )}
                    >
                      {statusLabel[proposal.status]}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
