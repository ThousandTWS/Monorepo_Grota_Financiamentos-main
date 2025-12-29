/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import * as echarts from "echarts/core";
import {
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import { BarChart as EChartsBarChart, LineChart as EChartsLineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

import dashboardServices, {
  type DashboardChannelMixSegment,
  type DashboardSnapshotResponse,
  type DashboardTimeframe,
} from "@/application/services/DashboardServices/DashboardServices";
import { Badge } from "@/presentation/ui/badge";
import { Button } from "@/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/presentation/ui/chart";
import { Skeleton } from "@/presentation/ui/skeleton";
import { RealtimeBridgePanel } from "./_components/RealtimeBridgePanel";

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  EChartsBarChart,
  EChartsLineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const KPI_ICON_MAP = {
  wallet: Wallet,
  trending: TrendingUp,
  approvals: ShieldCheck,
  shield: ShieldCheck,
  sla: ShieldCheck,
} as const;

type UiKpiCard =
  DashboardSnapshotResponse["kpis"][number] & { icon: typeof Wallet };

const performanceChartConfig = {
  volume: {
    label: "Volume financiado",
    color: "hsl(215 85% 63%)",
  },
  approvals: {
    label: "Taxa de aprovação",
    color: "hsl(160 84% 39%)",
  },
} satisfies ChartConfig;

const DEFAULT_CHANNEL_COLORS = [
  "hsl(214 85% 60%)",
  "hsl(199 89% 48%)",
  "hsl(161 94% 30%)",
  "hsl(32 95% 45%)",
  "hsl(268 85% 60%)",
  "hsl(9 93% 62%)",
];

const timeframeFilters = [
  { label: "Últimos 7 dias", value: "7d" },
  { label: "Últimos 30 dias", value: "30d" },
  { label: "Último trimestre", value: "quarter" },
] as const;

const statusClasses: Record<string, string> = {
  Aprovada:
    "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-100 dark:border-emerald-500/20",
  "Em análise":
    "bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-500/10 dark:text-sky-100 dark:border-sky-500/20",
  "Pendente documentação":
    "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-100 dark:border-amber-500/20",
  Recusada:
    "bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-100 dark:border-rose-500/20",
  "Em liquidação":
    "bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-100 dark:border-indigo-500/20",
};

const toneClasses: Record<"success" | "warning" | "info", string> = {
  success:
    "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30 backdrop-blur",
  warning:
    "bg-amber-500/15 text-amber-100 border border-amber-400/30 backdrop-blur",
  info: "bg-sky-500/15 text-sky-100 border border-sky-400/30 backdrop-blur",
};

const buildChannelMixConfig = (
  segments: DashboardChannelMixSegment[]
): ChartConfig => {
  if (!segments.length) {
    return {};
  }

  return segments.reduce((config, segment, index) => {
    config[segment.key] = {
      label: segment.label,
      color: DEFAULT_CHANNEL_COLORS[index % DEFAULT_CHANNEL_COLORS.length],
    };
    return config;
  }, {} as ChartConfig);
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message
  ) {
    return (
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message ?? "Falha ao consultar o backend."
    );
  }

  if (typeof error === "object" && error && "message" in error) {
    const message = (error as { message?: string }).message;
    if (message) return message;
  }

  return "Não foi possível carregar o dashboard.";
};

const LoadingCardSkeleton = () => (
  <Card className="border-border/60">
    <CardContent className="space-y-4 pt-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3 w-24" />
    </CardContent>
  </Card>
);

const LoadingHighlightSkeleton = () => (
  <div className="rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-md">
    <Skeleton className="h-3 w-20 bg-white/40" />
    <Skeleton className="mt-3 h-6 w-24 bg-white/60" />
    <Skeleton className="mt-2 h-4 w-28 bg-white/40" />
  </div>
);

const ListCardSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-5">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="space-y-2">
        <div className="flex items-center justify-between text-sm font-medium">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="space-y-1 text-right">
            <Skeleton className="ml-auto h-4 w-24" />
            <Skeleton className="ml-auto h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-2 rounded-full" />
      </div>
    ))}
  </div>
);

const ChartSkeleton = ({ height = 240 }: { height?: number }) => (
  <Skeleton
    className="w-full rounded-xl border border-dashed border-border/60"
    style={{ height }}
  />
);

