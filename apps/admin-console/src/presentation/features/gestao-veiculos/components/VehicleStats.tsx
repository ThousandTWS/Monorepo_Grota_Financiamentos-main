"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Car,
  CircleDollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/presentation/layout/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  gradient: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  gradient,
  subtitle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      <Card
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/40 transition-all duration-300",
          "hover:shadow-xl hover:border-border/60 bg-gradient-to-br from-background to-muted/30 h-full"
        )}
      >
        {/* Gradiente de brilho sutil */}
        <div
          className={cn("absolute inset-0 opacity-25 blur-2xl", gradient)}
        />

        <CardContent className="relative flex flex-col justify-between p-5 sm:p-6 h-full">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="p-3 rounded-xl backdrop-blur-sm border border-border/40 bg-card/60 flex items-center justify-center">
              <Icon className={cn("h-6 w-6 sm:h-7 sm:w-7", color)} />
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-sm sm:text-base font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground break-words">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface VehicleStatsProps {
  totalVehicles: number;
  availableCount: number;
  inFinancingCount: number;
  soldCount: number;
  reservedCount: number;
  totalValue: number;
}

export function VehicleStats({
  totalVehicles,
  availableCount,
  inFinancingCount,
  soldCount,
  reservedCount,
  totalValue,
}: VehicleStatsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const stats = [
    {
      title: "Total de Veículos",
      value: totalVehicles,
      icon: Car,
      color: "text-blue-600",
      gradient: "from-blue-500/20 via-transparent to-transparent",
      subtitle: "No estoque",
    },
    {
      title: "Disponíveis",
      value: availableCount,
      icon: CheckCircle,
      color: "text-green-600",
      gradient: "from-green-500/20 via-transparent to-transparent",
      subtitle: "Para venda",
    },
    {
      title: "Em Financiamento",
      value: inFinancingCount,
      icon: Clock,
      color: "text-amber-600",
      gradient: "from-amber-500/20 via-transparent to-transparent",
      subtitle: "Em processo",
    },
    {
      title: "Vendidos",
      value: soldCount,
      icon: CircleDollarSign,
      color: "text-emerald-600",
      gradient: "from-emerald-500/20 via-transparent to-transparent",
      subtitle: "Este mês",
    },
    {
      title: "Reservados",
      value: reservedCount,
      icon: AlertCircle,
      color: "text-purple-600",
      gradient: "from-purple-500/20 via-transparent to-transparent",
      subtitle: "Aguardando",
    },
    {
      title: "Valor Total",
      value: formatCurrency(totalValue),
      icon: CircleDollarSign,
      color: "text-cyan-600",
      gradient: "from-cyan-500/20 via-transparent to-transparent",
      subtitle: "Estoque",
    },
  ];

  return (
    <div
      className={cn(
        "grid gap-4 w-full",
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      )}
    >
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
