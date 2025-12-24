"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { ApexOptions } from "apexcharts";
import { fetchProposals } from "@/application/services/Proposals/proposalService";
import { Proposal } from "@/application/core/@types/Proposals/Proposal";
import { Loader2 } from "lucide-react";
import { StatusBadge } from "../../logista/components/status-badge";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function FinancingChart() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchProposals();
        if (mounted) {
          setProposals(data);
          setError(null);
        }
      } catch (err) {
        console.error("Erro ao carregar financiamentos:", err);
        if (mounted) {
          setError("Não foi possível carregar os financiamentos.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const months = useMemo(
    () => ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    []
  );

  const { approvedSeries, pendingSeries } = useMemo(() => {
    const base = Array(12).fill(0);
    const approved = [...base];
    const pending = [...base];

    proposals.forEach((proposal) => {
      const date = new Date(proposal.createdAt);
      if (Number.isNaN(date.getTime())) return;

      const monthIndex = date.getMonth();
      const value = proposal.financedValue ?? 0;

      if (proposal.status === "APPROVED") {
        approved[monthIndex] += value;
      } else if (proposal.status === "PENDING" || proposal.status === "SUBMITTED") {
        pending[monthIndex] += value;
      }
    });

    return { approvedSeries: approved, pendingSeries: pending };
  }, [proposals]);

  const series = useMemo(
    () => [
      {
        name: "Financiamentos Aprovados",
        data: approvedSeries,
      },
      {
        name: "Financiamentos Pendentes",
        data: pendingSeries,
      },
    ],
    [approvedSeries, pendingSeries]
  );

  const hasData = useMemo(
    () => series.some((s) => s.data.some((v) => v > 0)),
    [series]
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
        fontFamily: "Inter, sans-serif",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      colors: ["#1B5FA0", "#9FCDED"],
      xaxis: {
        categories: months,
        labels: {
          style: {
            colors: "#64748B",
            fontSize: "15px",
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
          style: {
            colors: "#64748B",
            fontSize: "12px",
          },
          formatter: (value) => `R$ ${(value / 1000).toFixed(0)}k`,
        },
      },
      grid: {
        borderColor: "#E2E8F0",
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (value) =>
            `R$ ${value.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
        },
      },
    }),
    [months]
  );

  return (
    <Card className="w-full" data-oid="189d-0k">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" data-oid="6a3.h_r">
        <CardTitle data-oid="dne3nk2">Volume de Financiamentos</CardTitle>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="ativo" className="shadow-none">
            Financiamentos Aprovados
          </StatusBadge>
          <StatusBadge status="pendente" className="shadow-none">
            Financiamentos Pendentes
          </StatusBadge>
        </div>
      </CardHeader>
      <CardContent className="min-h-[380px]" data-oid="km-v1cx">
        {loading ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando financiamentos...
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        ) : hasData ? (
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            data-oid="16zn695"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Nenhum financiamento encontrado para exibir.
          </div>
        )}
      </CardContent>
    </Card>
  );
}