"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { Button } from "@/presentation/layout/components/ui/button";
import { ApexOptions } from "apexcharts";
import { fetchProposals } from "@/application/services/Proposals/proposalService";
import { Proposal, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { Loader2, RefreshCw } from "lucide-react";
import { StatusBadge } from "../../logista/components/status-badge";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type FunnelStage = {
  label: string;
  value: number;
};

const STATUS_ORDER: ProposalStatus[] = ["SUBMITTED", "PENDING", "APPROVED", "REJECTED"];

const DEFAULT_STAGES: FunnelStage[] = [
  { label: "Propostas Recebidas", value: 0 },
  { label: "Em Análise", value: 0 },
  { label: "Pré-Aprovadas", value: 0 },
  { label: "Aprovadas", value: 0 },
  { label: "Finalizadas", value: 0 },
];

const FUNNEL_COLORS = ["#0F4C81", "#1560A1", "#1C76BF", "#4B95D3", "#7BB4E5"];

const enforceDescending = (stages: FunnelStage[]): FunnelStage[] => {
  let previous = stages.length > 0 ? stages[0].value : 0;
  return stages.map((stage, index) => {
    if (index === 0) {
      previous = stage.value;
      return stage;
    }
    const normalized = Math.max(0, Math.min(stage.value, previous));
    previous = normalized;
    return { ...stage, value: normalized };
  });
};

const buildFunnelFromProposals = (proposals: Proposal[]): FunnelStage[] => {
  const totals: Record<ProposalStatus, number> = STATUS_ORDER.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<ProposalStatus, number>,
  );

  proposals.forEach((proposal) => {
    totals[proposal.status] = (totals[proposal.status] ?? 0) + 1;
  });

  const received = proposals.length;
  const analysis = totals.SUBMITTED + totals.PENDING;
  const preApproved = totals.PENDING;
  const approved = totals.APPROVED;
  const finalized = Math.max(0, approved - Math.floor(totals.REJECTED / 2));

  return enforceDescending([
    { label: "Propostas Recebidas", value: received },
    { label: "Em Análise", value: analysis },
    { label: "Pré-Aprovadas", value: preApproved },
    { label: "Aprovadas", value: approved },
    { label: "Finalizadas", value: finalized },
  ]);
};

export function ConversionFunnel() {
  const [stages, setStages] = useState<FunnelStage[]>(DEFAULT_STAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const syncWithApi = useCallback(async () => {
    setIsLoading(true);
    try {
      const proposals = await fetchProposals();
      setStages(buildFunnelFromProposals(proposals));
      setHasError(false);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("[ConversionFunnel] Falha ao sincronizar", error);
      setStages(DEFAULT_STAGES);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWithApi();
  }, [syncWithApi]);

  const series = useMemo(
    () => [
      {
        name: "Funil de Conversão",
        data: stages.map((stage) => stage.value),
      },
    ],
    [stages],
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
        },
        fontFamily: "Outfit, sans-serif",
        foreColor: "#64748B",
      },
      plotOptions: {
        bar: {
          borderRadius: 12,
          horizontal: true,
          distributed: true,
          barHeight: "70%",
          isFunnel: true,
        },
      },
      colors: FUNNEL_COLORS,
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.35,
          gradientToColors: ["#1B5FA0", "#2A78BB", "#3E92D6", "#67ACE6", "#9FCDED"],
          stops: [0, 100],
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["#F8FAFC"],
      },
      dataLabels: {
        enabled: true,
        formatter: (value) => `${Number(value).toLocaleString("pt-BR")}`,
        dropShadow: {
          enabled: true,
        },
        style: {
          fontSize: "12px",
          fontWeight: 700,
          colors: ["#0F172A"],
        },
        background: {
          enabled: true,
          foreColor: "#ffff",
          padding: 6,
          borderRadius: 8,
          borderWidth: 0,
          opacity: 0.92,
        },
      },
      xaxis: {
        categories: stages.map((stage) => stage.label),
        labels: {
          formatter: (value) => `${Number(value).toLocaleString("pt-BR")}`,
          style: {
            colors: "#94A3B8",
            fontSize: "11px",
          },
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: "#334155",
            fontSize: "12px",
            fontWeight: 600,
          },
        },
      },
      tooltip: {
        theme: "light",
        fillSeriesColor: false,
        marker: {
          show: false,
        },
        y: {
          formatter: (value) => `${value.toLocaleString("pt-BR")} propostas`,
          title: {
            formatter: () => "",
          },
        },
      },
      legend: {
        show: true,
      },
      grid: {
        show: true,
        padding: {
          left: 0,
          right: 8,
        },
      },
      states: {
        active: { filter: { type: "lighten", value: 0.05 } },
        hover: { filter: { type: "darken", value: 0.1 } },
      },
    }),
    [stages],
  );

  const total = useMemo(() => stages[0]?.value ?? 0, [stages]);
  const approved = useMemo(() => stages[3]?.value ?? 0, [stages]);
  const finalized = useMemo(() => stages[4]?.value ?? 0, [stages]);
  const approvalRate = total ? Math.round((approved / total) * 100) : 0;
  const finalizationRate = total ? Math.round((finalized / total) * 100) : 0;
  const statusDotClass = isLoading
    ? "bg-amber-400"
    : hasError
      ? "bg-rose-400"
      : "bg-emerald-400";

  return (
    <Card className="w-full overflow-visible border border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b border-border/60 bg-gradient-to-br from-muted/60 via-muted/30 to-background/60">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-semibold text-foreground">Funil de Conversão</CardTitle>
            <p className="text-sm text-muted-foreground max-w-md">
              Acompanhamento das propostas por etapa do funil.
            </p>
          </div>
          <div className="w-full min-w-0 rounded-2xl border border-border/60 bg-background/70 shadow-sm backdrop-blur lg:max-w-[370px]">
            <div className="grid grid-cols-3 divide-x divide-border/60">
              <div className="px-1 py-3.5 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Aprovação
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground tracking-tight">
                  {approvalRate}
                  <span className="text-xs text-muted-foreground">%</span>
                </p>
              </div>
              <div className="px-1 py-3.5 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Finalizado
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground tracking-tight">
                  {finalizationRate}
                  <span className="text-xs text-muted-foreground">%</span>
                </p>
              </div>
              <div className="px-3 py-3.5 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Total
                </p>
                <p className="mt-1 text-xl font-semibold text-foreground tracking-tight">
                  {total}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <StatusBadge
              status={
                isLoading ? "pendente" : hasError ? "inativo" : "ativo"
              }
              className="shadow-none px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
            >
              {isLoading
                ? "Sincronizando"
                : hasError
                  ? "Dados indisponíveis"
                  : "Dados em tempo real"}
            </StatusBadge>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass}`} />
              {lastUpdated
                ? `Atualizado às ${lastUpdated.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Aguardando atualização"}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="h-9 rounded-full border border-border/60 bg-background/70 px-4 text-[11px] font-semibold uppercase tracking-[0.2em]"
            onClick={syncWithApi}
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
      <CardContent>
        {isLoading ? (
          <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Carregando funil...
          </div>
        ) : hasError ? (
          <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
            Não foi possível carregar o funil no momento.
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={360}
          />
        )}
      </CardContent>
    </Card>
  );
}
