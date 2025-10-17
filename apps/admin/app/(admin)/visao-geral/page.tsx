import { ActivityHeatmap, ConversionFunnel, FinancingChart, ForecastChart, MonthlyComparison, QuickStats, RecentActivity, StatusDistribution } from "@/presentation/features/painel-geral";
import React from "react";

export default function Dashboard() {
  return (
    <div
      className="space-y-6 animate-in fade-in duration-500"
      data-oid="1bk:ed."
    >

      <div className="space-y-2" data-oid="dlyu3j-">
        <h1
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent"
          data-oid="vrh59t9"
        >
          Visão Geral
        </h1>
        <p className="text-muted-foreground" data-oid="e14_6q2">
          Acompanhe os principais indicadores e métricas de performance em tempo
          real
        </p>
      </div>

      <QuickStats data-oid="od:e37m" />

      <div className="grid gap-6 lg:grid-cols-3" data-oid="j5wmoo7">
        <div className="lg:col-span-2" data-oid="-xo.n7c">
          <FinancingChart data-oid="p_3v5hj" />
        </div>
        <div className="lg:col-span-1" data-oid="kbp25_c">
          <StatusDistribution data-oid="m7-15fg" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2" data-oid="hx2pc8v">
        <ForecastChart data-oid="iv6tzyo" />
        <MonthlyComparison data-oid="-hl0-j:" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2" data-oid="c0nd6ji">
        <ConversionFunnel data-oid="mt6yc_-" />
       <RecentActivity data-oid="m.cymte" />
      </div>

      <ActivityHeatmap data-oid="c34tkjn" />
    </div>
  );
}
