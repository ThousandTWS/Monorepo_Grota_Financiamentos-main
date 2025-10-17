"use client";

import React from "react";
import { Input } from "@/presentation/layout/components/ui/input";
import { Button } from "@/presentation/layout/components/ui/button";
import { Badge } from "@/presentation/layout/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/layout/components/ui/dropdown-menu";
import { Search, Filter, X, Download, RefreshCw } from "lucide-react";
import { DocumentStatus, DocumentType } from "@/application/core/@types/Documents/Document";

interface DocumentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatuses: DocumentStatus[];
  onStatusesChange: (statuses: DocumentStatus[]) => void;
  selectedTypes: DocumentType[];
  onTypesChange: (types: DocumentType[]) => void;
  selectedPriorities: ("low" | "medium" | "high")[];
  onPrioritiesChange: (priorities: ("low" | "medium" | "high")[]) => void;
  onRefresh: () => void;
  onExport: () => void;
}

const statusOptions: { value: DocumentStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "in_review", label: "Em Análise" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Reprovado" },
];

const typeOptions: { value: DocumentType; label: string }[] = [
  { value: "rg", label: "RG" },
  { value: "cpf", label: "CPF" },
  { value: "cnh", label: "CNH" },
  { value: "comprovante_residencia", label: "Comprovante de Residência" },
  { value: "comprovante_renda", label: "Comprovante de Renda" },
  { value: "crlv", label: "CRLV" },
  { value: "contrato", label: "Contrato" },
  { value: "outros", label: "Outros" },
];

const priorityOptions: { value: "low" | "medium" | "high"; label: string }[] = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
];

export function DocumentFilters({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusesChange,
  selectedTypes,
  onTypesChange,
  selectedPriorities,
  onPrioritiesChange,
  onRefresh,
  onExport,
}: DocumentFiltersProps) {
  const activeFiltersCount =
    selectedStatuses.length + selectedTypes.length + selectedPriorities.length;

  const handleClearFilters = () => {
    onStatusesChange([]);
    onTypesChange([]);
    onPrioritiesChange([]);
    onSearchChange("");
  };

  const toggleStatus = (status: DocumentStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusesChange([...selectedStatuses, status]);
    }
  };

  const toggleType = (type: DocumentType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const togglePriority = (priority: "low" | "medium" | "high") => {
    if (selectedPriorities.includes(priority)) {
      onPrioritiesChange(selectedPriorities.filter((p) => p !== priority));
    } else {
      onPrioritiesChange([...selectedPriorities, priority]);
    }
  };

  return (
    <div className="space-y-4" data-oid="pnr5szm">
      <div className="flex flex-col sm:flex-row gap-4" data-oid="-zsze:s">
        {/* Search */}
        <div className="relative flex-1" data-oid="n3b:5l8">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            data-oid="5gr90zr"
          />
          <Input
            placeholder="Buscar por cliente, CPF ou proposta..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            data-oid="wmi5utn"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu data-oid="u0psd2t">
          <DropdownMenuTrigger asChild data-oid="a6atlnl">
            <Button
              variant="outline"
              className="min-w-[140px]"
              data-oid="yb6n15x"
            >
              <Filter className="h-4 w-4 mr-2" data-oid="wmj4ry9" />
              Status
              {selectedStatuses.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5"
                  data-oid="b2n1egx"
                >
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" data-oid="_7xkih:">
            <DropdownMenuLabel data-oid="dxnm6yo">
              Filtrar por Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator data-oid="ceoehw_" />
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={() => toggleStatus(option.value)}
                data-oid="h9s352b"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Type Filter */}
        <DropdownMenu data-oid="vi401kj">
          <DropdownMenuTrigger asChild data-oid="g:d.y.3">
            <Button
              variant="outline"
              className="min-w-[140px]"
              data-oid="f9j43k5"
            >
              <Filter className="h-4 w-4 mr-2" data-oid="ryj:v66" />
              Tipo
              {selectedTypes.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5"
                  data-oid="bxf2k7l"
                >
                  {selectedTypes.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" data-oid="d1_xk:a">
            <DropdownMenuLabel data-oid="fd2r0wv">
              Filtrar por Tipo
            </DropdownMenuLabel>
            <DropdownMenuSeparator data-oid="gr09-mc" />
            {typeOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedTypes.includes(option.value)}
                onCheckedChange={() => toggleType(option.value)}
                data-oid="bjuz7:d"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Filter */}
        <DropdownMenu data-oid="9q6i5cv">
          <DropdownMenuTrigger asChild data-oid="qzc.-tl">
            <Button
              variant="outline"
              className="min-w-[140px]"
              data-oid="68bpokg"
            >
              <Filter className="h-4 w-4 mr-2" data-oid="j11yiou" />
              Prioridade
              {selectedPriorities.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5"
                  data-oid="30oo65:"
                >
                  {selectedPriorities.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" data-oid="i2921-p">
            <DropdownMenuLabel data-oid="l56fm6j">
              Filtrar por Prioridade
            </DropdownMenuLabel>
            <DropdownMenuSeparator data-oid="6g-iphf" />
            {priorityOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedPriorities.includes(option.value)}
                onCheckedChange={() => togglePriority(option.value)}
                data-oid="tcifv:l"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Actions */}
        <div className="flex gap-2" data-oid="z2p5.81">
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            data-oid="8s3oc.d"
          >
            <RefreshCw className="h-4 w-4" data-oid="7wnd_1v" />
          </Button>
          <Button variant="outline" onClick={onExport} data-oid="3yo.7c_">
            <Download className="h-4 w-4 mr-2" data-oid="slsie16" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap" data-oid="cbqlph1">
          <span className="text-sm text-muted-foreground" data-oid="e3myaq2">
            Filtros ativos:
          </span>
          {selectedStatuses.map((status) => {
            const option = statusOptions.find((o) => o.value === status);
            return (
              <Badge
                key={status}
                variant="secondary"
                className="gap-1"
                data-oid="vxl9j9:"
              >
                {option?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleStatus(status)}
                  data-oid="k9uzkry"
                />
              </Badge>
            );
          })}
          {selectedTypes.map((type) => {
            const option = typeOptions.find((o) => o.value === type);
            return (
              <Badge
                key={type}
                variant="secondary"
                className="gap-1"
                data-oid="gw9n6i7"
              >
                {option?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleType(type)}
                  data-oid="v1vhsd6"
                />
              </Badge>
            );
          })}
          {selectedPriorities.map((priority) => {
            const option = priorityOptions.find((o) => o.value === priority);
            return (
              <Badge
                key={priority}
                variant="secondary"
                className="gap-1"
                data-oid="5u81f-4"
              >
                {option?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => togglePriority(priority)}
                  data-oid="ca.6lz."
                />
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7 px-2 text-xs"
            data-oid="t5blo5d"
          >
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
}
