import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { Progress } from "@/presentation/layout/components/ui/progress";
import { TrendingUp, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const goals: Goal[] = [
  {
    id: "1",
    title: "Volume Mensal",
    current: 24500000,
    target: 30000000,
    unit: "R$",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  {
    id: "2",
    title: "Contratos Fechados",
    current: 4150,
    target: 5000,
    unit: "",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-950",
  },
  {
    id: "3",
    title: "NPS Score",
    current: 87,
    target: 90,
    unit: "",
    icon: Zap,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-950",
  },
];

export function GoalsProgress() {
  const formatValue = (value: number, unit: string) => {
    if (unit === "R$") {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    return value.toLocaleString("pt-BR");
  };

  return (
    <Card data-oid="suplrvs">
      <CardHeader data-oid="ng3xl6j">
        <CardTitle data-oid="q-7sn67">Progresso das Metas</CardTitle>
      </CardHeader>
      <CardContent data-oid="_:4ucch">
        <div className="space-y-6" data-oid="fp3v13d">
          {goals.map((goal) => {
            const percentage = Math.min(
              (goal.current / goal.target) * 100,
              100,
            );
            const Icon = goal.icon;

            return (
              <div key={goal.id} className="space-y-3" data-oid="8c0oyk2">
                <div
                  className="flex items-center justify-between"
                  data-oid="tmrh8w."
                >
                  <div className="flex items-center gap-3" data-oid="3yo-z-h">
                    <div
                      className={cn("p-2 rounded-lg", goal.bgColor)}
                      data-oid="tuuyu1w"
                    >
                      <Icon
                        className={cn("h-4 w-4", goal.color)}
                        data-oid="no72kq1"
                      />
                    </div>
                    <div data-oid="g_3.o0c">
                      <p className="text-sm font-semibold" data-oid="78ph5ns">
                        {goal.title}
                      </p>
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="pi99.re"
                      >
                        {formatValue(goal.current, goal.unit)} de{" "}
                        {formatValue(goal.target, goal.unit)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right" data-oid="33.ogm8">
                    <p className="text-lg font-bold" data-oid="vhy:ttu">
                      {percentage.toFixed(1)}%
                    </p>
                    <p
                      className="text-xs text-muted-foreground"
                      data-oid="ie92rtc"
                    >
                      {percentage >= 100 ? "✓ Meta atingida" : "Em progresso"}
                    </p>
                  </div>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  data-oid="kissokf"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
