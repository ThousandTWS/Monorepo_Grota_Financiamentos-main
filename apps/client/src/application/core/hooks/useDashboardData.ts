import { dashboardIndicators } from "../../../presentation/layout/dashboard/data/dashboardCharts";

interface IndicatorData {
  name: string;
  value: string;
  percentageChange: string;
  changeType: "positive" | "negative";
}

const previousIndicators = [
  { label: "Total de Propostas", value: 1110 },
  { label: "Aprovadas", value: 800 },
  { label: "Reprovadas", value: 210 },
  { label: "Em Análise", value: 90 },
];

const chartDataByIndicator = {
  "Total de Propostas": [
    { date: "24", value: 1050 }, { date: "25", value: 1080 }, { date: "26", value: 1120 },
    { date: "27", value: 1150 }, { date: "28", value: 1100 }, { date: "29", value: 1130 },
    { date: "30", value: 1160 }, { date: "01", value: 1180 }
  ],
  "Aprovadas": [
    { date: "24", value: 750 }, { date: "25", value: 770 }, { date: "26", value: 790 },
    { date: "27", value: 810 }, { date: "28", value: 780 }, { date: "29", value: 800 },
    { date: "30", value: 820 }, { date: "01", value: 840 }
  ],
  "Reprovadas": [
    { date: "24", value: 200 }, { date: "25", value: 205 }, { date: "26", value: 215 },
    { date: "27", value: 220 }, { date: "28", value: 210 }, { date: "29", value: 215 },
    { date: "30", value: 225 }, { date: "01", value: 230 }
  ],
  "Em Análise": [
    { date: "24", value: 100 }, { date: "25", value: 105 }, { date: "26", value: 115 },
    { date: "27", value: 120 }, { date: "28", value: 110 }, { date: "29", value: 115 },
    { date: "30", value: 115 }, { date: "01", value: 110 }
  ]
};

function calcPercent(current: number, previous: number): number {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function useDashboardData() {
  const indicators: IndicatorData[] = dashboardIndicators.map((current, index) => {
    const previous = previousIndicators[index];
    const change = current.value - previous.value;
    const percentChange = calcPercent(current.value, previous.value);
    
    return {
      name: current.label,
      value: current.value.toLocaleString(),
      percentageChange: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`,
      changeType: change >= 0 ? "positive" : "negative",
    };
  });

  const getChartData = (indicatorName: string) => {
    return chartDataByIndicator[indicatorName as keyof typeof chartDataByIndicator] || [];
  };

  return {
    indicators,
    getChartData,
  };
}