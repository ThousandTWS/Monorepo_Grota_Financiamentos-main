"use client";

import { Card, Input, Select, Switch, Typography } from "antd";
import { Ano, Marca, Modelo } from "@/application/services/fipe";
import { Controller, useFormContext } from "react-hook-form";
import { maskBRL } from "@/lib/masks";

type VehicleDataCardProps = {
  brands: Marca[];
  models: Modelo[];
  years: Ano[];
  selectedBrand: string | null;
  selectedModel: string | null;
  onBrandChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onYearChange: (value: string) => void;
  isBrandsLoading: boolean;
  isModelsLoading: boolean;
  isYearsLoading: boolean;
};

export function VehicleDataCard({
  brands,
  models,
  years,
  selectedBrand,
  selectedModel,
  onBrandChange,
  onModelChange,
  onYearChange,
  isBrandsLoading,
  isModelsLoading,
  isYearsLoading,
}: VehicleDataCardProps) {
  const { register, getValues } = useFormContext();
  const loanTerms = ["12", "24", "36", "48", "60"];

  return (
    <Card title={<span className="text-lg font-semibold text-[#134B73]">Dados do Veiculo</span>}>
      <div className="grid gap-4 items-center md:grid-cols-7">
        <Controller
          name="vehicle0KM"
          render={({ field }) => (
            <div className="flex items-center gap-3 rounded-lg border md:max-w-52 w-fit h-fit p-4">
              <Switch checked={field.value} onChange={field.onChange} disabled={!brands.length} />
              <span className="text-md font-medium text-[#134B73]">Veiculo 0km</span>
            </div>
          )}
        />
        <Controller
          name="vehicleBrand"
          render={({ field }) => (
            <div id="vehicleBrand" className="space-y-2">
              <Typography.Text className="text-[#134B73] text-md">Marca</Typography.Text>
              <Select
                disabled={!brands.length || isBrandsLoading}
                value={field.value || undefined}
                onChange={(value) => {
                  const [brandCode] = value.split("+");
                  field.onChange(value);
                  onBrandChange(brandCode);
                }}
                placeholder={
                  isBrandsLoading
                    ? "Carregando marcas..."
                    : !brands.length
                    ? "Selecione a categoria"
                    : "Selecione"
                }
                options={brands.map((brand) => ({
                  value: `${brand.code}+${brand.name}`,
                  label: brand.name,
                }))}
                className="w-full md:max-w-52"
              />
            </div>
          )}
        />
        <Controller
          name="vehicleModel"
          render={({ field }) => (
            <div id="vehicleModel" className="space-y-2">
              <Typography.Text className="text-[#134B73] text-md">Modelo</Typography.Text>
              <Select
                disabled={!getValues("vehicleBrand") || isModelsLoading}
                value={field.value || undefined}
                onChange={(value) => {
                  const [modelCode] = value.split("+");
                  field.onChange(value);
                  onModelChange(modelCode);
                }}
                placeholder={
                  !selectedBrand
                    ? "Selecione a marca"
                    : isModelsLoading
                    ? "Carregando modelos..."
                    : "Selecione"
                }
                options={models.map((model) => ({
                  value: `${model.code}+${model.name}`,
                  label: model.name,
                }))}
                className="w-full md:max-w-64"
              />
            </div>
          )}
        />

        <Controller
          name="vehicleYear"
          render={({ field }) => (
            <div id="vehicleYear" className="space-y-2">
              <Typography.Text className="text-[#134B73] text-md">Ano Modelo</Typography.Text>
              <Select
                disabled={!getValues("vehicleModel") || isYearsLoading}
                value={field.value || undefined}
                onChange={(value) => {
                  field.onChange(value);
                  onYearChange(value);
                }}
                placeholder={
                  !selectedModel
                    ? "Selecione o modelo"
                    : isYearsLoading
                    ? "Carregando anos..."
                    : "Selecione"
                }
                options={years.map((year) => ({
                  value: year.code,
                  label: year.name,
                }))}
                className="w-full md:max-w-48"
              />
            </div>
          )}
        />

        <div className="space-y-2">
          <Typography.Text className="text-[#134B73] text-md">Valor FIPE</Typography.Text>
          <Input
            className="w-full md:max-w-48 h-12"
            readOnly
            placeholder="Aguardando FIPE"
            {...register("priceFIPE")}
            disabled={!brands.length || isBrandsLoading || isModelsLoading || isYearsLoading}
          />
        </div>
        <div className="space-y-2">
          <Typography.Text className="text-[#134B73] text-md">Placa</Typography.Text>
          <Input
            className="w-full md:max-w-44 h-12"
            placeholder="ABC-1234"
            maxLength={8}
            {...register("vehiclePlate")}
          />
        </div>
        <div className="md:col-span-7">
          <div className="relative overflow-visible rounded-xl bg-gradient-to-br from-[#134B73] via-[#0f3d5d] to-[#0a2940] text-white shadow-2xl border-2 border-white/20 px-6 py-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-14 bg-gradient-to-b from-white to-white/40 rounded-full" />
                <div>
                  <p className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white drop-shadow-lg">
                    Valor financiado
                  </p>
                  <p className="text-sm md:text-base font-medium text-white/90 mt-1">
                    Configure seu financiamento
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Typography.Text className="text-white text-base font-semibold">
                    Valor Financiado
                  </Typography.Text>
                  <Input
                    className="w-full font-bold text-3xl md:text-4xl text-[#134B73] bg-white/95 backdrop-blur-sm h-16 md:h-20 border-2 border-white shadow-xl"
                    placeholder="R$ 0,00"
                    maxLength={18}
                    {...register("amountFinanced", {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        e.target.value = maskBRL(e.target.value);
                      },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Controller
                    name="termMonths"
                    render={({ field }) => (
                      <div id="termMonths" className="space-y-2">
                        <Typography.Text className="text-white text-base font-semibold">
                          Prazo (meses)
                        </Typography.Text>
                        <Select
                          value={field.value || undefined}
                          onChange={(value) => field.onChange(value)}
                          options={loanTerms.map((term) => ({
                            value: term,
                            label: `${term} meses`,
                          }))}
                          className="w-full"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
