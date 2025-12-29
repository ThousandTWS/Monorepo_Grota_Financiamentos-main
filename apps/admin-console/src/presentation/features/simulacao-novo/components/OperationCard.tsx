"use client";

import { Card, Divider, Select, Typography } from "antd";
import { useFormContext } from "react-hook-form";

type OperationCardProps = {
  personType: "PF" | "PJ" | null;
  operationType: "financiamento" | "autofin" | null;
  vehicleCategory: "leves" | "motos" | "pesados" | null;
  onPersonTypeChange: (value: "PF" | "PJ") => void;
  onOperationTypeChange: (value: "financiamento" | "autofin") => void;
  onVehicleCategoryChange: (value: "leves" | "motos" | "pesados") => void;
  installmentValue?: string;
  totalPaymentValue?: string;
  interestRateLabel?: string;
};

export function OperationCard({
  personType,
  operationType,
  vehicleCategory,
  onPersonTypeChange,
  onOperationTypeChange,
  onVehicleCategoryChange,
  installmentValue,
  totalPaymentValue,
  interestRateLabel,
}: OperationCardProps) {
  const { watch, setValue } = useFormContext();

  const name = watch("name");
  const cpf_cnpj = watch("cpf_cnpj");
  const email = watch("email");
  const phone = watch("phone");
  const vehicleModelMasked = watch("vehicleModel");
  const vehicleModel = vehicleModelMasked?.split("+")[1]?.trim();
  const vehiclePlate = watch("vehiclePlate");
  const priceFIPE = watch("priceFIPE");
  const amountFinanced = watch("amountFinanced");
  const termMonths = watch("termMonths");
  const address = watch("address");

  return (
    <Card className="w-full md:min-w-96 h-full bg-gradient-to-b from-[#134B73] via-[#134B73] to-[#134B73]">
      <div className="pointer-events-none absolute inset-0 opacity-40 blur-3xl">
        <div className="mx-auto h-full w-full max-w-2xl bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_65%)]" />
      </div>
      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <Typography.Text className="text-lg font-semibold text-white">Operacao</Typography.Text>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2 -mt-2">
            <Typography.Text className="text-sm font-medium text-white">Pessoa</Typography.Text>
            <Select
              value={personType ?? undefined}
              onChange={(value) => {
                onPersonTypeChange(value as "PF" | "PJ");
                setValue("cpf_cnpj", "");
              }}
              options={[
                { value: "PF", label: "Pessoa Fisica" },
                { value: "PJ", label: "Pessoa Juridica" },
              ]}
              className="w-full"
              popupMatchSelectWidth={false}
            />
          </div>
          <div className="space-y-2 -mt-2">
            <Typography.Text className="text-sm font-medium text-white">Tipo de operacao</Typography.Text>
            <Select
              value={operationType ?? undefined}
              onChange={(value) => onOperationTypeChange(value as "financiamento" | "autofin")}
              options={[
                { value: "financiamento", label: "Financiamento" },
                { value: "autofin", label: "AutoFin" },
              ]}
              className="w-full"
              popupMatchSelectWidth={false}
            />
          </div>
          <div className="space-y-2 -mt-2">
            <Typography.Text className="text-sm font-medium text-white">Categoria do veiculo</Typography.Text>
            <Select
              value={vehicleCategory ?? undefined}
              onChange={(value) => onVehicleCategoryChange(value as "leves" | "motos" | "pesados")}
              options={[
                { value: "leves", label: "Leves" },
                { value: "motos", label: "Motos" },
                { value: "pesados", label: "Pesados" },
              ]}
              className="w-full"
              popupMatchSelectWidth={false}
            />
          </div>
          <div className="space-y-3 border-white/25 bg-white/10 backdrop-blur-md">
            <div className="grid gap-2 rounded-md border p-3">
              <Typography.Text className="text-white font-semibold text-xl">
                Acompanhe a simulacao
              </Typography.Text>
              {name && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Cliente</span>
                  <span className="font-medium text-white">{name}</span>
                </div>
              )}
              {cpf_cnpj && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Documento</span>
                  <span className="font-medium text-white">{cpf_cnpj}</span>
                </div>
              )}
              {email && phone && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Contato</span>
                  <aside>
                    <p className="font-medium text-white">{email}</p>
                    <p className="font-medium text-white">{phone}</p>
                  </aside>
                </div>
              )}
              {(name || cpf_cnpj || email) &&
                (vehicleModel || vehiclePlate || priceFIPE || amountFinanced || termMonths) && (
                  <Divider className="bg-slate-50/50" />
                )}
              {vehicleModel && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Veiculo</span>
                  <span className="font-medium text-white">{vehicleModel}</span>
                </div>
              )}
              {vehiclePlate && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Placa</span>
                  <span className="font-medium text-white">{vehiclePlate}</span>
                </div>
              )}
              {priceFIPE && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Valor FIPE</span>
                  <span className="font-medium text-white">{priceFIPE}</span>
                </div>
              )}
              {amountFinanced && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Valor financiado</span>
                  <span className="font-medium text-white">{amountFinanced}</span>
                </div>
              )}
              {termMonths && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Prazo</span>
                  <span className="font-medium text-white">{termMonths} meses</span>
                </div>
              )}
              {installmentValue && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Parcela estimada</span>
                  <span className="font-medium text-white">{installmentValue}</span>
                </div>
              )}
              {totalPaymentValue && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Total a pagar</span>
                  <span className="font-medium text-white">{totalPaymentValue}</span>
                </div>
              )}
              {interestRateLabel && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Taxa estimada</span>
                  <span className="font-medium text-white">{interestRateLabel}</span>
                </div>
              )}
              {(vehicleModel || vehiclePlate || priceFIPE || amountFinanced || termMonths) &&
                address && <Divider className="bg-slate-50/50" />}
              {address && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 text-xs">Endereco</span>
                  <span className="font-medium text-right text-white">{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
