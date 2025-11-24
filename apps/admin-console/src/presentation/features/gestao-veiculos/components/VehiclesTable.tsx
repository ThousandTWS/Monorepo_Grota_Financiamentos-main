"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/layout/components/ui/table";
import { Button } from "@/presentation/layout/components/ui/button";
import { Badge } from "@/presentation/layout/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/layout/components/ui/dropdown-menu";
import {
  Car,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  CircleDollarSign,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { Vehicle } from "@/application/core/@types/Vehicles";
import { cn } from "@/lib/utils";
import { VehicleDetailsDialog } from "./VehicleDetailsDialog";

interface VehiclesTableProps {
  vehicles: Vehicle[];
  onEdit?: (vehicleId: string) => void;
  onDelete?: (vehicleId: string) => void;
}

const statusConfig = {
  available: {
    label: "Disponível",
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  },
  in_financing: {
    label: "Em Financiamento",
    icon: Clock,
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  sold: {
    label: "Vendido",
    icon: CircleDollarSign,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  reserved: {
    label: "Reservado",
    icon: AlertCircle,
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  },
  maintenance: {
    label: "Manutenção",
    icon: Wrench,
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  },
};

const conditionLabels = { new: "Novo", semi_new: "Semi-Novo", used: "Usado" };
const transmissionLabels = {
  manual: "Manual",
  automatic: "Automático",
  automated: "Automatizado",
};

export function VehiclesTable({
  vehicles,
  onEdit,
  onDelete,
}: VehiclesTableProps) {
  const [detailsVehicle, setDetailsVehicle] = useState<Vehicle | null>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("pt-BR").format(mileage) + " km";

  return (
    <>
      <div
        className="rounded-lg border bg-card overflow-hidden"
        data-oid="xp4fjwi"
      >
        <Table data-oid="1v2gi9b">
          <TableHeader data-oid="tq:ymmh">
            <TableRow className="bg-muted/50" data-oid="km4kli6">
              <TableHead className="font-semibold w-[50px]" data-oid="j3:6s-1">
                Foto
              </TableHead>
              <TableHead className="font-semibold" data-oid="qh_1b4c">
                Veículo
              </TableHead>
              <TableHead className="font-semibold" data-oid="10ymp0o">
                Lojista
              </TableHead>
              <TableHead className="font-semibold" data-oid="h-:_u3:">
                Ano
              </TableHead>
              <TableHead className="font-semibold" data-oid="3i7a0f7">
                Km
              </TableHead>
              <TableHead className="font-semibold" data-oid="z_img5p">
                Condição
              </TableHead>
              <TableHead className="font-semibold" data-oid="_ohqrb.">
                Câmbio
              </TableHead>
              <TableHead className="font-semibold" data-oid="5m1s5e.">
                Preço
              </TableHead>
              <TableHead className="font-semibold" data-oid="y0fnh_i">
                Status
              </TableHead>
              <TableHead
                className="text-center font-semibold"
                data-oid=":-va9aa"
              >
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-oid="r7u4doq">
            {vehicles.map((vehicle) => {
              const StatusIcon = statusConfig[vehicle.status].icon;
              return (
                <TableRow
                  key={vehicle.id}
                  className="hover:bg-muted/30"
                  data-oid=":_6rhhs"
                >
                  <TableCell data-oid="-im89nr">
                    <div
                      className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center"
                      data-oid="vp3bbrn"
                    >
                      <Car
                        className="h-6 w-6 text-muted-foreground"
                        data-oid="skhk-t0"
                      />
                    </div>
                  </TableCell>
                  <TableCell data-oid="5.h:640">
                    <div className="space-y-1" data-oid="lkz9lyu">
                      <p className="font-semibold text-sm" data-oid="vb7rhu_">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="4.atexs"
                      >
                        {vehicle.color}
                      </p>
                      <p
                        className="text-xs font-mono text-muted-foreground"
                        data-oid="9krcxhe"
                      >
                        {vehicle.licensePlate}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell data-oid="_p81blz">
                    <div className="space-y-1" data-oid="xf2g.v:">
                      <p className="text-sm font-medium" data-oid="6778fst">
                        {vehicle.dealerName}
                      </p>
                      <p
                        className="text-xs text-muted-foreground font-mono"
                        data-oid="-8ceq5t"
                      >
                        {vehicle.dealerId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell data-oid="4c4340o">
                    <span className="text-sm font-semibold" data-oid="qky-7:o">
                      {vehicle.year}
                    </span>
                    {vehicle.modelYear !== vehicle.year && (
                      <span
                        className="text-muted-foreground"
                        data-oid="2j2wjux"
                      >
                        /{vehicle.modelYear}
                      </span>
                    )}
                  </TableCell>
                  <TableCell data-oid="a5zhizy">
                    <span className="text-sm" data-oid="7lv7u:8">
                      {formatMileage(vehicle.mileage)}
                    </span>
                  </TableCell>
                  <TableCell data-oid="tt74sxi">
                    <Badge variant="outline" data-oid="bq3do._">
                      {conditionLabels[vehicle.condition]}
                    </Badge>
                  </TableCell>
                  <TableCell data-oid="cm5het3">
                    <span className="text-sm" data-oid="1p5vhx7">
                      {transmissionLabels[vehicle.transmission]}
                    </span>
                  </TableCell>
                  <TableCell data-oid=":8h1qaz">
                    <div className="space-y-1" data-oid="c-2q-y8">
                      <p className="font-semibold text-sm" data-oid="cyqluu9">
                        {formatCurrency(vehicle.price)}
                      </p>
                      {vehicle.costPrice && (
                        <p
                          className="text-xs text-muted-foreground"
                          data-oid="kq_-nvq"
                        >
                          Custo: {formatCurrency(vehicle.costPrice)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell data-oid="gx:4rv9">
                    <Badge
                      className={cn(
                        "font-medium",
                        statusConfig[vehicle.status].className,
                      )}
                      data-oid="15h0rnr"
                    >
                      <StatusIcon className="h-3 w-3 mr-1" data-oid="mw7mry4" />
                      {statusConfig[vehicle.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell data-oid="ayb9ufy">
                    <div
                      className="flex items-center justify-center gap-2"
                      data-oid="sjr5x51"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDetailsVehicle(vehicle)}
                        data-oid="vjv45o4"
                      >
                        <Eye className="h-4 w-4 mr-1" data-oid="mxntgj8" />
                        Ver
                      </Button>
                      <DropdownMenu data-oid="blz7yl3">
                        <DropdownMenuTrigger asChild data-oid="0o9jo4s">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            data-oid="tfu5jkh"
                          >
                            <MoreVertical
                              className="h-4 w-4"
                              data-oid="epq22lk"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" data-oid="8kezv28">
                          <DropdownMenuItem
                            onClick={() => setDetailsVehicle(vehicle)}
                            data-oid="0:8v2z6"
                          >
                            <Eye className="h-4 w-4 mr-2" data-oid="knv4f.6" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit?.(vehicle.id)}
                            data-oid="-1sj.zq"
                          >
                            <Edit className="h-4 w-4 mr-2" data-oid="548dvuc" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator data-oid="42s-7ki" />
                          <DropdownMenuItem
                            onClick={() => onDelete?.(vehicle.id)}
                            className="text-red-600"
                            data-oid="b.:_loy"
                          >
                            <Trash2
                              className="h-4 w-4 mr-2"
                              data-oid="4h280ed"
                            />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {detailsVehicle && (
        <VehicleDetailsDialog
          vehicle={detailsVehicle}
          open={!!detailsVehicle}
          onClose={() => setDetailsVehicle(null)}
          data-oid="xlm7c54"
        />
      )}
    </>
  );
}
