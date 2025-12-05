/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
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
import { maskCEP } from "@/application/core/utils/masks";
import { CreateProposalPayload } from "@/application/core/@types/Proposals/Proposal";
import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import {
  OperationCard,
  PersonalDataCard,
  ProfessionalDataCard,
  VehicleDataCard,
} from "@/presentation/features/simulacao-novo/components";
import { Button } from "@/presentation/ui/button";
import { createProposal } from "@/application/services/Proposals/proposalService";
import { useRouter } from "next/navigation";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  dispatchBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";

type BasicOption = {
  id?: number;
  code?: string;
  name?: string;
  fullName?: string;
  enterprise?: string;
};

const simulationSchema = z.object({
  fullName: z.string().min(4, "Nome completo é obrigatório"),
  cpf_cnpj: z.string().min(4, "CPF ou CNPJ é obrigatório"),
  birthDate: z.string().min(4, "Data de nascimento é obrigatória"),
  email: z.string().min(4, "E-mail é obrigatório"),
  phone: z.string().min(4, "Telefone é obrigatório"),
  motherName: z.string().min(4, "Nome da mãe é obrigatório"),
  shareholderName: z.string().min(4, "Nome do sócio é obrigatório"),
  companyName: z.string().min(4, "Nome da empresa é obrigatório"),
  maritalStatus: z.string().min(4, "Estado civil é obrigatório"),
  hasCNH: z.boolean(),
  categoryCNH: z.string().optional(),
  CEP: z.string().min(4, "CEP é obrigatório"),
  address: z.string().min(4, "Endereço é obrigatório"),
  addressNumber: z.string().min(1, "Número é obrigatório"),
  addressComplement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  UF: z.string().min(1, "UF é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  nationality: z.string().min(1, "Naturalidade é obrigatória"),
  enterprise: z.string().optional(),
  enterpriseFunction: z.string().optional(),
  admissionDate: z.string().optional(),
  income: z.string().optional(),
  otherIncomes: z.string().optional(),
  acceptLGPD: z.boolean(),
  vehicle0KM: z.boolean(),
  vehicleBrand: z.string().min(1, "Marca do veículo é obrigatória"),
  vehicleModel: z.string().min(1, "Modelo do veículo é obrigatório"),
  vehicleYear: z.string().min(1, "Ano do veículo é obrigatório"),
  priceFIPE: z.string().min(1, "Preço FIPE é obrigatório"),
  vehiclePlate: z.string().optional(),
  amountFinanced: z.string().min(4, "Valor financiado é obrigatório"),
  downPayment: z.string().min(1, "Entrada é obrigatória"),
  termMonths: z.string().min(1, "Prazo em meses é obrigatório"),
});

type SimulationFormValues = z.infer<typeof simulationSchema>;

export default function SimuladorNovo() {
  const router = useRouter();
  const methods = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      fullName: "",
      cpf_cnpj: "",
      birthDate: "",
      email: "",
      phone: "",
      motherName: "",
      shareholderName: "",
      companyName: "",
      maritalStatus: "",
      hasCNH: false,
      categoryCNH: "",
      CEP: "",
      address: "",
      addressNumber: "",
      addressComplement: "",
      neighborhood: "",
      UF: "",
      city: "",
      nationality: "",
      enterprise: "",
      enterpriseFunction: "",
      admissionDate: "",
      income: "",
      otherIncomes: "",
      acceptLGPD: false,
      vehicle0KM: false,
      vehicleBrand: "",
      vehicleModel: "",
      vehicleYear: "",
      priceFIPE: "",
      vehiclePlate: "",
      amountFinanced: "",
      downPayment: "",
      termMonths: "",
    },
  });

  const [personType, setPersonType] = useState<"PF" | "PJ" | null>(null);
  const [operationType, setOperationType] = useState<"financiamento" | "autofin" | null>(null);
  const [vehicleCategory, setVehicleCategory] = useState<"leves" | "motos" | "pesados" | null>(null);
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
  const [personalZip, setPersonalZip] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(false);
  const [isYearsLoading, setIsYearsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getVehicleTypeId = (category: typeof vehicleCategory) => {
    if (category === "motos") return 2;
    if (category === "pesados") return 3;
    return 1;
  };
  const vehicleTypeId = getVehicleTypeId(vehicleCategory);

  const realtimeUrl = useMemo(
    () => process.env.NEXT_PUBLIC_REALTIME_WS_URL,
    [],
  );
  const { sendMessage } = useRealtimeChannel({
    channel: REALTIME_CHANNELS.PROPOSALS,
    identity: "logista-simulador",
    url: realtimeUrl,
  });

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
    methods.setValue("vehicleModel", "");
    methods.setValue("vehicleYear", "");
    methods.setValue("priceFIPE", "");
    setModels([]);
    setYears([]);

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
    methods.setValue("vehicleYear", "");
    methods.setValue("priceFIPE", "");
    setYears([]);

    try {
      setIsYearsLoading(true);
      if (!methods.getValues("vehicleBrand")) return;
      const response = await getAnos(vehicleTypeId, methods.getValues("vehicleBrand") ?? "", modelId);
      setYears(response);
    } catch (error) {
      toast.error("Não foi possível carregar os anos FIPE.");
      console.error("[FIPE] getAnos", error);
    } finally {
      setIsYearsLoading(false);
    }
  };

  const handleYearChange = async (yearId: string) => {
    if (!methods.getValues("vehicleBrand") || !methods.getValues("vehicleModel")) return;
    setSelectedYear(yearId);

    try {
      const response = await getValorVeiculo(vehicleTypeId, methods.getValues("vehicleBrand") ?? "", methods.getValues("vehicleModel" )?? "", yearId);
      methods.setValue("priceFIPE", response.price);
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
      methods.setValue("address", data.logradouro);
      methods.setValue("neighborhood", data.bairro);
      methods.setValue("city", data.localidade);
      methods.setValue("UF", data.uf);
    } catch (error) {
      console.error("[cep] erro ao buscar endereço", error);
    }
  };

  const parseCurrency = (value?: string | null) => {
    if (!value) return 0;
    const normalized = value
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^0-9.]/g, "");
    const parsed = Number(normalized);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
    const digits = value.replace(/\D/g, "");
    return digits ? Number(digits) / 100 : 0;
  };

  const toNumber = (value?: string | null) => {
    if (!value) return null;
    const parsed = Number(value.toString().replace(/\D/g, ""));
    return Number.isNaN(parsed) ? null : parsed;
  };

  const onSubmit = async (data: SimulationFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CreateProposalPayload = {
        customerName: data.fullName,
        customerCpf: data.cpf_cnpj,
        customerBirthDate: data.birthDate,
        customerEmail: data.email,
        customerPhone: data.phone,
        cnhCategory: data.categoryCNH ?? "",
        hasCnh: data.hasCNH,
        vehiclePlate: data.vehiclePlate ?? "",
        fipeCode: data.priceFIPE ?? "",
        fipeValue: parseCurrency(data.priceFIPE),
        vehicleBrand: data.vehicleBrand,
        vehicleModel: data.vehicleModel,
        vehicleYear: toNumber(data.vehicleYear) ?? new Date().getFullYear(),
        downPaymentValue: parseCurrency(data.downPayment),
        financedValue: parseCurrency(data.amountFinanced),
        termMonths: toNumber(data.termMonths) ?? undefined,
        vehicle0km: data.vehicle0KM,
        maritalStatus: data.maritalStatus,
        cep: data.CEP,
        address: data.address,
        addressNumber: data.addressNumber,
        addressComplement: data.addressComplement,
        neighborhood: data.neighborhood,
        uf: data.UF,
        city: data.city,
        income: parseCurrency(data.income),
        otherIncomes: parseCurrency(data.otherIncomes),
        metadata: JSON.stringify({
          personType,
          operationType,
          vehicleCategory,
        }),
      };

      const proposal = await createProposal(payload);
      toast.success("Ficha enviada para a esteira.");
      dispatchBridgeEvent(sendMessage, REALTIME_EVENT_TYPES.PROPOSAL_CREATED, {
        proposal,
        source: "logista-simulador",
      });
      dispatchBridgeEvent(sendMessage, REALTIME_EVENT_TYPES.PROPOSAL_EVENT_APPENDED, {
        proposalId: proposal.id,
        statusFrom: null,
        statusTo: proposal.status,
        actor: "logista-simulador",
      });
      router.push("/esteira-propostas");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Falha ao enviar a ficha. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    methods.setValue("vehicleBrand", "");
    methods.setValue("vehicleModel", "");
    methods.setValue("vehicleYear", "");
    methods.setValue("priceFIPE", "");
    setBrands([]);
    setModels([]);
    setYears([]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="space-y-5 w-full">
      <div>
        <h1 className="text-4xl font-light text-[#134B73]">Nova Simulação</h1>
      </div>
      <FormProvider {...methods}>
        <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit, (errors) => console.log(errors))}>
          <div className="grid gap-5 lg:grid-cols-[0.4fr_2fr] items-start">
            <OperationCard
              personType={personType}
              operationType={operationType}
              vehicleCategory={vehicleCategory}
              onPersonTypeChange={setPersonType}
              onOperationTypeChange={setOperationType}
              onVehicleCategoryChange={setVehicleCategory}
            />
            <PersonalDataCard
              onZipChange={handleZipChange}
            />
          </div>

          <VehicleDataCard
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
            onLoanTermChange={setLoanTerm}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
