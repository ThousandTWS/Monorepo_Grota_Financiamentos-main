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
  getAnos,
  getMarcas,
  getModelos,
  getValorVeiculo,
} from "@/application/services/fipe";
import { maskCEP, maskCNPJ } from "@/application/core/utils/masks";
import { CreateProposalPayload } from "@/application/core/@types/Proposals/Proposal";
import {
  OperationCard,
  PersonalDataCard,
  VehicleDataCard,
} from "@/presentation/features/simulacao-novo/components";
import { Button } from "@/presentation/ui/button";
import { createProposal } from "@/application/services/Proposals/proposalService";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/dialog";
import { Separator } from "@/presentation/ui/separator";
import { unmaskCPF } from "@/lib/masks";
import { formatName } from "@/lib/formatters";
import { convertBRtoISO } from "@/application/core/utils/formatters";

type BasicOption = {
  id?: number;
  code?: string;
  name?: string;
  fullName?: string;
  enterprise?: string;
};

const simulationSchema = z.object({
  cpf_cnpj: z.string().min(4, "CPF ou CNPJ é obrigatório"),
  name:z.string().min(4, "Nome é obrigatório"),
  email: z.string().min(4, "E-mail é obrigatório"),
  phone: z.string().min(4, "Telefone é obrigatório"),
  motherName: z.string().min(4, "Nome da mãe é obrigatório"),
  birthday: z.string().min(4, "Data de nascimento é obrigatória"),
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
  termMonths: z.string().min(1, "Prazo em meses é obrigatório"),
});

type SimulationFormValues = z.infer<typeof simulationSchema>;

