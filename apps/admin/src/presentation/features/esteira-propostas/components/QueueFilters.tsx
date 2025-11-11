import React from "react";
import { Input } from "@/presentation/layout/components/ui/input";
import { Button } from "@/presentation/layout/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/layout/components/ui/select";
import { ProposalQueueFilters, ProposalQueueStatus } from "@/application/core/@types/Proposals/Proposal";
import { Filter, Plus, RefreshCw, Search } from "lucide-react";

type StatusValue = ProposalQueueStatus;

interface QueueFiltersProps {
  filters: ProposalQueueFilters;
  operators: string[];
  dealers: string[];
  statuses: { label: string; value: StatusValue }[];
  onFiltersChange: (filters: Partial<ProposalQueueFilters>) => void;
  onRefresh: () => void;
  onCreate: () => void;
  isRefreshing?: boolean;
}

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
  const statusValue = filters.status?.[0] ?? "all";
  const handleResetFilters = () => {
    onFiltersChange({
      search: "",
      operatorId: undefined,
      dealerId: undefined,
      dealerCode: undefined,
      status: [],
    });
  };

  return (
    <div className="space-y-4" data-oid="9e7bb7i">
      <div className="flex flex-col gap-4 border rounded-lg p-4 bg-card" data-oid="o6f.wpe">
        <div className="flex flex-col lg:flex-row gap-4" data-oid="ux_wmds">
          <div className="flex-1 space-y-2" data-oid="ka2rw6f">
            <label className="text-sm font-medium text-muted-foreground" data-oid="eej44ff">
              Nome/CPF
            </label>
            <div className="relative" data-oid="c6r8dee">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" data-oid="1m81g7x" />
              <Input
                placeholder="Pesquise por nome do cliente ou CPF"
                value={filters.search ?? ""}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
                className="pl-9"
                data-oid="i6g.xn6"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2" data-oid="zju.pcl">
            <label className="text-sm font-medium text-muted-foreground" data-oid="u2dnzt6">
              Operador
            </label>
            <Select
              value={filters.operatorId ?? "all"}
              onValueChange={(value) =>
                onFiltersChange({ operatorId: value === "all" ? undefined : value })
              }
              data-oid="ej26r3x"
            >
              <SelectTrigger className="w-full" data-oid="qx1tcie">
                <SelectValue placeholder="Todos" data-oid="7a7c92j" />
              </SelectTrigger>
              <SelectContent data-oid="q8o16g9">
                <SelectItem value="all" data-oid="lbcgkt_">
                  (todos)
                </SelectItem>
                {operators.map((operator) => (
                  <SelectItem key={operator} value={operator} data-oid="6k4n0en">
                    {operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2" data-oid="g40ci81">
            <label className="text-sm font-medium text-muted-foreground" data-oid="qk6z5sz">
              Lojista
            </label>
            <Select
              value={filters.dealerId ?? "all"}
              onValueChange={(value) =>
                onFiltersChange({ dealerId: value === "all" ? undefined : value })
              }
              data-oid="7mcg8lj"
            >
              <SelectTrigger className="w-full" data-oid="2dktjlb">
                <SelectValue placeholder="Todos" data-oid="0clkx.s" />
              </SelectTrigger>
              <SelectContent data-oid="zc4d0uv">
                <SelectItem value="all" data-oid="8w7unh9">
                  (todos)
                </SelectItem>
                {dealers.map((dealer) => (
                  <SelectItem key={dealer} value={dealer} data-oid="f6u1y4_">
                    {dealer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4" data-oid="v1gwus7">
          <div className="flex-1 space-y-2" data-oid="6lqfy6n">
            <label className="text-sm font-medium text-muted-foreground" data-oid="q72z321">
              Status
            </label>
            <Select
              value={statusValue}
              onValueChange={(value) =>
                onFiltersChange({
                  status: value === "all" ? [] : [value as StatusValue],
                })
              }
              data-oid="a8yw0a9"
            >
              <SelectTrigger className="w-full" data-oid="i3s03dd">
                <SelectValue placeholder="(todos)" data-oid="2kg2gfl" />
              </SelectTrigger>
              <SelectContent data-oid="56oiz8m">
                <SelectItem value="all" data-oid="gim20pd">
                  (todos)
                </SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value} data-oid="79exbjm">
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2" data-oid="19qqrop">
            <label className="text-sm font-medium text-muted-foreground" data-oid="8p2y1sp">
              Código Lojista
            </label>
            <Input
              placeholder="0000"
              value={filters.dealerCode ?? ""}
              onChange={(e) => onFiltersChange({ dealerCode: e.target.value })}
              data-oid="cxdh3bg"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 justify-end w-full lg:w-auto" data-oid="f0m9auy">
            <Button
              variant="outline"
              className="gap-2"
              onClick={onRefresh}
              disabled={isRefreshing}
              data-oid="uyiwcfr"
            >
              <RefreshCw className="size-4" data-oid="49vhgji" />
              Atualizar
            </Button>
            <Button className="gap-2" onClick={onCreate} data-oid="lwnpril">
              <Plus className="size-4" data-oid="v6j8och" />
              Nova Ficha
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleResetFilters}
              aria-label="Limpar filtros"
              data-oid="hm10zac"
            >
              <Filter className="size-4" data-oid="31wpczq" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
