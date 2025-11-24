"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { Badge } from "@/presentation/layout/components/ui/badge";
import { getAllLogistics } from "@/application/services/Logista/logisticService";
import { Loader2 } from "lucide-react";

type Dealer = {
  id: number;
  fullName: string;
  email: string;
  enterprise: string;
  phone: string;
  status?: string;
  createdAt?: string;
};

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Ativo",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  INACTIVE: {
    label: "Inativo",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300",
  },
  PENDING: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
  },
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

export function DealersList() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchDealers = async () => {
      try {
        setLoading(true);
        const data = await getAllLogistics();
        if (mounted) {
          setDealers(Array.isArray(data) ? data : []);
          setError(null);
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Lojistas cadastrados</CardTitle>
          <CardDescription>
            Últimos lojistas sincronizados com a plataforma.
          </CardDescription>
        </div>
        <Badge variant="secondary" className="text-xs font-medium">
          {dealers.length} lojistas
        </Badge>
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
                    const status =
                      statusConfig[dealer.status ?? ""] ??
                      statusConfig.ACTIVE;

                    return (
                      <tr
                        key={dealer.id}
                        className="border-t border-border/60 text-sm"
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
                          <Badge className={status.className}>
                            {status.label}
                          </Badge>
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