export default function SimuladorNovo() {
  const router = useRouter();
  const methods = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      cpf_cnpj: "",
      name: "",
      email: "",
      phone: "",
      motherName: "",
      birthday: "",
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
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(false);
  const [isYearsLoading, setIsYearsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState<SimulationFormValues | null>(null);
  const [pendingPayload, setPendingPayload] = useState<CreateProposalPayload | null>(null);
  const [cpfSituation, setCpfSituation] = useState("");
  const [searchingLoading, setSearchingLoading] = useState(false);
  const [searchCEPLoading, setSearchCEPLoading] = useState(false);

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
    const [modelCode, modelName] = methods.getValues("vehicleModel").split("+");

    try {
      const response = await getValorVeiculo(vehicleTypeId, methods.getValues("vehicleBrand") ?? "", modelCode, yearId);
      methods.setValue("priceFIPE", response.price);
    } catch (error) {
      toast.error("Não foi possível carregar os dados do veículo FIPE.");
      console.error("[FIPE] getValorVeiculo", error);
    }
  };

  const handleZipChange = async (value: string) => {
    setSearchCEPLoading(true);

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
    } finally {
      setSearchCEPLoading(false);
    }
  };

  const handleCPFChange = async (value: string) => {
    setSearchingLoading(true);

    try {
      const masked = unmaskCPF(value);
      const digits = masked.replace(/\D/g, "");
      if (digits.length !== 11) {
        return;
      }
      
      const res = await fetch("/api/searchCPF", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf: digits }),
      });
      const response = await res.json();
      if (!response.success) return;
      const data = response?.data?.response?.content;
      methods.setValue("name", formatName(data?.nome?.conteudo?.nome));
      setCpfSituation(data?.nome?.conteudo?.situacao_receita);
      methods.setValue("motherName", formatName(data?.nome?.conteudo?.mae));
      methods.setValue("birthday", convertBRtoISO(data?.nome?.conteudo?.data_nascimento));
      methods.setValue("email", data?.emails?.conteudo[0]?.email || "");
      methods.setValue("phone", data?.pesquisa_telefones?.conteudo[0]?.numero || "");
    } catch (error) {
      console.error("[cpf] erro ao buscar dados", error);
    } finally {
      setSearchingLoading(false);
    }
  };

  const handleCNPJChange = async (value: string) => {
    setSearchingLoading(true);

    try {
      const masked = maskCNPJ(value);
      const digits = masked.replace(/\D/g, "");
      if (digits.length !== 14) {
        return;
      }

      const res = await fetch("/api/searchCNPJ", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cnpj: digits }),
      });
      const response = await res.json();
      if (!response.success) return;
      const data = response.data.data.cnpj;
      methods.setValue("enterprise", formatName(data.empresa.razao_social));
      methods.setValue("shareholderName", formatName(data.socios[0]?.nome_socio));
    } catch (error) {
      console.error("[cnpj] erro ao buscar dados", error);
    } finally {
      setSearchingLoading(false);
    }
  };

  const handleDocumentChange = (value: string) => {
    if(!personType) return;

    if(personType === "PF") {
      handleCPFChange(value);
    } else if (personType === "PJ") {
      handleCNPJChange(value);
    }
  }

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
    const payload: CreateProposalPayload = {
      customerName: data.name || "Cliente",
      customerCpf: data.cpf_cnpj,
      customerBirthDate: data.birthday || "",
      customerEmail: data.email,
      customerPhone: data.phone,
      cnhCategory: data.categoryCNH ?? "",
      hasCnh: data.hasCNH,
      vehiclePlate: data.vehiclePlate ?? "",
      fipeCode: data.priceFIPE ?? "",
      fipeValue: parseCurrency(data.priceFIPE),
      vehicleBrand: data.vehicleBrand,
      vehicleModel: data.vehicleModel.split("+")[1]?.trim(),
      vehicleYear: toNumber(data.vehicleYear) ?? new Date().getFullYear(),
      downPaymentValue: 0,
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

    setPendingPayload(payload);
    setReviewData(data);
    setIsReviewOpen(true);
  };

  const handleConfirmSend = async () => {
    if (!pendingPayload) {
      toast.error("Não foi possível preparar os dados para envio.");
      return;
    }
    setIsSending(true);
    try {
      await createProposal(pendingPayload);
      toast.success("Ficha enviada para a esteira.");
      setIsReviewOpen(false);
      methods.reset();
      router.push("/esteira-propostas");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Falha ao enviar a ficha. Tente novamente.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const formattedReview = useMemo(() => {
    if (!reviewData) return null;
    const currency = (value?: string) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(parseCurrency(value));

    return {
      cliente: reviewData.name || "Cliente",
      documento: reviewData.cpf_cnpj,
      email: reviewData.email,
      telefone: reviewData.phone,
      veiculo: `${reviewData.vehicleBrand || "--"} / ${reviewData.vehicleModel.split("+")[1]?.trim() || "--"} / ${reviewData.vehicleYear || "--"}`,
      placa: reviewData.vehiclePlate || "—",
      fipe: currency(reviewData.priceFIPE),
      financiado: currency(reviewData.amountFinanced),
      prazo: reviewData.termMonths ? `${reviewData.termMonths} meses` : "—",
      operacao: operationType || "—",
      categoria: vehicleCategory || "—",
      pessoa: personType || "—",
      endereco: `${reviewData.address || ""}, ${reviewData.addressNumber || ""} - ${reviewData.neighborhood || ""} / ${reviewData.city || ""} - ${reviewData.UF || ""}`,
    };
  }, [reviewData, personType, operationType, vehicleCategory]);

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
  }, []);

  return (
    <section className="space-y-5 w-full">
      <div>
        <h1 className="text-4xl font-light text-[#134B73]">Nova Simulação</h1>
      </div>
      <FormProvider {...methods}>
        <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="grid gap-5 lg:grid-cols-[0.4fr_2fr] items-start">
            <OperationCard
              personType={personType}
              operationType={operationType}
              vehicleCategory={vehicleCategory}
              onPersonTypeChange={setPersonType}
              onOperationTypeChange={setOperationType}
              onVehicleCategoryChange={setVehicleCategory}
              isLoading={isSending}
              waitingPayload={pendingPayload}
            />
            <PersonalDataCard
              onZipChange={handleZipChange}
              handleDocumentChange={handleDocumentChange}
              cpfSituation={cpfSituation}
              searchingLoading={searchingLoading}
              searchingCPFLoading={searchCEPLoading}
              personType={personType}
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
          />
        </form>
      </FormProvider>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirmar dados antes de enviar</DialogTitle>
            <DialogDescription>
              Revise as principais informações. Se estiverem corretas, envie para a esteira do administrador.
            </DialogDescription>
          </DialogHeader>

          {formattedReview && (
            <div className="space-y-3">
              <div className="grid gap-2 rounded-md border p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cliente</span>
                  <span className="font-semibold">{formattedReview.cliente}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Documento</span>
                  <span className="font-semibold">{formattedReview.documento}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contato</span>
                  <span className="font-semibold">{formattedReview.email} · {formattedReview.telefone}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Veículo</span>
                  <span className="font-semibold">{formattedReview.veiculo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Placa</span>
                  <span className="font-semibold">{formattedReview.placa}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor FIPE</span>
                  <span className="font-semibold">{formattedReview.fipe}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor financiado</span>
                  <span className="font-semibold">{formattedReview.financiado}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prazo</span>
                  <span className="font-semibold">{formattedReview.prazo}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Operação</span>
                  <span className="font-semibold">{formattedReview.operacao}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Categoria</span>
                  <span className="font-semibold">{formattedReview.categoria}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pessoa</span>
                  <span className="font-semibold">{formattedReview.pessoa}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Endereço</span>
                  <span className="font-semibold text-right">{formattedReview.endereco}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)} disabled={isSending}>
              Voltar e editar
            </Button>
            <Button onClick={handleConfirmSend} disabled={isSending}>
              {isSending ? "Enviando..." : "Enviar para esteira"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
