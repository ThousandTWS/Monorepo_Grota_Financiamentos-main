import { ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { Button } from "@/presentation/layout/components/ui/button";
import { Input } from "@/presentation/layout/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/layout/components/ui/select";
import { Download, Filter, Plus, RefreshCw, Search } from "lucide-react";

type QueueFiltersProps = {
  filters: {
    search: string;
    operatorId?: string;
    dealerId?: string;
    dealerCode?: string;
    status: ProposalStatus | "ALL";
  };
  operators: { value: string; label: string }[];
  dealers: { value: string; label: string }[];
  statuses: { value: ProposalStatus | "ALL"; label: string }[];
  onFiltersChange: (partial: Partial<QueueFiltersProps["filters"]>) => void;
  onRefresh: () => void;
  onCreate?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
};

export function QueueFilters({
  filters,
  operators,
  dealers,
  statuses,
  onFiltersChange,
  onRefresh,
  onCreate,
  onExport,
  isRefreshing,
}: QueueFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      search: "",
      operatorId: undefined,
      dealerId: undefined,
      dealerCode: "",
      status: "ALL",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Foco no cliente
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquise por cliente, CPF ou placa"
              value={filters.search}
              onChange={(event) => onFiltersChange({ search: event.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Operador</p>
            <Select
              value={filters.operatorId ?? "all"}
              onValueChange={(value) =>
                onFiltersChange({ operatorId: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="(todos)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">(todos)</SelectItem>
                {operators.map((operator) => (
                  <SelectItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Lojista</p>
            <Select
              value={filters.dealerId ?? "all"}
              onValueChange={(value) =>
                onFiltersChange({ dealerId: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="(todos)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">(todos)</SelectItem>
                {dealers.map((dealer) => (
                  <SelectItem key={dealer.value} value={dealer.value}>
                    {dealer.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Cód. lojista</p>
            <Input
              placeholder="0000"
              value={filters.dealerCode ?? ""}
              onChange={(event) =>
                onFiltersChange({ dealerCode: event.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Status</p>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ status: value as ProposalStatus | "ALL" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="(todos)" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className="size-4" />
            Atualizar
          </Button>
          {onExport ? (
            <Button variant="ghost" className="gap-2" onClick={onExport}>
              <Download className="size-4" />
              Exportar CSV
            </Button>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2">
          {onCreate ? (
            <Button className="gap-2" onClick={onCreate}>
              <Plus className="size-4" />
              Nova ficha
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleReset}
            aria-label="Limpar filtros"
          >
            <Filter className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
