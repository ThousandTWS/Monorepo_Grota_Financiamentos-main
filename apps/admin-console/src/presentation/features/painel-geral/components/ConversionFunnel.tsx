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
          show: false,
        },
        fontFamily: "Inter, sans-serif",
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: true,
          distributed: true,
          barHeight: "75%",
          isFunnel: true,
        },
      },
      colors: ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"],
      dataLabels: {
        enabled: true,
        formatter: function (_val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        dropShadow: {
          enabled: false,
        },
        style: {
          fontSize: "13px",
          fontWeight: 600,
          colors: ["#fff"],
        },
      },
      xaxis: {
        categories: stages.map((stage) => stage.label),
        labels: {
          formatter: (value) => `${Number(value).toLocaleString("pt-BR")}`,
          style: {
            colors: "#64748B",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (value) => `${value.toLocaleString("pt-BR")} propostas`,
          title: {
            formatter: () => "",
          },
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
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

  return (
    <Card className="w-full overflow-hidden border border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-4 bg-muted/40">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">Funil de Conversão</CardTitle>
            <p className="text-sm text-muted-foreground">
              Acompanhamento das propostas por etapa do funil.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 shadow-sm min-w-[120px] text-right">
              <p className="text-[11px] uppercase tracking-wide">Aprovação</p>
              <p className="text-sm font-semibold text-foreground">{approvalRate}%</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 shadow-sm min-w-[120px] text-right">
              <p className="text-[11px] uppercase tracking-wide">Finalização</p>
              <p className="text-sm font-semibold text-foreground">{finalizationRate}%</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 shadow-sm min-w-[120px] text-right">
              <p className="text-[11px] uppercase tracking-wide">Total</p>
              <p className="text-sm font-semibold text-foreground">{total}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <StatusBadge
              status={
                isLoading ? "pendente" : hasError ? "inativo" : "ativo"
              }
              className="shadow-none px-3 py-1 text-[11px] uppercase tracking-wide"
            >
              {isLoading
                ? "Sincronizando"
                : hasError
                  ? "Dados indisponíveis"
                  : "Dados em tempo real"}
            </StatusBadge>
            <span>
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
            className="h-9"
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
