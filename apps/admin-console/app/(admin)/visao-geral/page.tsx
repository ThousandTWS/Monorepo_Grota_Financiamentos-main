"use client";

import React, { useEffect, useState } from "react";
import { ActivityHeatmap, ConversionFunnel, DealersList, FinancingChart, ForecastChart, MonthlyComparison, QuickStats, RecentActivity, RealtimeBridgePanel, SellersList, StatusDistribution } from "@/presentation/features/painel-geral";
import { Skeleton } from "@/presentation/layout/components/ui/skeleton";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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

      <div className="grid gap-6 lg:grid-cols-2">
        <RealtimeBridgePanel />
        <DealersList />
      </div>

      <SellersList />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>

      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}
