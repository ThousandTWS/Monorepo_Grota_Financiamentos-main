"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { StatusBadge } from "../../logista/components/status-badge";
import * as echarts from "echarts/core";
import {
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import { BarChart, LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { fetchProposals } from "@/application/services/Proposals/proposalService";
import { Proposal } from "@/application/core/@types/Proposals/Proposal";
import { Loader2 } from "lucide-react";

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

export function FinancingChart() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.EChartsType | null>(null);
  const [isMobile, setIsMobile] = useState(false);
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
          setError("N?o foi poss?vel carregar os financiamentos.");
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

  useEffect(() => {
    const updateMedia = () =>
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);

    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const months = useMemo(
    () => ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    []
  );

  const { approvedSeries, pendingSeries, totalSeries } = useMemo(() => {
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

    const total = approved.map((value, index) => value + pending[index]);

    return { approvedSeries: approved, pendingSeries: pending, totalSeries: total };
  }, [proposals]);

  const hasData = useMemo(
    () => approvedSeries.some((value) => value > 0) || pendingSeries.some((value) => value > 0),
    [approvedSeries, pendingSeries]
  );

  useEffect(() => {
    if (!chartRef.current || loading || error || !hasData) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;
    const option = {
      grid: {
        left: isMobile ? 64 : 40,
        right: isMobile ? 24 : 20,
        top: isMobile ? 64 : 40,
        bottom: isMobile ? 80 : 56,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
      },
      toolbox: {
        feature: {
          dataView: { show: false, readOnly: false },
          magicType: { show: true, type: ["line", "bar"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
        right: isMobile ? 6 : 10,
        top: isMobile ? 6 : 0,
      },
      legend: {
        data: ["Financiamentos Aprovados", "Financiamentos Pendentes", "Total"],
        bottom: isMobile ? 6 : 0,
        itemWidth: isMobile ? 10 : 18,
        itemHeight: isMobile ? 8 : 12,
        textStyle: {
          fontSize: isMobile ? 10 : 12,
        },
      },
      xAxis: [
        {
          type: "category",
          data: months,
          axisPointer: {
            type: "shadow",
          },
          boundaryGap: true,
          axisLabel: {
            fontSize: isMobile ? 10 : 12,
            rotate: isMobile ? 30 : 0,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Volume",
          axisLabel: {
            formatter: (value: number) => `R$ ${(value / 1000).toFixed(0)}k`,
            fontSize: isMobile ? 10 : 12,
          },
          nameTextStyle: {
            fontSize: isMobile ? 10 : 12,
          },
        },
      ],
      series: [
        {
          name: "Financiamentos Aprovados",
          type: "bar",
          tooltip: {
            valueFormatter: (value: number) =>
              `R$ ${value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
          },
          data: approvedSeries,
        },
        {
          name: "Financiamentos Pendentes",
          type: "bar",
          tooltip: {
            valueFormatter: (value: number) =>
              `R$ ${value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
          },
          data: pendingSeries,
        },
        {
          name: "Total",
          type: "line",
          tooltip: {
            valueFormatter: (value: number) =>
              `R$ ${value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
          },
          data: totalSeries,
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [months, approvedSeries, pendingSeries, totalSeries, loading, error, hasData, isMobile]);

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return (
    <Card className="w-full" data-oid="189d-0k">
      <CardHeader
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        data-oid="6a3.h_r"
      >
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
          <div ref={chartRef} className="h-[350px] w-full" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Nenhum financiamento encontrado para exibir.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
