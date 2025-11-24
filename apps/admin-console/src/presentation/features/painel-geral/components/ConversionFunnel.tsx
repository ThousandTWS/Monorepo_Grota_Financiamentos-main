"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

  const syncWithApi = useCallback(async () => {
    setIsLoading(true);
    try {
      const proposals = await fetchProposals();
      setStages(buildFunnelFromProposals(proposals));
      setHasError(false);
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
    }),
    [stages],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Funil de Conversão</CardTitle>
        <p className="text-xs text-muted-foreground">
          {isLoading
            ? "Sincronizando com API..."
            : hasError
              ? "Exibindo dados indisponíveis no momento"
              : "Atualizado em tempo real"}
        </p>
      </CardHeader>
      <CardContent>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </CardContent>
    </Card>
  );
}
