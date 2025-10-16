"use client";

import React, { useState, useMemo } from "react";
import {
  Vehicle,
  VehicleStatus,
  VehicleCondition,
  TransmissionType,
} from "@/application/core/@types/Vehicles";
import { toast } from "sonner";
import { VehicleFilters, VehiclesTable, VehicleStats } from "@/presentation/features/gestao-veiculos";
import { mockVehicles } from "@/presentation/features/gestao-veiculos/data/mockVehicles";

export default function VehiclesPage() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<VehicleStatus[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<
    VehicleCondition[]
  >([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<
    TransmissionType[]
  >([]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          vehicle.brand.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.licensePlate.toLowerCase().includes(query) ||
          vehicle.dealerName.toLowerCase().includes(query) ||
          vehicle.color.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (
        selectedStatuses.length > 0 &&
        !selectedStatuses.includes(vehicle.status)
      ) {
        return false;
      }


      if (
        selectedConditions.length > 0 &&
        !selectedConditions.includes(vehicle.condition)
      ) {
        return false;
      }

      if (
        selectedTransmissions.length > 0 &&
        !selectedTransmissions.includes(vehicle.transmission)
      ) {
        return false;
      }

      return true;
    });
  }, [
    vehicles,
    searchQuery,
    selectedStatuses,
    selectedConditions,
    selectedTransmissions,
  ]);

  const stats = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter((v) => v.status === "available").length;
    const inFinancing = vehicles.filter(
      (v) => v.status === "in_financing",
    ).length;
    const sold = vehicles.filter((v) => v.status === "sold").length;
    const reserved = vehicles.filter((v) => v.status === "reserved").length;
    const maintenance = vehicles.filter(
      (v) => v.status === "maintenance",
    ).length;
    const totalValue = vehicles
      .filter((v) => v.status !== "sold")
      .reduce((sum, v) => sum + v.price, 0);

    return {
      total,
      available,
      inFinancing,
      sold,
      reserved,
      maintenance,
      totalValue,
    };
  }, [vehicles]);

  const handleRefresh = () => {
    toast.info("Atualizando veículos...");
  };

  const handleExport = () => {
    toast.success("Exportando veículos...", {
      description: "O download será iniciado em breve.",
    });
  };

  const handleAddNew = () => {
    toast.info("Funcionalidade em desenvolvimento", {
      description: "Em breve você poderá adicionar novos veículos.",
    });
  };

  const handleEdit = (vehicleId: string) => {
    toast.info(`Editar veículo ${vehicleId}`, {
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  const handleDelete = (vehicleId: string) => {
    toast.error(`Excluir veículo ${vehicleId}?`, {
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  return (
    <div className="space-y-6" data-oid="u-w-:dq">
      <div className="space-y-2" data-oid="sz8n_eb">
        <h1
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent"
          data-oid="bys-c51"
        >
          Gestão de Veículos
        </h1>
        <p className="text-muted-foreground" data-oid="s5ke:zc">
          Gerencie todos os veículos cadastrados pelos lojistas
        </p>
      </div>

      <VehicleStats
        totalVehicles={stats.total}
        availableCount={stats.available}
        inFinancingCount={stats.inFinancing}
        soldCount={stats.sold}
        reservedCount={stats.reserved}
       
        totalValue={stats.totalValue}
        data-oid="ws9x.t8"
      />

      <VehicleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        selectedConditions={selectedConditions}
        onConditionsChange={setSelectedConditions}
        selectedTransmissions={selectedTransmissions}
        onTransmissionsChange={setSelectedTransmissions}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onAddNew={handleAddNew}
        data-oid="kwe0qmi"
      />

      <div className="flex items-center justify-between" data-oid="z4fg33f">
        <p className="text-sm text-muted-foreground" data-oid="g-f8de.">
          Exibindo{" "}
          <span className="font-semibold" data-oid="ou7uaw4">
            {filteredVehicles.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold" data-oid="rkb2gpq">
            {vehicles.length}
          </span>{" "}
          veículos
        </p>
      </div>

      <VehiclesTable
        vehicles={filteredVehicles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        data-oid="e6-_zsu"
      />
    </div>
  );
}
