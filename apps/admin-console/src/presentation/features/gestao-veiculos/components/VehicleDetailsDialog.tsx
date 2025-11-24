"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/layout/components/ui/dialog";
import { Button } from "@/presentation/layout/components/ui/button";
import { Badge } from "@/presentation/layout/components/ui/badge";
import { Separator } from "@/presentation/layout/components/ui/separator";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import {
  Car,
  Gauge,
  Fuel,
  Settings,
  DoorClosed,
  CircleDollarSign,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Vehicle } from "@/application/core/@types/Vehicles";
import { cn } from "@/lib/utils";

interface VehicleDetailsDialogProps {
  vehicle: Vehicle;
  open: boolean;
  onClose: () => void;
}

const statusConfig = {
  available: {
    label: "Disponível",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  },
  in_financing: {
    label: "Em Financiamento",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  sold: {
    label: "Vendido",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  reserved: {
    label: "Reservado",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  },
  maintenance: {
    label: "Manutenção",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  },
};

const conditionLabels = {
  new: "Novo (0 km)",
  semi_new: "Semi-Novo",
  used: "Usado",
};
const fuelTypeLabels = {
  gasoline: "Gasolina",
  ethanol: "Etanol",
  flex: "Flex",
  diesel: "Diesel",
  electric: "Elétrico",
  hybrid: "Híbrido",
};
const transmissionLabels = {
  manual: "Manual",
  automatic: "Automático",
  automated: "Automatizado",
};

export function VehicleDetailsDialog({
  vehicle,
  open,
  onClose,
}: VehicleDetailsDialogProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("pt-BR").format(mileage) + " km";

  return (
    <Dialog open={open} onOpenChange={onClose} data-oid="q90xqn.">
      <DialogContent className="max-w-7xl max-h-[95vh] p-0" data-oid="uh61mmm">
        <DialogHeader className="px-6 pt-6 pb-4" data-oid="o0hq6iz">
          <div
            className="flex items-start justify-between gap-4"
            data-oid="imzh12b"
          >
            <div className="space-y-2" data-oid="gguiew9">
              <DialogTitle className="text-2xl font-bold" data-oid="ofm7qxk">
                {vehicle.brand} {vehicle.model}
              </DialogTitle>
              <p className="text-base text-muted-foreground" data-oid="2omuhsm">
                {vehicle.year}/{vehicle.modelYear} • {vehicle.color} •{" "}
                {vehicle.licensePlate}
              </p>
            </div>
            <Badge
              className={cn(
                "font-medium",
                statusConfig[vehicle.status].className,
              )}
              data-oid="tx2a_se"
            >
              {statusConfig[vehicle.status].label}
            </Badge>
          </div>
        </DialogHeader>
        <Separator data-oid="4a:jcsb" />
        <div
          className="grid grid-cols-5 gap-6 p-6 max-h-[calc(95vh-180px)]"
          data-oid="8x4drxl"
        >
          <div className="col-span-2" data-oid="kz.n38g">
            <ScrollArea className="h-full pr-4" data-oid="_k8alqs">
              <div className="space-y-6" data-oid="fut0v4r">
                <div className="space-y-4" data-oid="qmn.ywr">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    data-oid="20bwpar"
                  >
                    <Car className="h-4 w-4" data-oid="praxz:p" />
                    Especificações
                  </div>
                  <div
                    className="bg-muted/50 rounded-lg p-4 space-y-3"
                    data-oid="ntkmtb9"
                  >
                    <div className="grid grid-cols-2 gap-3" data-oid="0aneyi_">
                      <div data-oid="lw_pw.v">
                        <p
                          className="text-xs text-muted-foreground mb-1"
                          data-oid="7yr17rm"
                        >
                          Marca/Modelo
                        </p>
                        <p className="font-semibold" data-oid="nb9x56u">
                          {vehicle.brand} {vehicle.model}
                        </p>
                      </div>
                      <div data-oid=":9ye6bf">
                        <p
                          className="text-xs text-muted-foreground mb-1"
                          data-oid="og97eqb"
                        >
                          Condição
                        </p>
                        <Badge variant="secondary" data-oid="f467_o7">
                          {conditionLabels[vehicle.condition]}
                        </Badge>
                      </div>
                      <div data-oid="0tcyipg">
                        <p
                          className="text-xs text-muted-foreground mb-1"
                          data-oid="-632vwc"
                        >
                          Ano
                        </p>
                        <p className="font-medium" data-oid="-6drr.s">
                          {vehicle.year}/{vehicle.modelYear}
                        </p>
                      </div>
                      <div data-oid="h15wya0">
                        <p
                          className="text-xs text-muted-foreground mb-1"
                          data-oid="clzah2k"
                        >
                          Cor
                        </p>
                        <p className="font-medium" data-oid="-qq91q.">
                          {vehicle.color}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4" data-oid="kjdi.id">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    data-oid="3x-rilo"
                  >
                    <Settings className="h-4 w-4" data-oid="g8y7gvs" />
                    Detalhes Técnicos
                  </div>
                  <div
                    className="bg-muted/50 rounded-lg p-4 space-y-3"
                    data-oid="lbi:m-a"
                  >
                    <div
                      className="flex justify-between py-2 border-b"
                      data-oid="vpocb88"
                    >
                      <div
                        className="flex gap-2 text-sm text-muted-foreground"
                        data-oid="ks_0nlj"
                      >
                        <Gauge className="h-4 w-4" data-oid="y11svh6" />
                        Km
                      </div>
                      <span className="font-semibold" data-oid="u59kmwz">
                        {formatMileage(vehicle.mileage)}
                      </span>
                    </div>
                    <div
                      className="flex justify-between py-2 border-b"
                      data-oid="mh268jd"
                    >
                      <div
                        className="flex gap-2 text-sm text-muted-foreground"
                        data-oid="3f8z.bx"
                      >
                        <Fuel className="h-4 w-4" data-oid="k7pz9mm" />
                        Combustível
                      </div>
                      <span data-oid="1jv7-2f">
                        {fuelTypeLabels[vehicle.fuelType]}
                      </span>
                    </div>
                    <div
                      className="flex justify-between py-2 border-b"
                      data-oid="l1f4zs2"
                    >
                      <div
                        className="flex gap-2 text-sm text-muted-foreground"
                        data-oid="chmaulj"
                      >
                        <Settings className="h-4 w-4" data-oid="d5d_8q2" />
                        Câmbio
                      </div>
                      <span data-oid="ozcuefq">
                        {transmissionLabels[vehicle.transmission]}
                      </span>
                    </div>
                    <div
                      className="flex justify-between py-2"
                      data-oid="ujw-fzd"
                    >
                      <div
                        className="flex gap-2 text-sm text-muted-foreground"
                        data-oid="vdlz34z"
                      >
                        <DoorClosed className="h-4 w-4" data-oid="heh97r_" />
                        Portas
                      </div>
                      <span data-oid="p_ff0aq">{vehicle.doors}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4" data-oid="-.3dgcp">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    data-oid="nqmn53v"
                  >
                    <FileText className="h-4 w-4" data-oid="mefxsla" />
                    Documentação
                  </div>
                  <div
                    className="bg-muted/50 rounded-lg p-4 space-y-2"
                    data-oid="dil6mqv"
                  >
                    <div
                      className="flex justify-between text-sm"
                      data-oid="jkksk5l"
                    >
                      <span
                        className="text-muted-foreground"
                        data-oid="jj7uoj5"
                      >
                        Placa
                      </span>
                      <span
                        className="font-mono font-semibold"
                        data-oid="k0wkj:p"
                      >
                        {vehicle.licensePlate}
                      </span>
                    </div>
                    <div
                      className="flex justify-between text-sm"
                      data-oid="s2-pofa"
                    >
                      <span
                        className="text-muted-foreground"
                        data-oid="crwaagu"
                      >
                        Chassi
                      </span>
                      <span className="font-mono text-xs" data-oid="cmdgag8">
                        {vehicle.chassisNumber}
                      </span>
                    </div>
                    <div
                      className="flex justify-between text-sm"
                      data-oid="am5toup"
                    >
                      <span
                        className="text-muted-foreground"
                        data-oid="v9b_sb4"
                      >
                        RENAVAM
                      </span>
                      <span className="font-mono" data-oid="p9eznls">
                        {vehicle.renavam}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4" data-oid="akarcyf">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    data-oid="oyj4o90"
                  >
                    <CircleDollarSign className="h-4 w-4" data-oid="8:.du4l" />
                    Valores
                  </div>
                  <div
                    className="bg-muted/50 rounded-lg p-4 space-y-3"
                    data-oid="se1.9qx"
                  >
                    <div data-oid="v_serav">
                      <p
                        className="text-xs text-muted-foreground mb-1"
                        data-oid=":1zj93k"
                      >
                        Preço de Venda
                      </p>
                      <p
                        className="text-2xl font-bold text-green-600"
                        data-oid="fj_d0ck"
                      >
                        {formatCurrency(vehicle.price)}
                      </p>
                    </div>
                    {vehicle.costPrice && (
                      <>
                        <div data-oid="pm6kcux">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="6in1g_z"
                          >
                            Custo
                          </p>
                          <p
                            className="text-lg font-semibold"
                            data-oid="0g2ozrj"
                          >
                            {formatCurrency(vehicle.costPrice)}
                          </p>
                        </div>
                        <div className="pt-2 border-t" data-oid="i3clzvz">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="a9eahvv"
                          >
                            Margem
                          </p>
                          <p
                            className="text-lg font-semibold text-blue-600"
                            data-oid=":3gctih"
                          >
                            {formatCurrency(vehicle.price - vehicle.costPrice)}{" "}
                            (
                            {(
                              ((vehicle.price - vehicle.costPrice) /
                                vehicle.costPrice) *
                              100
                            ).toFixed(1)}
                            %)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
          <div className="col-span-3" data-oid="e4w3tke">
            <ScrollArea className="h-full pr-4" data-oid="6uf7wal">
              <div className="space-y-6" data-oid="i54m9xc">
                {vehicle.description && (
                  <div className="space-y-4" data-oid="w8swo7s">
                    <h3 className="font-semibold text-lg" data-oid="vb80c9v">
                      Descrição
                    </h3>
                    <div
                      className="bg-muted/30 rounded-lg p-4"
                      data-oid="cql7jtt"
                    >
                      <p className="text-sm leading-relaxed" data-oid="aqptlbj">
                        {vehicle.description}
                      </p>
                    </div>
                  </div>
                )}
                {vehicle.features.length > 0 && (
                  <div className="space-y-4" data-oid="9a6l_ot">
                    <h3 className="font-semibold text-lg" data-oid="8_:opc8">
                      Equipamentos
                    </h3>
                    <div className="grid grid-cols-2 gap-3" data-oid=".6eg-09">
                      {vehicle.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-muted/30 rounded-lg p-3"
                          data-oid="navtdy3"
                        >
                          <CheckCircle
                            className="h-4 w-4 text-green-600 shrink-0"
                            data-oid="vv6ame2"
                          />

                          <span
                            className="text-sm font-medium"
                            data-oid="gya3c7i"
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <Separator data-oid=".8-btbx" />
        <div
          className="flex justify-between px-6 py-4 bg-muted/30"
          data-oid="thyl6b5"
        >
          <p className="text-sm text-muted-foreground" data-oid="_aikocx">
            ID:{" "}
            <span className="font-mono" data-oid="2r:4hbi">
              {vehicle.id}
            </span>
          </p>
          <Button variant="outline" onClick={onClose} data-oid="6tmzovw">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
