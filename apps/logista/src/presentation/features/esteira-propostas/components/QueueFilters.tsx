import { Input } from "@/presentation/ui/input";
import { Button } from "@/presentation/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/ui/select";
import { Filter, Plus, RefreshCw, Search } from "lucide-react";
import { ProposalStatus } from "@/application/core/@types/Proposals/Proposal";

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
  onCreate: () => void;
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
  isRefreshing,
}: QueueFiltersProps) {
  const handleResetFilters = () => {
    onFiltersChange({
      search: "",
      operatorId: undefined,
      dealerId: undefined,
      dealerCode: "",
      status: "ALL",
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Nome/CPF
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquise por nome do cliente ou CPF"
                value={filters.search ?? ""}
                onChange={(event) => onFiltersChange({ search: event.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Operador
            </label>
            <Select
              value={filters.operatorId ?? "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  operatorId: value === "all" ? undefined : value,
                })
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

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Lojista
            </label>
            <Select
              value={filters.dealerId ?? "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  dealerId: value === "all" ? undefined : value,
                })
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
        </div>

        <div className="mt-2 flex flex-col gap-4 lg:mt-4 lg:flex-row">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                onFiltersChange({
                  status: value as ProposalStatus | "ALL",
                })
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

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Código Lojista
            </label>
            <Input
              placeholder="0000"
              value={filters.dealerCode ?? ""}
              onChange={(event) =>
                onFiltersChange({ dealerCode: event.target.value })
              }
            />
          </div>

          <div className="mt-6 flex w-full flex-col items-stretch gap-2 self-end sm:flex-row sm:justify-end lg:mt-6 lg:w-auto">
            <Button
              variant="outline"
              className="gap-2"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className="size-4" />
              Atualizar
            </Button>
            <Button className="gap-2" onClick={onCreate}>
              <Plus className="size-4" />
              Nova Ficha
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleResetFilters}
              aria-label="Limpar filtros"
            >
              <Filter className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
