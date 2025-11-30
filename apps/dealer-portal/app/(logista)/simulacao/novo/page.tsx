"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Label } from "@/presentation/ui/label";
import { Switch } from "@/presentation/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/ui/select";
import {
  getAnos,
  getMarcas,
  getModelos,
  getValorVeiculo,
  type Ano,
  type Marca,
  type Modelo,
  type ValorVeiculo,
} from "./fipe";
import Image from "next/image";

type BasicOption = {
  id?: number;
  code?: string;
  name?: string;
  fullName?: string;
  enterprise?: string;
};

export default function SimuladorNovo() {
  const [personType, setPersonType] = useState<"PF" | "PJ" | null>(null);
  const [operationType, setOperationType] = useState<"financiamento" | "autofin" | null>(null);
  const [vehicleCategory, setVehicleCategory] = useState<"leves" | "motos" | "pesados" | null>(null);
  const [isZeroKm, setIsZeroKm] = useState(false);
  const [dealers, setDealers] = useState<BasicOption[]>([]);
  const [operators, setOperators] = useState<BasicOption[]>([]);
  const [sellers, setSellers] = useState<BasicOption[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [isOriginLoading, setIsOriginLoading] = useState(false);
  const [brands, setBrands] = useState<Marca[]>([]);
  const [models, setModels] = useState<Modelo[]>([]);
  const [years, setYears] = useState<Ano[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<ValorVeiculo | null>(null);
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(false);
  const [isYearsLoading, setIsYearsLoading] = useState(false);

  const getVehicleTypeId = (category: typeof vehicleCategory) => {
    if (category === "motos") return 2;
    if (category === "pesados") return 3;
    return 1;
  };
  const vehicleTypeId = getVehicleTypeId(vehicleCategory);

  const loadBrands = async (category: typeof vehicleCategory) => {
    if (!category) return;

    try {
      setIsBrandsLoading(true);
      const response = await getMarcas(getVehicleTypeId(category));
      setBrands(response);
    } catch (error) {
      toast.error("Não foi possível carregar as marcas FIPE.");
      console.error("[FIPE] getMarcas", error);
    } finally {
      setIsBrandsLoading(false);
    }
  };

  const handleBrandChange = async (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedModel(null);
    setSelectedYear(null);
    setModels([]);
    setYears([]);
    setVehicleInfo(null);

    try {
      setIsModelsLoading(true);
      const response = await getModelos(vehicleTypeId, brandId);
      setModels(response);
    } catch (error) {
      toast.error("Não foi possível carregar os modelos FIPE.");
      console.error("[FIPE] getModelos", error);
    } finally {
      setIsModelsLoading(false);
    }
  };

  const handleModelChange = async (modelId: string) => {
    setSelectedModel(modelId);
    setSelectedYear(null);
    setYears([]);
    setVehicleInfo(null);

    try {
      setIsYearsLoading(true);
      if (!selectedBrand) return;
      const response = await getAnos(vehicleTypeId, selectedBrand, modelId);
      setYears(response);
    } catch (error) {
      toast.error("Não foi possível carregar os anos FIPE.");
      console.error("[FIPE] getAnos", error);
    } finally {
      setIsYearsLoading(false);
    }
  };

  const handleYearChange = async (yearId: string) => {
    if (!selectedBrand || !selectedModel) return;
    setSelectedYear(yearId);

    try {
      const response = await getValorVeiculo(vehicleTypeId, selectedBrand, selectedModel, yearId);
      setVehicleInfo(response);
    } catch (error) {
      toast.error("Não foi possível carregar os dados do veículo FIPE.");
      console.error("[FIPE] getValorVeiculo", error);
    }
  };

  useEffect(() => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setBrands([]);
    setModels([]);
    setYears([]);
    setVehicleInfo(null);

    if (vehicleCategory) {
      loadBrands(vehicleCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleCategory]);

  useEffect(() => {
    const loadOriginOptions = async () => {
      try {
        setIsOriginLoading(true);
        const [dealersRes, sellersRes, operatorsRes] = await Promise.all([
          fetch("/api/dealers"),
          fetch("/api/sellers"),
          fetch("/api/operators"),
        ]);

        if (!dealersRes.ok || !sellersRes.ok || !operatorsRes.ok) {
          throw new Error("Erro ao carregar origem");
        }

        const [dealersPayload, sellersPayload, operatorsPayload] = await Promise.all([
          dealersRes.json(),
          sellersRes.json(),
          operatorsRes.json(),
        ]);

        setDealers(Array.isArray(dealersPayload) ? dealersPayload : []);
        setSellers(Array.isArray(sellersPayload) ? sellersPayload : []);
        setOperators(Array.isArray(operatorsPayload) ? operatorsPayload : []);
      } catch (error) {
        toast.error("Não foi possível carregar lojas, vendedores e operadores.");
        console.error("[simulacao/novo] loadOriginOptions", error);
      } finally {
        setIsOriginLoading(false);
      }
    };

    loadOriginOptions();
  }, []);

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-4xl font-light text-[#134B73]">Nova Simulação</h1>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader className="">
            <h2 className="text-lg font-semibold text-[#134B73]">Selecione a Origem</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Loja</Label>
                <Select
                  value={selectedDealer ?? ""}
                  onValueChange={setSelectedDealer}
                  disabled={isOriginLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isOriginLoading ? "Carregando lojas..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {dealers.length === 0 && !isOriginLoading && (
                      <SelectItem value="placeholder" disabled>
                        Nenhuma loja disponível
                      </SelectItem>
                    )}
                    {dealers.map((dealer) => {
                      const value = dealer.id?.toString() ?? dealer.code ?? dealer.name ?? "";
                      const label = dealer.enterprise ?? dealer.fullName ?? dealer.name ?? `Loja ${value}`;
                      if (!value) return null;
                      return (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Operador</Label>
                <Select
                  value={selectedOperator ?? ""}
                  onValueChange={setSelectedOperator}
                  disabled={isOriginLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isOriginLoading ? "Carregando operadores..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.length === 0 && !isOriginLoading && (
                      <SelectItem value="placeholder" disabled>
                        Nenhum operador disponível
                      </SelectItem>
                    )}
                    {operators.map((operator) => {
                      const value = operator.id?.toString() ?? operator.code ?? operator.name ?? "";
                      const label = operator.fullName ?? operator.name ?? `Operador ${value}`;
                      if (!value) return null;
                      return (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Vendedor</Label>
                <Select
                  value={selectedSeller ?? ""}
                  onValueChange={setSelectedSeller}
                  disabled={isOriginLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isOriginLoading ? "Carregando vendedores..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.length === 0 && !isOriginLoading && (
                      <SelectItem value="placeholder" disabled>
                        Nenhum vendedor disponível
                      </SelectItem>
                    )}
                    {sellers.map((seller) => {
                      const value = seller.id?.toString() ?? seller.code ?? seller.name ?? "";
                      const label = seller.fullName ?? seller.name ?? `Vendedor ${value}`;
                      if (!value) return null;
                      return (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-none bg-[#e8f2f9] shadow-sm">
        <div className="flex items-center justify-center ">
          <Image
            src="https://res.cloudinary.com/dqagks3zl/image/upload/v1764448576/baixados_kitmbz.png"
            width={1080}
            height={1080}
            alt="Simulação Grota"
            className="h-auto w-full"
            priority
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#134B73]">Operação</h2>
            <p className="text-md font-medium text-[#134B73]">Qual o tipo de simulação deseja realizar?</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  personType === "PF"
                    ? "border-[#134B73] bg-[#134B73] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#134B73]"
                }`}
                onClick={() => setPersonType("PF")}
              >
                Pessoa Física
              </button>
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  personType === "PJ"
                    ? "border-[#134B73] bg-[#134B73] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#134B73]"
                }`}
                onClick={() => setPersonType("PJ")}
              >
                Pessoa Jurídica
              </button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <p className="text-md font-medium text-[#134B73] mb-3">Qual o tipo de operação desejada?</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  operationType === "financiamento"
                    ? "border-[#134B73] bg-[#134B73] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#134B73]"
                }`}
                onClick={() => setOperationType("financiamento")}
              >
                Financiamento
              </button>
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  operationType === "autofin"
                    ? "border-[#134B73] bg-[#134B73] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#134B73]"
                }`}
                onClick={() => setOperationType("autofin")}
              >
                AutoFin
              </button>
            </div>
            <p className="text-md font-medium text-[#134B73] mt-4">Qual a categoria do veiculo?</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  vehicleCategory === "leves"
                    ? "border-[#134B73] bg-[#134B73] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#134B73]"
                }`}
                onClick={() => setVehicleCategory("leves")}
              >
                Leves
              </button>
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  vehicleCategory === "motos"
                    ? "border-[#134B73] bg-[#134B73] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#134B73]"
                }`}
                onClick={() => setVehicleCategory("motos")}
              >
                Motos
              </button>
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  vehicleCategory === "pesados"
                    ? "border-[#134B73] bg-[#134B73] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#134B73]"
                }`}
                onClick={() => setVehicleCategory("pesados")}
              >
                Pesados
              </button>
            </div>
          </div>
        </CardHeader>
      </Card>


      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold text-[#134B73]">Dados do Veículo</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-md border px-4 py-2">
              <Switch checked={isZeroKm} onCheckedChange={setIsZeroKm} />
              <span className="text-sm font-medium text-[#134B73]">Veículo 0km</span>
            </div>
            <div className="space-y-2">
              <Label className="text-[#134B73]">Ano Modelo</Label>
              <Select
                value={selectedYear ?? ""}
                onValueChange={handleYearChange}
                disabled={!selectedModel || isYearsLoading}
              >
                <SelectTrigger className="w-full">
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
            <div className="space-y-2">
              <Label className="text-[#134B73]">Marca</Label>
              <Select
                value={selectedBrand ?? ""}
                onValueChange={handleBrandChange}
                disabled={!vehicleCategory || isBrandsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !vehicleCategory
                        ? "Selecione a categoria"
                        : isBrandsLoading
                        ? "Carregando marcas..."
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
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-[#134B73]">Modelo</Label>
              <Select
                value={selectedModel ?? ""}
                onValueChange={handleModelChange}
                disabled={!selectedBrand || isModelsLoading}
              >
                <SelectTrigger className="w-full">
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
            <div className="space-y-2">
              <Label className="text-[#134B73]">Versão</Label>
              <Select value={vehicleInfo?.model ?? undefined} disabled={!vehicleInfo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleInfo && (
                    <SelectItem value={vehicleInfo.model}>{vehicleInfo.model}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#134B73]">Combustível</Label>
              <Select value={vehicleInfo?.fuel ?? undefined} disabled={!vehicleInfo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleInfo && (
                    <SelectItem value={vehicleInfo.fuel}>{vehicleInfo.fuel}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
