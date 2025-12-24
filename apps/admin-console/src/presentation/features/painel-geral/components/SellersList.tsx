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
import { Input } from "@/presentation/layout/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/layout/components/ui/tooltip";
import { deleteSeller, getAllSellers, Seller } from "@/application/services/Seller/sellerService";
import { AlertTriangle, Inbox, Loader2, RefreshCcw, Search, Trash2 } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const pageSize = 8;
  const [visibleCount, setVisibleCount] = useState(pageSize);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [debouncedSearch, pageSize, sellers.length]);

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

  const filteredSellers = useMemo(() => {
    if (!debouncedSearch) return activeSellers;
    return activeSellers.filter((seller) => {
      const haystack = [
        seller.fullName,
        seller.email,
        seller.phone,
        seller.id ? `#${seller.id}` : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(debouncedSearch);
    });
  }, [activeSellers, debouncedSearch]);

  const visibleSellers = useMemo(
    () => filteredSellers.slice(0, visibleCount),
    [filteredSellers, visibleCount],
  );

  const canShowMore = visibleCount < filteredSellers.length;
  const showPagination = filteredSellers.length > pageSize;

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
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar vendedor..."
              className="h-9 w-full min-w-0 pl-9 text-sm sm:min-w-[220px]"
            />
          </div>
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
              Mostrando {visibleSellers.length} de {filteredSellers.length}
            </div>
            <StatusBadge status="ativo" className="shadow-none">
              {filteredSellers.length} vendedores
            </StatusBadge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2 px-6 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span>Carregando vendedores...</span>
          </div>
        ) : error ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2 px-6 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="size-5" />
            <span>{error}</span>
            <span className="text-xs text-red-500/80">Tente atualizar em instantes.</span>
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
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Inbox className="size-5" />
                        <span>Nenhum vendedor encontrado.</span>
                        <span className="text-xs text-muted-foreground/80">
                          Ajuste sua busca ou aguarde novas atualizações.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visibleSellers.map((seller) => {
                    return (
                      <tr
                        key={seller.id}
                        className={cn(
                          "border-t border-border/60 text-sm transition-colors",
                          "odd:bg-background even:bg-muted/20 hover:bg-muted/40",
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400"
                                onClick={() => handleDelete(seller.id, seller.fullName)}
                                disabled={deletingId === seller.id}
                                aria-label="Excluir vendedor"
                              >
                                {deletingId === seller.id ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <Trash2 className="size-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Excluir</TooltipContent>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {showPagination && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-6 py-4 text-xs text-muted-foreground">
                <span>
                  Mostrando {visibleSellers.length} de {filteredSellers.length} vendedores
                </span>
                <div className="flex items-center gap-2">
                  {visibleCount > pageSize && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => setVisibleCount(pageSize)}
                    >
                      Mostrar menos
                    </Button>
                  )}
                  {canShowMore && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() =>
                        setVisibleCount((prev) =>
                          Math.min(prev + pageSize, filteredSellers.length),
                        )
                      }
                    >
                      Ver mais
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
