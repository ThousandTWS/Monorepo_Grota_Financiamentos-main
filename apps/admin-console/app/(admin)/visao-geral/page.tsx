"use client";

import { useEffect, useState } from "react";
import { ConversionFunnel, DealersList, FinancingChart, ManagersList, OperatorsList, QuickStats, RecentActivity, SellersList } from "@/presentation/features/painel-geral";
import { Skeleton } from "@/presentation/layout/components/ui/skeleton";

const surfaceClasses =
  "rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md";

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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
      data-oid="1bk:ed."
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:px-8 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
        <QuickStats />

        <div className="grid grid-cols-1 gap-6" data-oid="j5wmoo7">
          <div className={`${surfaceClasses} p-4 sm:p-5`} data-oid="-xo.n7c">
            <FinancingChart data-oid="p_3v5hj" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" data-oid="c0nd6ji">
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <ConversionFunnel data-oid="mt6yc_-" />
          </div>
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <RecentActivity data-oid="m.cymte" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <ManagersList />
          </div>
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <OperatorsList />
          </div>
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <SellersList />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className={`${surfaceClasses} p-4 sm:p-5 lg:col-span-2`}>
            <Skeleton className="h-72 rounded-2xl" />
          </div>
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <Skeleton className="h-72 rounded-2xl" />
          </div>
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <div className={`${surfaceClasses} p-4 sm:p-5`}>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>

        <div className={`${surfaceClasses} p-4 sm:p-5`}>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
        <div className={`${surfaceClasses} p-4 sm:p-5`}>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
