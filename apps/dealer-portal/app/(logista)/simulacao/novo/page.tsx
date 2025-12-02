"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Label } from "@/presentation/ui/label";
import { Switch } from "@/presentation/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/ui/select";
import { Input } from "@/presentation/ui/input";
import { Button } from "@/presentation/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
import { SimulacaoPFForm } from "./components/SimulacaoPFForm";
import { maskCEP, maskBRL, maskPhone } from "@/application/core/utils/masks";

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
  const [, setDealers] = useState<BasicOption[]>([]);
  const [, setOperators] = useState<BasicOption[]>([]);
  const [, setSellers] = useState<BasicOption[]>([]);
  const [, setIsOriginLoading] = useState(false);
  const [brands, setBrands] = useState<Marca[]>([]);
  const [models, setModels] = useState<Modelo[]>([]);
  const [years, setYears] = useState<Ano[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<ValorVeiculo | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [personalCpf, setPersonalCpf] = useState("");
  const [personalMother, setPersonalMother] = useState("");
  const [personalHasCnh, setPersonalHasCnh] = useState(false);
  const [personalCategoryCnh, setPersonalCategoryCnh] = useState("");
  const [personalCivilStatus, setPersonalCivilStatus] = useState("");
  const [personalBirthUf, setPersonalBirthUf] = useState("");
  const [personalBirthCity, setPersonalBirthCity] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [personalZip, setPersonalZip] = useState("");
  const [financedValue, setFinancedValue] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");

  const UF_CAPITALS: Record<string, string> = {
    AC: "Rio Branco",
    AL: "Maceió",
    AP: "Macapá",
    AM: "Manaus",
    BA: "Salvador",
    CE: "Fortaleza",
    DF: "Brasília",
    ES: "Vitória",
    GO: "Goiânia",
    MA: "São Luís",
    MT: "Cuiabá",
    MS: "Campo Grande",
    MG: "Belo Horizonte",
    PA: "Belém",
    PB: "João Pessoa",
    PR: "Curitiba",
    PE: "Recife",
    PI: "Teresina",
    RJ: "Rio de Janeiro",
    RN: "Natal",
    RS: "Porto Alegre",
    RO: "Porto Velho",
    RR: "Boa Vista",
    SC: "Florianópolis",
    SP: "São Paulo",
    SE: "Aracaju",
    TO: "Palmas",
  };
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(false);
  const [isYearsLoading, setIsYearsLoading] = useState(false);

  

  const getVehicleTypeId = (category: typeof vehicleCategory) => {
    if (category === "motos") return 2;
    if (category === "pesados") return 3;
    return 1;
  };
  const vehicleTypeId = getVehicleTypeId(vehicleCategory);

  const userFormSchema = z.object({
    name_4982700057: z.string().min(1, "CPF/CNPJ é obrigatório"),
    name_4755113144: z.string().email("E-mail inválido"),
    name_3669403506: z.string().min(1, "Telefone é obrigatório"),
    name_9434379508: z.string().min(1, "Nome da mãe é obrigatório"),
    name_7782587077: z.string().min(1, "Estado civil é obrigatório"),
    name_7327938076: z.string().min(1, "Informe se possui CNH"),
    name_1935449147: z.string().min(1, "Categoria da CNH é obrigatória"),
    name_8024901188: z.string().min(1, "UF é obrigatório"),
    name_7788864668: z.string().min(1, "Naturalidade é obrigatória"),
    name_1345094538: z.string().min(1, "CEP é obrigatório"),
  });

  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
  });

  const handleUserSubmit = (values: z.infer<typeof userFormSchema>) => {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

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

  const maskPlate = (value: string) => {
    const sanitized = (value || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 7);
    const prefix = sanitized.slice(0, 3);
    const suffix = sanitized.slice(3);
    return suffix ? `${prefix}-${suffix}` : prefix;
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
    <section className="space-y-5 w-full">
      <div>
        <h1 className="text-4xl font-light text-[#134B73]">Nova Simulação</h1>
      </div>
      <div className="grid gap-2 lg:grid-cols-[0.4fr_2fr] items-start">
        <Card className="w-[95%] h-[100%]">
          <CardHeader className="-mt-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-[#134B73]">Operação</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4">
              <div className="space-y-2 -mt-2">
                <p className="text-sm font-medium text-[#134B73]">Pessoa</p>
                <Select value={personType ?? ""} onValueChange={(value: "PF" | "PJ") => setPersonType(value)}>
                <SelectTrigger className=" text-[#134B73] w-[100%]" >
                    <SelectValue placeholder="Selecione PF ou PJ"  />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PF">Pessoa Fisica</SelectItem>
                    <SelectItem value="PJ">Pessoa Juridica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 -mt-2">
                <p className="text-sm font-medium text-[#134B73]">Tipo de operação</p>
                <Select
                  value={operationType ?? ""}
                  onValueChange={(value: "financiamento" | "autofin") => setOperationType(value)}
                >
                  <SelectTrigger className=" w-[100%]">
                    <SelectValue placeholder="Selecione a operação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financiamento">Financiamento</SelectItem>
                    <SelectItem value="autofin">AutoFin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 -mt-2">
                <p className="text-sm font-medium text-[#134B73]">Categoria do veículo</p>
                <Select
                  value={vehicleCategory ?? ""}
                  onValueChange={(value: "leves" | "motos" | "pesados") => setVehicleCategory(value)}
                >
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leves">Leves</SelectItem>
                    <SelectItem value="motos">Motos</SelectItem>
                    <SelectItem value="pesados">Pesados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="-mt-5">
            <h2 className="text-lg font-semibold text-[#134B73] -mb-5">Dados Pessoais</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-2 mt-3">
                <Label className="text-[#134B73]">CPF/CNPJ</Label>
                <Input
                  className="w-[75%]"
                  placeholder="Digite seu CPF ou CNPJ"
                  value={personalCpf}
                  onChange={(e) => setPersonalCpf(e.target.value)}
                />
              </div>
              <div className="space-y-2 mt-3 md:col-span-2">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                  <div className="flex flex-col gap-1 w-full md:w-[48%]">
                    <Label htmlFor="personalEmail" className="text-[#134B73]">E-mail</Label>
                    <Input
                      id="personalEmail"
                      className="w-full"
                      placeholder="Informe seu e-mail"
                      type="email"
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full md:w-[48%]">
                    <Label htmlFor="personalPhone" className="text-[#134B73]">Telefone</Label>
                    <Input
                      id="personalPhone"
                      className="w-[80%]"
                      placeholder="(11) 99999-9999"
                      value={personalPhone}
                      maxLength={15}
                      onChange={(e) => setPersonalPhone(maskPhone(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full md:w-[48%]">
                    <Label htmlFor="personalMother" className="text-[#134B73]">Nome da Mãe</Label>
                    <Input
                      id="personalMother"
                      className="w-full"
                      placeholder="Digite nome da mãe"
                      value={personalMother}
                      onChange={(e) => setPersonalMother(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
                <div className="space-y-2 mt-2">   
                <Label htmlFor="categoryCNH" className="text-[#134B73]">Estado Civil</Label>
                <Select
                  value={personalCivilStatus}
                  onValueChange={(value) => setPersonalCivilStatus(value)}
                >
                  <SelectTrigger className="w-[60%]">
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="A">Solteiro</SelectItem>
                    <SelectItem value="B">Casado</SelectItem>
                    <SelectItem value="AB">Separado</SelectItem>
                    <SelectItem value="C">Divorciado</SelectItem>
                    <SelectItem value="D">Viúvo</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div className="space-y-2 mt-2">
                <Label htmlFor="haveCNH" className="text-[#134B73]">Possui CNH?</Label>
                <div className="flex items-center gap-3 rounded-md border px-3 py-2 w-[75%]">
                  <Switch
                    id="haveCNH-inline"
                    checked={personalHasCnh}
                    onCheckedChange={(checked) => setPersonalHasCnh(!!checked)}
                  />
                  <span className="text-sm text-muted-foreground">{personalHasCnh ? "Sim" : "Não"}</span>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <Label className="text-[#134B73]">CEP</Label>
                <Input
                  className="w-[75%]"
                  placeholder="00000-000"
                  maxLength={9}
                  value={personalZip}
                  onChange={(e) => setPersonalZip(maskCEP(e.target.value))}
                />
              </div>
              <div className="space-y-2 mt-3">
                <Label htmlFor="categoryCNH" className="text-[#134B73]">Categoria da CNH</Label>
                <Select
                  value={personalCategoryCnh}
                  onValueChange={(value) => setPersonalCategoryCnh(value)}
                  disabled={!personalHasCnh}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            
              <div className="space-y-2 mt-3">
                <Label htmlFor="birthPlace" className="text-[#134B73]">UF</Label>
                <Select
                  value={personalBirthUf}
                  onValueChange={(value) => {
                    setPersonalBirthUf(value);
                    setPersonalBirthCity(UF_CAPITALS[value] ?? personalBirthCity);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a UF" />
                  </SelectTrigger>

                  <SelectContent>
                    {[
                      "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
                      "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
                      "SP","SE","TO",
                    ].map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 mt-3">
                <Label htmlFor="birthPlace" className="text-[#134B73]">Naturalidade</Label>
                <Input
                  id="birthPlace"
                  className="w-full"
                  placeholder="Informe a naturalidade"
                  value={personalBirthCity}
                  onChange={(e) => setPersonalBirthCity(e.target.value)}
                />
            </div>
 shad            </div>
          </CardContent>
        </Card>
      </div>

      {personType === "PF" && (
        <SimulacaoPFForm
          summaryVehicle={{
            personType,
            operationType:
              operationType === "financiamento"
                ? "Financiamento"
                : operationType === "autofin"
                ? "AutoFin"
                : "",
            vehicleCategory:
              vehicleCategory === "leves"
                ? "Leves"
                : vehicleCategory === "motos"
                ? "Motos"
                : vehicleCategory === "pesados"
                ? "Pesados"
                : "",
            vehicleBrand: brands.find((brand) => brand.code === selectedBrand)?.name ?? "",
            vehicleModel: models.find((model) => model.code === selectedModel)?.name ?? "",
            vehicleYear: years.find((year) => year.code === selectedYear)?.name ?? "",
            vehicleFuel: vehicleInfo?.fuel,
            fipeCode: vehicleInfo?.codeFipe,
            fipePrice: vehicleInfo?.price,
            entryPrice: "",
            vehiclePlate,
          }}
        />
      )}

      {personType === "PJ" && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-[#134B73]">Cadastro Pessoa Jurídica</h2>
              <p className="text-sm text-[#134B73]">
                Adicione aqui o fluxo de cadastro da PJ quando os campos estiverem definidos.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No momento exibimos apenas o cadastro de pessoa física. Envie os campos necessários que conecto o formulário PJ.
            </p>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader className="-mt-5">
          <h2 className="text-lg font-semibold text-[#134B73] -mb-5">Dados do Veículo</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <div className="flex items-center gap-3 rounded-md border px-3 py-2 md:max-w-44">
              <Switch checked={isZeroKm} onCheckedChange={setIsZeroKm} />
              <span className="text-sm font-medium text-[#134B73]">Veículo 0km</span>
            </div>
            <div className="space-y-2">
              <Label className="text-[#134B73]">Marca</Label>
              <Select
                value={selectedBrand ?? ""}
                onValueChange={handleBrandChange}
                disabled={!vehicleCategory || isBrandsLoading}
              >
                <SelectTrigger className="w-full md:max-w-44">
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
            <div className="space-y-2">
              <Label className="text-[#134B73]">Modelo</Label>
              <Select
                value={selectedModel ?? ""}
                onValueChange={handleModelChange}
                disabled={!selectedBrand || isModelsLoading}
              >
                <SelectTrigger className="w-full md:max-w-56">
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
              <Label className="text-[#134B73]">Ano Modelo</Label>
              <Select
                value={selectedYear ?? ""}
                onValueChange={handleYearChange}
                disabled={!selectedModel || isYearsLoading}
              >
                <SelectTrigger className="w-full md:max-w-40">
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
              <Label className="text-[#134B73]">Valor FIPE</Label>
              <Input
                className="w-full md:max-w-40"
                value={vehicleInfo?.price ?? ""}
                readOnly
                placeholder="Aguardando FIPE"
              />
            </div>
             <div className="space-y-2">
              <Label className="text-[#134B73]">Placa</Label>
             <Input
                className="w-full md:max-w-36"
                value={vehiclePlate}
                placeholder="ABC-1234"
                maxLength={8}
                onChange={(e) => setVehiclePlate(maskPlate(e.target.value))}
              />
            </div>
            <div className="md:col-span-7">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#134B73] via-[#0f3d5d] to-[#0a2940] text-white shadow-2xl border-2 border-white/20 px-6 py-6">
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
                        value={financedValue}
                        placeholder="R$ 0,00"
                        maxLength={18}
                        onChange={(e) => setFinancedValue(maskBRL(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white text-base font-semibold">Prazo (meses)</Label>
                      <Select value={loanTerm} onValueChange={setLoanTerm}>
                        <SelectTrigger className="w-full h-20 md:h-20 bg-white/95 text-[#134B73] font-semibold text-3xl md:text-4xl border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 focus:ring-0 focus:outline-none">
                          <SelectValue placeholder="Escolha o prazo" />
                        </SelectTrigger>
                        <SelectContent>
                          {["12", "24", "36", "48", "60"].map((term) => (
                            <SelectItem key={term} value={term}>
                              {term} meses
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                 
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
