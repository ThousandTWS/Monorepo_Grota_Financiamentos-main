"use client"
import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { getAllSellers } from "@/application/services/Seller/sellerService";

export function QuickStats() {
  const [sellersCount, setSellersCount] = useState<number | null>(null);
  const [sellersError, setSellersError] = useState<string | null>(null);

  useEffect(() => {
    const loadSellers = async () => {
      try {
        const sellers = await getAllSellers();
        setSellersCount(sellers.length);
        setSellersError(null);
      } catch (error) {
        console.error("Erro ao carregar vendedores:", error);
        setSellersError("Falha ao carregar vendedores");
        setSellersCount(null);
      }
    };

    loadSellers();
  }, []);

  const sellersValue =
    sellersCount !== null ? sellersCount.toString() : "—";
  const sellersChangeLabel = sellersError
    ? "falha ao carregar"
    : "vs. mês anterior";

  const stats = [
    {
      title: "Volume Total",
      value: "R$ 0",
      change: 0.0,
      changeLabel: "vs. mês anterior",
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Propostas Ativas",
      value: "0",
      change: 0,
      changeLabel: "vs. mês anterior",
      icon: FileText,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Taxa de Aprovação",
      value: "0.0%",
      change: 0,
      changeLabel: "vs. mês anterior",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Tempo Médio",
      value: "0.0 dias",
      change: -0.0,
      changeLabel: "vs. mês anterior",
      icon: Clock,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Vendedores Ativos",
      value: sellersValue,
      change: 0.0,
      changeLabel: sellersChangeLabel,
      icon: Users,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Ticket Médio",
      value: "R$ 0",
      change: 0.0,
      changeLabel: "vs. mês anterior",
      icon: TrendingUp,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-50 dark:bg-cyan-950",
    },
  ];

  return (
    <div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      data-oid="wuzyva8"
    >
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} data-oid="t:m:i1v" />
      ))}
    </div>
  );
}
