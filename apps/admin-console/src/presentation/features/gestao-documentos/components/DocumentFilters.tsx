"use client";

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
import { Filter, RefreshCw, Search } from "lucide-react";
import {
  DOCUMENT_TYPES,
  REVIEW_STATUSES,
  DocumentType,
  ReviewStatus,
} from "@/application/core/@types/Documents/Document";
import { DOCUMENT_TYPE_LABELS } from "@/presentation/features/gestao-documentos/data/documentLabels";

interface DocumentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ReviewStatus | "ALL";
  onStatusChange: (value: ReviewStatus | "ALL") => void;
  typeFilter: DocumentType | "ALL";
  onTypeChange: (value: DocumentType | "ALL") => void;
  onRefresh: () => void;
  onReset: () => void;
}

const statusLabels: Record<ReviewStatus, string> = {
  PENDENTE: "Pendentes",
  APROVADO: "Aprovados",
  REPROVADO: "Reprovados",
};

export function DocumentFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  onRefresh,
  onReset,
}: DocumentFiltersProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      <div className="flex-1 space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Busca
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Busque por observação ou tipo..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Status
        </label>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusChange(value as ReviewStatus | "ALL")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            {REVIEW_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Tipo de documento
        </label>
        <Select
          value={typeFilter}
          onValueChange={(value) => onTypeChange(value as DocumentType | "ALL")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            {DOCUMENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {DOCUMENT_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Ações
        </label>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onReset}>
            <Filter className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
