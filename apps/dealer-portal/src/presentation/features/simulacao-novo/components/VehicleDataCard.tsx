import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Switch } from "@/presentation/ui/switch";
import { Label } from "@/presentation/ui/label";
import { Input } from "@/presentation/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/ui/select";
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
  const [brandQuery, setBrandQuery] = useState("");

  const filteredBrands = useMemo(() => {
    const query = brandQuery.trim().toLowerCase();
    if (!query) return brands;
    return brands.filter((brand) => brand.name.toLowerCase().includes(query));
  }, [brands, brandQuery]);

  return (
    <Card>
      <CardContent className="space-y-5 px-0">
        <CardHeader className="px-0">
          <h2 className="text-lg font-semibold text-[#134B73]">Dados do Veículo</h2>
        </CardHeader>

        <div className="grid gap-4 items-center md:grid-cols-7">
          <Controller
              name="vehicle0KM"
              render={({ field }) => (
                <div className="flex items-center gap-3 rounded-lg border md:max-w-52 w-fit h-fit p-4">
                  <Switch
                    id="vehicle0KM"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-sky-800 data-[state=unchecked]:bg-gray-300"
                    disabled={!brands.length}
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
                    const[brandCode, brandName] = value.split("+");
                    field.onChange(value);
                    onBrandChange(brandCode);
                  }}
                >
                  <SelectTrigger className="w-full min-h-12 md:max-w-52">
                    <SelectValue
                      placeholder={
                        isBrandsLoading
                          ? "Carregando marcas..."
                          : !brands.length
                          ? "Selecione a categoria"
                          : "Selecione"
                      }
                      className="h-full"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        value={brandQuery}
                        onChange={(e) => setBrandQuery(e.target.value)}
                        placeholder="Buscar marca..."
                        className="h-9"
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    {filteredBrands.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">Nenhuma marca encontrada</div>
                    )}
                    {filteredBrands.map((brand) => (
                      <SelectItem key={brand.code} value={`${brand.code}+${brand.name}`}>
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
                    const[modelCode, modelName] = value.split("+");
                    field.onChange(value);
                    onModelChange(modelCode);
                  }}
                >
                  <SelectTrigger className="w-full min-h-12 md:max-w-64">
                    <SelectValue
                      placeholder={
                        !selectedBrand
                          ? "Selecione a marca"
                          : isModelsLoading
                          ? "Carregando modelos..."
                          : "Selecione"
                      }
                      className="h-full"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.code} value={`${model.code}+${model.name}`}>
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
                  <SelectTrigger className="w-full min-h-12 md:max-w-48">
                    <SelectValue
                      placeholder={
                        !selectedModel
                          ? "Selecione o modelo"
                          : isYearsLoading
                          ? "Carregando anos..."
                          : "Selecione"
                      }
                      className="h-full"
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
              disabled={!brands.length || isBrandsLoading || isModelsLoading || isYearsLoading}
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
                      {...register("amountFinanced", {
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = maskBRL(e.target.value);
                        }
                      })}
                    />
                  </div>
                  {/* Fazer um select */}
                  <div className="space-y-2 relative">
                    <Controller
                      name="termMonths"
                      render={({ field }) => (
                        <div id="termMonths" className="space-y-2">
                          <Label className="text-white text-base font-semibold">Prazo (meses)</Label>
                      <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            <SelectTrigger className="w-full font-bold text-3xl md:text-4xl text-[#134B73] bg-white/95 backdrop-blur-sm min-h-16 md:min-h-20 border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 focus-visible:scale-[1.02] focus-visible:border-white">
                              <SelectValue
                                placeholder="Selecione o prazo"
                                className="h-full"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {loanTerms.map((term) => (
                                <SelectItem key={term} value={term}>
                                  {term} meses
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
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
