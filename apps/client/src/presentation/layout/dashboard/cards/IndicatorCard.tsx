import { Card, CardContent } from "@/src/presentation/components/ui/card";
import { ChartContainer } from "@/src/presentation/components/ui/chart";
import { AreaChart, Area } from "recharts";
import { cn } from "@/src/application/core/lib/utils";

interface IndicatorCardProps {
  name: string;
  value: string;
  percentageChange: string;
  changeType: "positive" | "negative";
  chartData: Array<{ date: string; value: number }>;
  colorIndex: number;
}

const COLORS = [
  { primary: "#3B82F6" },
  { primary: "#10B981" },
  { primary: "#F59E0B" },
  { primary: "#8B5CF6" }
];

const sanitizeName = (name: string) => {
  return name.replace(/\\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "_").toLowerCase();
};

export function IndicatorCard({ name, value, percentageChange, changeType, chartData, colorIndex }: IndicatorCardProps) {
  const gradientId = `gradient-${sanitizeName(name)}`;
  const isPositive = changeType === "positive";
  const color = COLORS[colorIndex] || COLORS[0];

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{name}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            isPositive 
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          )}>
            <span>{isPositive ? "↗" : "↘"}</span>
            <span>{percentageChange}</span>
          </div>
        </div>
        
        <div className="h-12 -mx-2 -mb-2">
          <ChartContainer className="w-full h-full" config={{ value: { label: name, color: color.primary } }}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area dataKey="value" stroke={color.primary} fill={`url(#${gradientId})`} strokeWidth={2} type="monotone" dot={false} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}