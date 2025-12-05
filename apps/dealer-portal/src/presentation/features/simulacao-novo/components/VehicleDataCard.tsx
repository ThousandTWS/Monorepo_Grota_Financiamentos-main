import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Switch } from "@/presentation/ui/switch";
import { Label } from "@/presentation/ui/label";
import { Input } from "@/presentation/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/ui/select";
import { Ano, Marca, Modelo } from "@/application/services/fipe";
import { Controller, useFormContext } from "react-hook-form";

type VehicleDataCardProps = {
  brands: Marca[];
  models: Modelo[];
  years: Ano[];
  selectedBrand: string | null;
  selectedModel: string | null;
  selectedYear: string | null;
  onBrandChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onYearChange: (value: string) => void;
  isBrandsLoading: boolean;
  isModelsLoading: boolean;
  isYearsLoading: boolean;
  onLoanTermChange: (value: string) => void;
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
  onLoanTermChange,
}: VehicleDataCardProps) {
  const { register, getValues } = useFormContext();

  const [showTermDropdown, setShowTermDropdown] = useState(false);
  const loanTerms = ["12", "24", "36", "48", "60"];

  return (
    <Card>
      <CardContent className="space-y-5 px-0">
        <CardHeader className="px-0">
          <h2 className="text-lg font-semibold text-[#134B73]">Dados do Veículo</h2>
        </CardHeader>

        <div className="grid gap-4 md:grid-cols-7">
          <Controller
              name="vehicle0KM"
              render={({ field }) => (
                <div className="flex items-center gap-3 rounded-md border md:max-w-52 w-fit h-fit p-4">
                  <Switch
                    id="vehicle0KM"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-md font-medium text-[#134B73]">Veículo 0km</span>
                </div>
              )}
            />
          <Controller
            name="vehicleBrand"
            render={({ field }) => (
              <div id="vehicleBrand" className="space-y-2">
                <Label className="text-[#134B73] text-md">Marca</Label>
                <Select
                  disabled={!brands.length || isBrandsLoading}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onBrandChange(value);
                  }}
                >
                  <SelectTrigger className="w-full md:max-w-52 h-12">
                    <SelectValue
                      placeholder={
                        isBrandsLoading
                          ? "Carregando marcas..."
                          : !brands.length
                          ? "Selecione a categoria"
                          : "Selecione"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.code} value={brand.code}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <Controller
            name="vehicleModel"
            render={({ field }) => (
              <div id="vehicleModel" className="space-y-2">
                <Label className="text-[#134B73] text-md">Modelo</Label>
                <Select
                  disabled={!getValues("vehicleBrand") || isModelsLoading}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onModelChange(value);
                  }}
                >
                  <SelectTrigger className="w-full md:max-w-64 h-12">
                    <SelectValue
                      placeholder={
                        !selectedBrand
                          ? "Selecione a marca"
                          : isModelsLoading
                          ? "Carregando modelos..."
                          : "Selecione"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.code} value={model.code}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            name="vehicleYear"
            render={({ field }) => (
              <div id="vehicleYear" className="space-y-2">
                <Label className="text-[#134B73] text-md">Ano Modelo</Label>
                <Select
                  disabled={!getValues("vehicleModel") || isYearsLoading}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onYearChange(value);
                  }}
                >
                  <SelectTrigger className="w-full md:max-w-48 h-12">
                    <SelectValue
                      placeholder={
                        !selectedModel
                          ? "Selecione o modelo"
                          : isYearsLoading
                          ? "Carregando anos..."
                          : "Selecione"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.code} value={year.code}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <div className="space-y-2">
            <Label className="text-[#134B73] text-md">Valor FIPE</Label>
            <Input
              className="w-full md:max-w-48 h-12"
              // value={vehicleInfoPrice ?? ""}
              readOnly
              placeholder="Aguardando FIPE"
              {...register("priceFIPE")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#134B73] text-md">Placa</Label>
            <Input
              className="w-full md:max-w-44 h-12"
              // value={vehiclePlate}
              // onChange={(e) => onPlateChange(e.target.value)}
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
                    <Label className="text-white text-base font-semibold">Valor Financiado</Label>
                    <Input
                      className="w-full font-bold text-3xl md:text-4xl text-[#134B73] bg-white/95 backdrop-blur-sm h-16 md:h-20 border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 focus-visible:scale-[1.02] focus-visible:border-white"
                      placeholder="R$ 0,00"
                      maxLength={18}
                      {...register("amountFinanced")}
                    />
                  </div>
                  {/* Fazer um select */}
                  <div className="space-y-2 relative">
                    <Label className="text-white text-base font-semibold">Prazo (meses)</Label>
                    <Input
                      className="w-full font-bold text-3xl md:text-4xl text-[#134B73] bg-white/95 backdrop-blur-sm h-16 md:h-20 border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 focus-visible:scale-[1.02] focus-visible:border-white"
                      // value={loanTerm}
                      // onFocus={() => setShowTermDropdown(true)}
                      // onBlur={() => setTimeout(() => setShowTermDropdown(false), 120)}
                      // onChange={(e) => onLoanTermChange(e.target.value)}
                      placeholder="Digite ou selecione o prazo"
                      maxLength={3}
                      {...register("termMonths")}
                    />
                    {showTermDropdown && (
                      <div className="absolute inset-x-0 bottom-full mb-2 z-20 rounded-md border border-white/60 bg-white text-[#134B73] shadow-2xl">
                        {loanTerms.map((term) => (
                          <button
                            key={term}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-[#e7eef5] transition-colors"
                            onMouseDown={(e) => {
                              onLoanTermChange(term);
                              setShowTermDropdown(false);
                            }}
                          >
                            {term} meses
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
