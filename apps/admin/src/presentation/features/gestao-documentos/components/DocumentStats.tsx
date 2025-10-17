"use client";
import React from "react";
import { Card, CardContent } from "@/presentation/layout/components/ui/card";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  subtitle?: string;
}

function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  subtitle,
}: StatsCardProps) {
  return (
    <Card
      className="overflow-hidden border border-border/40 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
    >
      <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div>
              <p className="text-3xl font-bold leading-tight">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div
            className={cn(
              "p-3 md:p-4 rounded-xl flex items-center justify-center transition-colors duration-300",
              bgColor
            )}
          >
            <Icon className={cn("h-6 w-6 md:h-7 md:w-7", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DocumentStatsProps {
  totalDocuments: number;
  pendingCount: number;
  inReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  avgProcessingTime?: number;
}

export function DocumentStats({
  totalDocuments,
  pendingCount,
  inReviewCount,
  approvedCount,
  rejectedCount,
  avgProcessingTime = 3.2,
}: DocumentStatsProps) {
  const stats = [
    {
      title: "Total de Documentos",
      value: totalDocuments,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      subtitle: "Recebidos hoje",
    },
    {
      title: "Pendentes",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      subtitle: "Aguardando análise",
    },
    {
      title: "Em Análise",
      value: inReviewCount,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      subtitle: "Sendo processados",
    },
    {
      title: "Aprovados",
      value: approvedCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      subtitle: "Finalizados",
    },
    {
      title: "Reprovados",
      value: rejectedCount,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      subtitle: "Necessitam reenvio",
    },
    {
      title: "Tempo Médio",
      value: avgProcessingTime,
      icon: TrendingUp,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950",
      subtitle: "Dias para aprovação",
    },
  ];

  return (
    <div
      className="
        grid gap-4
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-3
        xl:grid-cols-6
        2xl:grid-cols-6
        transition-all
      "
    >
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
