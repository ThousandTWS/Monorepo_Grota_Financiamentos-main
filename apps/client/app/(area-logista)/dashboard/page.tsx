"use client";

import { useState } from "react";
import { useDashboardBreadcrumb } from "@/src/application/core/hooks/useBreadcrumb";
import { dashboardPieData, dashboardLineDataMeses, dashboardLineDataDias } from "../../../src/presentation/layout/dashboard/data/dashboardCharts";
import { useDashboardData } from "../../../src/application/core/hooks/useDashboardData";
import { IndicatorCard } from "../../../src/presentation/layout/dashboard/cards/IndicatorCard";
import { StatusChart } from "../../../src/presentation/layout/dashboard/cards/StatusChart";
import { EvolutionChart } from "../../../src/presentation/layout/dashboard/cards/EvolutionChart";
import { FinancingRateCard } from "../../../src/presentation/layout/dashboard/cards/FinancingRateCard";


export default function DashboardPage() {
  useDashboardBreadcrumb();
  
  const [periodo, setPeriodo] = useState("meses");
  const { indicators, getChartData } = useDashboardData();
  const lineData = periodo === "meses" ? dashboardLineDataMeses : dashboardLineDataDias;

  return (
    <div className="p-4 md:p-8 w-full mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Visão Geral</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicators.map((item, index) => (
          <IndicatorCard
            key={item.name}
            name={item.name}
            value={item.value}
            percentageChange={item.percentageChange}
            changeType={item.changeType}
            chartData={getChartData(item.name)}
            colorIndex={index}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart data={dashboardPieData} />
        <EvolutionChart 
          data={lineData} 
          periodo={periodo} 
          onPeriodoChange={setPeriodo} 
        />
      </div>
      
      <FinancingRateCard rate="1,45% a.m." />
    </div>
  );
}