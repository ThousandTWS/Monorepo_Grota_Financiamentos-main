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
import { Search, Filter, X, Download, RefreshCw, Plus } from "lucide-react";
import { VehicleStatus, VehicleCondition, TransmissionType } from "@/application/core/@types/Vehicles";

interface VehicleFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatuses: VehicleStatus[];
  onStatusesChange: (statuses: VehicleStatus[]) => void;
  selectedConditions: VehicleCondition[];
  onConditionsChange: (conditions: VehicleCondition[]) => void;
  selectedTransmissions: TransmissionType[];
  onTransmissionsChange: (transmissions: TransmissionType[]) => void;
  onRefresh: () => void;
  onExport: () => void;
  onAddNew?: () => void;
}

const statusOptions: { value: VehicleStatus; label: string }[] = [
  { value: "available", label: "Disponível" },
  { value: "in_financing", label: "Em Financiamento" },
  { value: "sold", label: "Vendido" },
  { value: "reserved", label: "Reservado" },
  { value: "maintenance", label: "Manutenção" },
];

const conditionOptions: { value: VehicleCondition; label: string }[] = [
  { value: "new", label: "Novo" },
  { value: "semi_new", label: "Semi-Novo" },
  { value: "used", label: "Usado" },
];

const transmissionOptions: { value: TransmissionType; label: string }[] = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automático" },
  { value: "automated", label: "Automatizado" },
];

export function VehicleFilters({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusesChange,
  selectedConditions,
  onConditionsChange,
  selectedTransmissions,
  onTransmissionsChange,
  onRefresh,
  onExport,
  onAddNew,
}: VehicleFiltersProps) {
  const activeFiltersCount =
    selectedStatuses.length +
    selectedConditions.length +
    selectedTransmissions.length;

  const handleClearFilters = () => {
    onStatusesChange([]);
    onConditionsChange([]);
    onTransmissionsChange([]);
    onSearchChange("");
  };

  const toggleStatus = (status: VehicleStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusesChange([...selectedStatuses, status]);
    }
  };

  const toggleCondition = (condition: VehicleCondition) => {
    if (selectedConditions.includes(condition)) {
      onConditionsChange(selectedConditions.filter((c) => c !== condition));
    } else {
      onConditionsChange([...selectedConditions, condition]);
    }
  };

  const toggleTransmission = (transmission: TransmissionType) => {
    if (selectedTransmissions.includes(transmission)) {
      onTransmissionsChange(
        selectedTransmissions.filter((t) => t !== transmission),
      );
    } else {
      onTransmissionsChange([...selectedTransmissions, transmission]);
    }
  };

  return (
    <div className="space-y-4" data-oid="91gqf:t">
      <div className="flex flex-col sm:flex-row gap-4" data-oid="mj8ntmr">
        {/* Search */}
        <div className="relative flex-1" data-oid="bb9zzg9">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            data-oid="v::yjd4"
          />
          <Input
            placeholder="Buscar por marca, modelo, placa ou lojista..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            data-oid="4sxoy.z"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu data-oid="lue.54y">
          <DropdownMenuTrigger asChild data-oid="unyvedr">
            <Button
              variant="outline"
              className="min-w-[140px]"
              data-oid="trnzbki"
            >
              <Filter className="h-4 w-4 mr-2" data-oid="8wgxv53" />
              Status
              {selectedStatuses.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5"
                  data-oid="t31az4z"
                >
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" data-oid="jrkkj3w">
            <DropdownMenuLabel data-oid="js6qdo-">
              Filtrar por Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator data-oid="6cj4ie2" />
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={() => toggleStatus(option.value)}
                data-oid="m5lv037"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Condition Filter */}
        <DropdownMenu data-oid="pnk1ho0">
          <DropdownMenuTrigger asChild data-oid="e0joir7">
            <Button
              variant="outline"
              className="min-w-[140px]"
              data-oid="yx:cu75"
            >
              <Filter className="h-4 w-4 mr-2" data-oid="z4dlxhw" />
              Condição
              {selectedConditions.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5"
                  data-oid="kvxjgbq"
                >
                  {selectedConditions.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" data-oid="n.kb1:z">
            <DropdownMenuLabel data-oid="kh:dm03">
              Filtrar por Condição
            </DropdownMenuLabel>
            <DropdownMenuSeparator data-oid="-fbfilz" />
            {conditionOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedConditions.includes(option.value)}
                onCheckedChange={() => toggleCondition(option.value)}
                data-oid="jy-uod1"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Transmission Filter */}
        <DropdownMenu data-oid="w6obdca">
          <DropdownMenuTrigger asChild data-oid="x3nrk5o">
            <Button
              variant="outline"
              className="min-w-[140px]"
              data-oid="le6mug4"
            >
              <Filter className="h-4 w-4 mr-2" data-oid="4:norm-" />
              Câmbio
              {selectedTransmissions.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5"
                  data-oid="0x.feng"
                >
                  {selectedTransmissions.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" data-oid="c_k96nt">
            <DropdownMenuLabel data-oid="tk77mug">
              Filtrar por Câmbio
            </DropdownMenuLabel>
            <DropdownMenuSeparator data-oid="-wlbzku" />
            {transmissionOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedTransmissions.includes(option.value)}
                onCheckedChange={() => toggleTransmission(option.value)}
                data-oid="ty1j9ct"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Actions */}
        <div className="flex gap-2" data-oid="fgt60be">
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            data-oid="xohruk8"
          >
            <RefreshCw className="h-4 w-4" data-oid="pkjqxg9" />
          </Button>
          <Button variant="outline" onClick={onExport} data-oid="s5t7fbe">
            <Download className="h-4 w-4 mr-2" data-oid="ifjprhk" />
            Exportar
          </Button>
          {onAddNew && (
            <Button onClick={onAddNew} data-oid="73cr4-6">
              <Plus className="h-4 w-4 mr-2" data-oid="y-gyr.7" />
              Novo Veículo
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap" data-oid="jz96:8a">
          <span className="text-sm text-muted-foreground" data-oid="21t_lko">
            Filtros ativos:
          </span>
          {selectedStatuses.map((status) => {
            const option = statusOptions.find((o) => o.value === status);
            return (
              <Badge
                key={status}
                variant="secondary"
                className="gap-1"
                data-oid="pzevq7n"
              >
                {option?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleStatus(status)}
                  data-oid="0g52ony"
                />
              </Badge>
            );
          })}
          {selectedConditions.map((condition) => {
            const option = conditionOptions.find((o) => o.value === condition);
            return (
              <Badge
                key={condition}
                variant="secondary"
                className="gap-1"
                data-oid="7svc5dj"
              >
                {option?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleCondition(condition)}
                  data-oid="2kpzyl6"
                />
              </Badge>
            );
          })}
          {selectedTransmissions.map((transmission) => {
            const option = transmissionOptions.find(
              (o) => o.value === transmission,
            );
            return (
              <Badge
                key={transmission}
                variant="secondary"
                className="gap-1"
                data-oid="szktzx:"
              >
                {option?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleTransmission(transmission)}
                  data-oid="545x9wv"
                />
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7 px-2 text-xs"
            data-oid="95oy_5n"
          >
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
}
