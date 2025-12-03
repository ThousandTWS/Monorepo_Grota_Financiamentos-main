/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  type Ano,
  type Marca,
  type Modelo,
  type ValorVeiculo,
  getAnos,
  getMarcas,
  getModelos,
  getValorVeiculo,
} from "@/application/services/fipe";
import { maskCEP, maskBRL, maskPhone, maskCpfCnpj } from "@/application/core/utils/masks";
import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import {
  OperationCard,
  PersonalDataCard,
  ProfessionalDataCard,
  VehicleDataCard,
} from "@/presentation/features/simulacao-novo/components";

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
  const [personalAddress, setPersonalAddress] = useState("");
  const [personalCity, setPersonalCity] = useState("");
  const [personalNeighborhood, setPersonalNeighborhood] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [personalComplement, setPersonalComplement] = useState("");
  const [personalPartnerName, setPersonalPartnerName] = useState("");
  const [personalCompanyName, setPersonalCompanyName] = useState("");
  const [personalCompany, setPersonalCompany] = useState("");
  const [personalJobTitle, setPersonalJobTitle] = useState("");
  const [personalAdmissionDate, setPersonalAdmissionDate] = useState("");
  const [personalIncome, setPersonalIncome] = useState("");
  const [personalOtherIncome, setPersonalOtherIncome] = useState("");
  const [financedValue, setFinancedValue] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);

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

  const handleZipChange = async (value: string) => {
    const masked = maskCEP(value);
    setPersonalZip(masked);
    const digits = masked.replace(/\D/g, "");
    if (digits.length !== 8) {
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!response.ok) return;
      const data = await response.json();
      if (data?.erro) return;
      setPersonalAddress(data.logradouro ?? "");
      setPersonalNeighborhood(data.bairro ?? "");
      setPersonalCity(data.localidade ?? "");
      setPersonalBirthUf(data.uf ?? personalBirthUf);
    } catch (error) {
      console.error("[cep] erro ao buscar endereço", error);
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
    <section className="space-y-5 w-full">
      <div>
        <h1 className="text-4xl font-light text-[#134B73]">Nova Simulação</h1>
      </div>
      <div className="grid gap-2 lg:grid-cols-[0.4fr_2fr] items-start">
        <OperationCard
          personType={personType}
          operationType={operationType}
          vehicleCategory={vehicleCategory}
          onPersonTypeChange={setPersonType}
          onOperationTypeChange={setOperationType}
          onVehicleCategoryChange={setVehicleCategory}
        />
        <PersonalDataCard
          personalCpf={personalCpf}
          onCpfChange={(value) => setPersonalCpf(maskCpfCnpj(value))}
          personalEmail={personalEmail}
          onEmailChange={setPersonalEmail}
          personalPhone={personalPhone}
          onPhoneChange={(value) => setPersonalPhone(maskPhone(value))}
          personalMother={personalMother}
          onMotherChange={setPersonalMother}
          personalCivilStatus={personalCivilStatus}
          onCivilStatusChange={setPersonalCivilStatus}
          personalHasCnh={personalHasCnh}
          onHasCnhChange={setPersonalHasCnh}
          personalCategoryCnh={personalCategoryCnh}
          onCategoryCnhChange={setPersonalCategoryCnh}
          personalZip={personalZip}
          onZipChange={handleZipChange}
          personalAddress={personalAddress}
          onAddressChange={setPersonalAddress}
          personalNumber={personalNumber}
          onNumberChange={setPersonalNumber}
          personalComplement={personalComplement}
          onComplementChange={setPersonalComplement}
          personalPartnerName={personalPartnerName}
          onPartnerNameChange={setPersonalPartnerName}
          personalCompanyName={personalCompanyName}
          onCompanyNameChange={setPersonalCompanyName}
          personalNeighborhood={personalNeighborhood}
          onNeighborhoodChange={setPersonalNeighborhood}
          personalBirthUf={personalBirthUf}
          onBirthUfChange={setPersonalBirthUf}
          personalCity={personalCity}
          onCityChange={setPersonalCity}
          personalBirthCity={personalBirthCity}
          onBirthCityChange={setPersonalBirthCity}
          privacyConsent={privacyConsent}
          onPrivacyConsentChange={setPrivacyConsent}
          ufCapitals={UF_CAPITALS}
        />
      </div>

      <ProfessionalDataCard
          personalCompany={personalCompany}
          onCompanyChange={setPersonalCompany}
          personalJobTitle={personalJobTitle}
          onJobTitleChange={setPersonalJobTitle}
          personalAdmissionDate={personalAdmissionDate}
        onAdmissionDateChange={setPersonalAdmissionDate}
        personalIncome={personalIncome}
        onIncomeChange={(value) => setPersonalIncome(maskBRL(value))}
        personalOtherIncome={personalOtherIncome}
        onOtherIncomeChange={(value) => setPersonalOtherIncome(maskBRL(value))}
      />

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

      <VehicleDataCard
        isZeroKm={isZeroKm}
        onZeroKmChange={setIsZeroKm}
        brands={brands}
        models={models}
        years={years}
        selectedBrand={selectedBrand}
        selectedModel={selectedModel}
        selectedYear={selectedYear}
        onBrandChange={handleBrandChange}
        onModelChange={handleModelChange}
        onYearChange={handleYearChange}
        isBrandsLoading={isBrandsLoading}
        isModelsLoading={isModelsLoading}
        isYearsLoading={isYearsLoading}
        vehicleInfoPrice={vehicleInfo?.price ?? ""}
        vehiclePlate={vehiclePlate}
        onPlateChange={(value) => setVehiclePlate(maskPlate(value))}
        financedValue={financedValue}
        onFinancedValueChange={(value) => setFinancedValue(maskBRL(value))}
        loanTerm={loanTerm}
        onLoanTermChange={setLoanTerm}
      />
    </section>
  );
}