const MixedChart = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    const option = {
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
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        data: ["Evaporation", "Precipitation", "Temperature"],
      },
      xAxis: [
        {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisPointer: {
            type: "shadow",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Precipitation",
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: "{value} ml",
          },
        },
        {
          type: "value",
          name: "Temperature",
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
            formatter: "{value} °C",
          },
        },
      ],
      series: [
        {
          name: "Evaporation",
          type: "bar",
          tooltip: {
            valueFormatter: (value: number) => `${value} ml`,
          },
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        },
        {
          name: "Precipitation",
          type: "bar",
          tooltip: {
            valueFormatter: (value: number) => `${value} ml`,
          },
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        },
        {
          name: "Temperature",
          type: "line",
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: (value: number) => `${value} °C`,
          },
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} className="h-[220px] lg:h-[240px]" />;
};

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <table className="w-full min-w-[620px] text-sm">
    <thead className="text-muted-foreground">
      <tr className="border-b border-border/60 text-left">
        {Array.from({ length: 6 }).map((_, index) => (
          <th key={index} className="pb-3 pr-4 font-medium">
            <Skeleton className="h-4 w-24" />
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: rows }).map((_, index) => (
        <tr
          key={index}
          className="border-b border-border/40 text-left [&_td]:py-3 [&_td]:pr-4"
        >
          {Array.from({ length: 6 }).map((__, cellIndex) => (
            <td key={cellIndex}>
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const EmptyState = ({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) => (
  <div
    className={`text-muted-foreground flex items-center justify-center text-sm ${className}`}
  >
    {message}
  </div>
);

export default function Page() {
  const [activeTimeframe, setActiveTimeframe] =
    useState<DashboardTimeframe>("30d");
  const [snapshot, setSnapshot] = useState<DashboardSnapshotResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSnapshot = async () => {
      setLoading(true);
      setError(null);
      setSnapshot(null);

      try {
        const data = await dashboardServices.getSnapshot(activeTimeframe);
        if (isMounted) {
          setSnapshot(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSnapshot();

    return () => {
      isMounted = false;
    };
  }, [activeTimeframe]);

  const monthlyPerformance = snapshot?.monthlyPerformance ?? [];
  const channelMix = snapshot?.channelMix ?? [];
  const partnerDealers = snapshot?.partnerDealers ?? [];
  const governanceAlerts = snapshot?.governanceAlerts ?? [];
  const executiveHighlights = snapshot?.executiveHighlights ?? [];
  const proposalPipeline = snapshot?.pipeline ?? [];
//@ts-ignore
  const kpiCards = useMemo<UiKpiCard[]>(() => {
    const kpis = snapshot?.kpis ?? [];
    return kpis.map((kpi) => ({
      ...kpi,
      icon: KPI_ICON_MAP[kpi.icon as keyof typeof KPI_ICON_MAP] ?? Wallet,
    }));
  }, [snapshot?.kpis]);

  const channelMixConfig = useMemo(
    () => buildChannelMixConfig(channelMix),
    [channelMix]
  );

  const pipelineInsights = useMemo(() => {
    const inAnalysis = proposalPipeline.filter(
      (proposal) => proposal.status === "Em análise"
    ).length;
    const pendingCritical = proposalPipeline.filter((proposal) =>
      ["Pendente documentação", "Em liquidação"].includes(proposal.status)
    ).length;
    const approved = proposalPipeline.filter(
      (proposal) => proposal.status === "Aprovada"
    ).length;

    return [
      {
        label: "Em análise",
        value: inAnalysis,
        helper: "prioridade squad crédito",
      },
      {
        label: "Pendências críticas",
        value: pendingCritical,
        helper: "follow-up em até 12h",
      },
      {
        label: "Aprovadas",
        value: approved,
        helper: "aguardando assinatura",
      },
    ];
  }, [proposalPipeline]);

  const meta = snapshot?.meta ?? {};
  const lastUpdateLabel = meta.lastUpdateLabel ?? "Atualizado às 10h45";
  const timeframeLabel = meta.timeframeLabel ?? "Ciclo fiscal 2024";
  const portfolioLabel =
    meta.activePortfolioLabel ?? "Carteira ativa • 312 propostas";
  const slaLabel = meta.slaLabel ?? "SLA médio 3h48 • Squad Daycoval";
  const goalLabel = meta.goalLabel ?? "Meta trimestral";
  const goalValue = meta.goalValue ?? "R$ 12,5 mi";
  const goalDeltaLabel =
    meta.goalDeltaLabel ?? "+6,2% sobre cenário base";
  const portfolioMonitorLabel =
    meta.portfolioMonitorLabel ?? "Carteira em acompanhamento";
  const portfolioValue = meta.portfolioValue ?? "R$ 21,8 mi";
  const portfolioDetail =
    meta.portfolioDetail ?? "42 contratos • inadimplência em 0,92%";
  const portfolioInsight =
    meta.portfolioInsight ?? "Top mix: SUVs (37%) • Picapes (33%).";
  const complianceInsight =
    meta.complianceInsight ?? "0 ocorrências críticas nos últimos 45 dias.";

  const isInitialLoading = loading && !snapshot;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="border-b border-border/60">
            <div>
              <CardTitle>Ritmo de aprovação semanal</CardTitle>
              <CardDescription>
                Evolução da taxa de aprovação consolidada
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isInitialLoading ? (
              <ChartSkeleton />
            ) : monthlyPerformance.length ? (
              <MixedChart />

            ) : (
              <EmptyState
                message="Sem histórico disponível para o período selecionado."
                className="h-[240px]"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="border-b border-border/60">
            <div>
              <CardTitle>Mix de originação</CardTitle>
              <CardDescription>
                Participação por frente comercial
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 lg:grid-cols-[1fr_auto]">
            {isInitialLoading ? (
              <ChartSkeleton height={220} />
            ) : channelMix.length ? (
              <>
                <ChartContainer
                  config={channelMixConfig}
                  className="mx-auto h-[180px] w-full max-w-[220px]"
                >
                  <PieChart>
                    <Pie
                      data={channelMix}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {channelMix.map((segment) => (
                        <Cell
                          key={segment.key}
                          fill={`var(--color-${segment.key})`}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel indicator="dot" />}
                    />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-3">
                  {channelMix.map((segment) => (
                    <div
                      key={segment.key}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block size-3 rounded-full"
                          style={{
                            backgroundColor: `var(--color-${segment.key})`,
                          }}
                        />
                        <p className="text-sm font-medium text-foreground/90">
                          {segment.label}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {segment.value}%
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                message="Sem composição de canal registrada."
                className="h-[220px]"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="border-b border-border/60">
            <div>
              <CardTitle>Volume mensal consolidado</CardTitle>
              <CardDescription>Comparativo em milhões de reais</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isInitialLoading ? (
              <ChartSkeleton />
            ) : monthlyPerformance.length ? (
              <ChartContainer
                config={performanceChartConfig}
                className="h-[220px] lg:h-[240px]"
              >
                <BarChart data={monthlyPerformance} margin={{ left: 4, right: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    tickFormatter={(value) => `R$ ${value.toFixed(1)} mi`}
                  />
                  <ChartTooltip
                    cursor={false}
                    //@ts-ignore
                    content={<ChartTooltipContent indicator="bar" />}
                  />
                  <Bar
                    dataKey="volume"
                    fill="var(--color-volume)"
                    radius={[8, 8, 0, 0]}
                    name="Volume financiado"
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyState
                message="Sem volume consolidado para este período."
                className="h-[240px]"
              />
            )}
          </CardContent>
        </Card>
      </div>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#134B73] via-[#134B73] to-[#134B73] px-6 py-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute inset-0 opacity-40 blur-3xl">
          <div className="mx-auto h-full w-full max-w-2xl bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_65%)]" />
        </div>
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            
            {/* Bloco Painel Executivo */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
              <Badge className="bg-white/15 text-white uppercase tracking-[0.35em]">
                Painel executivo
              </Badge>
              <span className="tracking-[0.2em]">
                {lastUpdateLabel} • {timeframeLabel}
              </span>
            </div>
            {/* Bloco Painel Executivo */}

            <h1 className="text-3xl font-semibold leading-tight lg:text-4xl">
              Governança e performance dos lojistas Grota em tempo real.
            </h1>

            <p className="max-w-2xl text-base text-white/80">
              Consolide aprovações, carteira ativa e conformidade em um único
              cockpit. Indicadores reconciliados a cada 30 minutos com o core
              Daycoval e prontos para o comitê executivo.
            </p>

            <div className="flex flex-wrap gap-2">
              {timeframeFilters.map((filter) => {
                const isActive = filter.value === activeTimeframe;
                return (
                  <Button
                    key={filter.value}
                    size="sm"
                    variant="ghost"
                    disabled={loading && isActive}
                    onClick={() => setActiveTimeframe(filter.value)}
                    className={`rounded-full border border-white/20 px-4 text-xs uppercase tracking-wide backdrop-blur ${
                      isActive
                        ? "bg-white text-slate-900 font-semibold shadow-lg hover:bg-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </div>
            
            {error ? (
              <p className="text-xs font-semibold text-rose-100">{error}</p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {executiveHighlights.length
                ? executiveHighlights.map((highlight) => (
                    <div
                      key={highlight.label}
                      className="rounded-2xl border border-white/20 bg-white/5 p-4 text-white/90 backdrop-blur-md"
                    >
                      <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/60">
                        {highlight.label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {highlight.value}
                      </p>
                      <p className="text-sm text-white/70">{highlight.helper}</p>
                    </div>
                  ))
                : isInitialLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <LoadingHighlightSkeleton key={index} />
                    ))
                  : (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/70 backdrop-blur-md">
                      Sem destaques executivos para o período selecionado.
                    </div>
                  )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/15 text-white shadow-sm">
                {portfolioLabel}
              </Badge>
              <Badge className="bg-white/10 text-white">{slaLabel}</Badge>
            </div>
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-lg">
            <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs uppercase text-white/70">{goalLabel}</p>
              <p className="mt-2 text-3xl font-semibold">{goalValue}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-200">
                <ArrowUpRight className="size-4" /> {goalDeltaLabel}
              </span>
              <p className="mt-4 text-xs text-white/70">
                Cobertura contratada em 42 concessionárias premium.
              </p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-[#0C2B44]/70 p-5 backdrop-blur-lg">
              <p className="text-xs uppercase text-white/70">
                {portfolioMonitorLabel}
              </p>
              <p className="mt-2 text-3xl font-semibold">{portfolioValue}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-white/80">
                {portfolioDetail}
              </span>
              <div className="mt-4 space-y-1 text-xs text-white/70">
                <p>{portfolioInsight}</p>
                <p>{complianceInsight}</p>
              </div>
            </div>
          </div>
        </div>
      </section>




    
    </div>
  );
}
