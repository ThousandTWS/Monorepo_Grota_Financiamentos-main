"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { Button } from "@/presentation/layout/components/ui/button";
import { deleteSeller, getAllSellers, Seller } from "@/application/services/Seller/sellerService";
import { Loader2, RefreshCcw, Trash2 } from "lucide-react";
import { StatusBadge } from "../../logista/components/status-badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/application/core/hooks/use-toast";

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

const isActive = (status?: string) =>
  (status ?? "").toString().trim().toUpperCase() === "ATIVO";

export function SellersList({ dealerId }: { dealerId?: number }) {
  const { toast } = useToast();
  const mountedRef = useRef(true);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSellers = useCallback(
    async (showFullLoading = false) => {
      if (showFullLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        const data = await getAllSellers(dealerId);
        if (!mountedRef.current) return;

        setSellers(Array.isArray(data) ? data : []);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        if (!mountedRef.current) return;

        console.error("Erro ao buscar vendedores:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Nao foi possivel carregar os vendedores.";
        setError(message);
        toast({
          title: "Erro ao carregar vendedores",
          description: message,
          variant: "destructive",
        });
      } finally {
        if (!mountedRef.current) return;

        if (showFullLoading) {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    },
    [dealerId, toast],
  );

  useEffect(() => {
    fetchSellers(true);
  }, [fetchSellers]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleRefresh = () => {
    if (loading || refreshing) return;
    fetchSellers(false);
  };

  const handleDelete = async (sellerId: number, sellerName?: string) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Deseja realmente excluir o vendedor ${sellerName ?? `#${sellerId}`}?`,
    );
    if (!confirmed) return;

    setDeletingId(sellerId);
    try {
      await deleteSeller(sellerId);
      if (!mountedRef.current) return;

      setSellers((prev) => prev.filter((s) => s.id !== sellerId));
      setLastUpdated(new Date());
      toast({
        title: "Vendedor removido",
        description: "O acesso deste vendedor foi revogado.",
        variant: "destructive",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Nao foi possivel remover o vendedor.";
      if (mountedRef.current) {
        toast({
          title: "Erro ao remover vendedor",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setDeletingId(null);
      }
    }
  };

  const activeSellers = useMemo(
    () => sellers.filter((s) => isActive(s.status)),
    [sellers],
  );

  const visibleSellers = useMemo(
    () => activeSellers.slice(0, 8),
    [activeSellers],
  );

  return (
    <Card className="w-full overflow-hidden border border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-muted/40">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">Vendedores ativos</CardTitle>
          <CardDescription>Lista de vendedores com acesso ao painel.</CardDescription>
          <p className="text-xs text-muted-foreground">
            {lastUpdated
              ? `Atualizado ${lastUpdated.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Sincronizando..."}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 self-start"
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            {loading || refreshing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCcw className="size-4" />
            )}
            Atualizar
          </Button>
          <div className="flex items-center gap-2">
            <div className="text-right text-xs text-muted-foreground">
              Mostrando {visibleSellers.length} de {activeSellers.length}
            </div>
            <StatusBadge status="ativo" className="shadow-none">
              {activeSellers.length} vendedores
            </StatusBadge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center gap-2 px-6 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando vendedores...
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
                  <th className="px-6 py-3 text-left font-medium">Vendedor</th>
                  <th className="px-6 py-3 text-left font-medium">Contato</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Cadastro</th>
                  <th className="px-6 py-3 text-left font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {visibleSellers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-muted-foreground"
                    >
                      Nenhum vendedor ativo no momento.
                    </td>
                  </tr>
                ) : (
                  visibleSellers.map((seller) => {
                    return (
                      <tr
                        key={seller.id}
                        className={cn(
                          "border-t border-border/60 text-sm transition-colors",
                          "hover:bg-muted/40",
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-gray-50">
                            {seller.fullName ?? "--"}
                          </div>
                          {seller.id && (
                            <p className="text-xs text-muted-foreground">
                              ID #{seller.id}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {seller.email ?? "--"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {seller.phone ?? "--"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={seller.status} />
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(seller.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-red-600 hover:text-red-700 dark:text-red-400"
                            onClick={() => handleDelete(seller.id, seller.fullName)}
                            disabled={deletingId === seller.id}
                          >
                            {deletingId === seller.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                            Excluir
                          </Button>
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
