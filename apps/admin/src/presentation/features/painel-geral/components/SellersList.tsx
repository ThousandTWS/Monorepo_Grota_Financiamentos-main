"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { Badge } from "@/presentation/layout/components/ui/badge";
import { getAllSellers, Seller } from "@/application/services/Seller/sellerService";
import { Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Ativo",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  INACTIVE: {
    label: "Inativo",
    className: "bg-gray-200 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
  },
  PENDING: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
  },
};

export function SellersList() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const syncSellers = async () => {
      try {
        setIsLoading(true);
        const data = await getAllSellers();
        if (mounted) {
          setSellers(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        console.error("[SellersList] Falha ao carregar vendedores:", err);
        if (mounted) {
          setError("Não foi possível carregar os vendedores.");
          setSellers([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    syncSellers();

    return () => {
      mounted = false;
    };
  }, []);

  const displayedSellers = useMemo(() => sellers.slice(0, 10), [sellers]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Vendedores ativos</CardTitle>
          <CardDescription>
            Lista sincronizada diretamente com o backend de propostas.
          </CardDescription>
        </div>
        <Badge variant="secondary" className="text-xs font-medium">
          {sellers.length} vendedores
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
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
                </tr>
              </thead>
              <tbody>
                {displayedSellers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-muted-foreground"
                    >
                      Nenhum vendedor cadastrado no momento.
                    </td>
                  </tr>
                ) : (
                  displayedSellers.map((seller) => {
                    const status =
                      statusConfig[seller.status ?? ""] ?? statusConfig.ACTIVE;

                    return (
                      <tr
                        key={seller.id}
                        className="border-t border-border/60 text-sm"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 dark:text-gray-50">
                            {seller.fullName ?? "--"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID #{seller.id}
                          </p>
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
                          <Badge className={status.className}>{status.label}</Badge>
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
