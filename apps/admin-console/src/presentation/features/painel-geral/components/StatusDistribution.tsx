"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { ApexOptions } from "apexcharts";
import { fetchProposals } from "@/application/services/Proposals/proposalService";
import { Proposal, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/presentation/layout/components/ui/button";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const STATUS_LABELS: Record<ProposalStatus, string> = {
  SUBMITTED: "Recebidas",
  PENDING: "Em análise",
  APPROVED: "Aprovadas",
  REJECTED: "Rejeitadas",
};

const STATUS_COLORS: Record<ProposalStatus, string> = {
  SUBMITTED: "#3B82F6",
  PENDING: "#F59E0B",
  APPROVED: "#10B981",
  REJECTED: "#EF4444",
};

export function StatusDistribution() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const sync = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchProposals();
      setProposals(data);
      setHasError(false);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("[StatusDistribution] Falha ao sincronizar", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    sync();
  }, [sync]);

  const distribution = useMemo(() => {
    const totals: Record<ProposalStatus, number> = {
      SUBMITTED: 0,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
    };
    proposals.forEach((proposal) => {
      totals[proposal.status] = (totals[proposal.status] ?? 0) + 1;
    });
    return totals;
  }, [proposals]);

  const series = useMemo(
    () => Object.values(distribution),
    [distribution],
  );

  const labels = useMemo(
    () => Object.keys(distribution).map((key) => STATUS_LABELS[key as ProposalStatus]),
    [distribution],
  );

  const colors = useMemo(
    () => Object.keys(distribution).map((key) => STATUS_COLORS[key as ProposalStatus]),
    [distribution],
  );

  const total = useMemo(
    () => series.reduce((acc, value) => acc + value, 0),
    [series],
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        height: 340,
        fontFamily: "Inter, sans-serif",
      },
      labels,
      colors,
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return `${Number(val).toFixed(1)}%`;
        },
        style: {
          fontSize: "12px",
          fontWeight: 600,
        },
        dropShadow: {
          enabled: false,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "13px",
                fontWeight: 600,
                color: "#94a3b8",
                offsetY: 8,
              },
              value: {
                show: true,
                fontSize: "26px",
                fontWeight: 700,
                color: "#0F172A",
                formatter: (val) => `${Number(val).toLocaleString("pt-BR")}`,
              },
              total: {
                show: true,
                label: "Total",
                fontSize: "12px",
                fontWeight: 600,
                color: "#94a3b8",
                formatter: (w) => {
                  const sum = w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0,
                  );
                  return sum.toLocaleString("pt-BR");
                },
              },
            },
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        markers: {
          size: 6,
          shape: "circle" as const,
        },
        itemMargin: {
          horizontal: 14,
          vertical: 6,
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (value) => `${value.toLocaleString("pt-BR")} propostas`,
        },
      },
      stroke: {
        width: 2,
        colors: ["#0F172A"],
      },
    }),
    [labels, colors],
  );

  return (
    <Card className="w-full overflow-hidden border border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-muted/40">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">Distribuição por Status</CardTitle>
          <p className="text-sm text-muted-foreground">
            Propostas agrupadas por etapa do pipeline.
          </p>
          <p className="text-xs text-muted-foreground">
            {lastUpdated
              ? `Atualizado às ${lastUpdated.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Aguardando sincronização"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right text-xs text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{total}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={sync}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[360px]">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando distribuição...
          </div>
        ) : hasError ? (
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar a distribuição no momento.
          </div>
        ) : total === 0 ? (
          <div className="text-sm text-muted-foreground">
            Nenhuma proposta encontrada para exibir.
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={320}
          />
        )}
      </CardContent>
    </Card>
  );
}
