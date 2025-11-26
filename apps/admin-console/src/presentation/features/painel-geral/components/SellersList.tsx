"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { getAllLogistics } from "@/application/services/Logista/logisticService";
import { Loader2 } from "lucide-react";
import { StatusBadge } from "../../logista/components/status-badge";
import { cn } from "@/lib/utils";

type Dealer = {
  id: number;
  fullName: string;
  email: string;
  enterprise: string;
  phone: string;
  status?: string;
  createdAt?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export function SellersList() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchDealers = async () => {
      try {
        setLoading(true);
        const data = await getAllLogistics();
        if (mounted) {
          setDealers(Array.isArray(data) ? data : []);
          setError(null);
          setLastUpdated(new Date());
        }
      } catch (err) {
        if (mounted) {
          console.error("Erro ao buscar logistas:", err);
          setError("Não foi possível carregar os lojistas.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDealers();

    return () => {
      mounted = false;
    };
  }, []);

  const displayedDealers = useMemo(() => dealers.slice(0, 10), [dealers]);
  const visibleCount = displayedDealers.length;

  return (
    <Card className="w-full overflow-hidden border border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-muted/40">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            Lojistas cadastrados
          </CardTitle>
          <CardDescription>
            Últimos lojistas sincronizados com a plataforma.
          </CardDescription>
          <p className="text-xs text-muted-foreground">
            {lastUpdated
              ? `Atualizado ${lastUpdated.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Sincronizando..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right text-xs text-muted-foreground">
            Mostrando {visibleCount} de {dealers.length}
          </div>
          <StatusBadge status="ativo" className="shadow-none">
            {dealers.length} lojistas
          </StatusBadge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center gap-2 px-6 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando lojistas...
          </div>
        ) : error ? (
          <div className="px-6 py-6 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Lojista</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {displayedDealers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-muted-foreground"
                    >
                      Nenhum lojista cadastrado até o momento.
                    </td>
                  </tr>
                ) : (
                  displayedDealers.map((dealer) => {
                    return (
                      <tr
                        key={dealer.id}
                        className={cn(
                          "border-t border-border/60 text-sm transition-colors",
                          "hover:bg-muted/40"
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-gray-50">
                            {dealer.fullName ?? "--"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {dealer.enterprise ?? "--"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {dealer.email ?? "--"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {dealer.phone ?? "--"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={dealer.status} />
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(dealer.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}