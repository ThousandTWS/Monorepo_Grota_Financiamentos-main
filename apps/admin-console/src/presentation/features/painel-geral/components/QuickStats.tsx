"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FileText, Clock3, CheckCircle2, CircleOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/layout/components/ui/card";
import { fetchProposals } from "@/application/services/Proposals/proposalService";
import { Proposal, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { cn } from "@/lib/utils";
import { getAllSellers, Seller } from "@/application/services/Seller/sellerService";
import { getAllLogistics } from "@/application/services/Logista/logisticService";
import { StatusBadge } from "../../logista/components/status-badge";

type StatusPanel = {
  key: ProposalStatus | "REVIEW";
  title: string;
  accent: string;
  icon: React.ReactNode;
  statuses: ProposalStatus[];
};

const PANELS: StatusPanel[] = [
  {
    key: "SUBMITTED",
    title: "Propostas Enviadas",
    accent: "from-sky-500/70 to-sky-400/40 text-sky-900 dark:text-sky-50",
    icon: <FileText className="h-5 w-5" />,
    statuses: ["SUBMITTED"],
  },
  {
    key: "PENDING",
    title: "Em Análise",
    accent: "from-amber-400/70 to-amber-300/40 text-amber-900 dark:text-amber-50",
    icon: <Clock3 className="h-5 w-5" />,
    statuses: ["PENDING"],
  },
  {
    key: "APPROVED",
    title: "Aprovadas",
    accent: "from-emerald-400/70 to-emerald-300/40 text-emerald-900 dark:text-emerald-50",
    icon: <CheckCircle2 className="h-5 w-5" />,
    statuses: ["APPROVED"],
  },
  {
    key: "REJECTED",
    title: "Reprovadas",
    accent: "from-rose-400/70 to-rose-300/40 text-rose-900 dark:text-rose-50",
    icon: <CircleOff className="h-5 w-5" />,
    statuses: ["REJECTED"],
  },
];

const currency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);

export function QuickStats() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [dealers, setDealers] = useState<{ id: number; fullName?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  const summary = useMemo(() => {
    const base = PANELS.map((panel) => ({
      key: panel.key,
      title: panel.title,
      accent: panel.accent,
      icon: panel.icon,
      count: 0,
      total: 0,
    }));

    const map = Object.fromEntries(base.map((item) => [item.key, item]));

    proposals.forEach((proposal) => {
      const target = PANELS.find((panel) => panel.statuses.includes(proposal.status));
      if (!target) return;
      map[target.key].count += 1;
      map[target.key].total += proposal.financedValue ?? 0;
    });

    return Object.values(map);
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
    SUBMITTED: "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-500/40",
    PENDING: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-500/40",
    APPROVED: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/40",
    REJECTED: "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-500/40",
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
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card
            key={item.key}
            className="overflow-hidden border border-border/60 shadow-sm"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg bg-gradient-to-r px-2.5 py-1 text-xs font-semibold",
                    item.accent,
                  )}
                >
                  {item.icon}
                </span>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <div className="h-20 rounded-md bg-muted animate-pulse" />
              ) : (
                <>
                  <div className="text-3xl font-bold">{item.count}</div>
                  <p className="text-sm text-muted-foreground">
                    {item.count === 1 ? "proposta" : "propostas"} · {currency(item.total)}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Top 3 Vendedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="h-24 rounded-md bg-muted animate-pulse" />
            ) : (
              <ol className="space-y-2 text-sm">
                {topSellers.map((seller, index) => (
                  <li
                    key={`${seller.sellerId}-${index}`}
                    className="flex items-center justify-between rounded-md border border-border/50 bg-muted/40 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold">
                        {index + 1}º {seller.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {seller.count} {seller.count === 1 ? "proposta" : "propostas"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {currency(seller.total)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Top 3 Lojas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="h-24 rounded-md bg-muted animate-pulse" />
            ) : (
              <ol className="space-y-2 text-sm">
                {topDealers.map((dealer, index) => (
                  <li
                    key={`${dealer.dealerId}-${index}`}
                    className="flex items-center justify-between rounded-md border border-border/50 bg-muted/40 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold">
                        {index + 1}º {dealer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dealer.count} {dealer.count === 1 ? "proposta" : "propostas"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {currency(dealer.total)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Últimas 5 Propostas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="h-24 rounded-md bg-muted animate-pulse" />
            ) : lastProposals.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma proposta encontrada.
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                {lastProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex items-center justify-between rounded-md border border-border/50 bg-muted/40 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        #{proposal.id} · {proposal.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
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