"use client";

import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Controller, UseFormReset, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  dispatchBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { Loader2, CheckCircle2, UserCircle2, Info, Search, Plus, Coins, Trash2, Send } from "lucide-react";
import { GiReceiveMoney } from "react-icons/gi";
import { toast } from "sonner";

import { CreateProposalPayload } from "@/application/core/@types/Proposals/Proposal";
import { formatDateISO, formatName, formatNumberToBRL, parseBRL } from "@/application/core/utils/formatters";
import { maskBRL, maskCEP, maskCPF, maskDate, maskPhone, unmaskCPF } from "@/application/core/utils/masks";
import viaCepService from "@/application/services/External/viaCepService";
import { createProposal } from "@/application/services/Proposals/proposalService";
import { Badge } from "@/presentation/ui/badge";
import { Button } from "@/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/presentation/ui/dialog";
import { Input } from "@/presentation/ui/input";
import { Label } from "@/presentation/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/ui/select";
import { Separator } from "@/presentation/ui/separator";
import { Switch } from "@/presentation/ui/switch";
import { Checkbox } from "@/presentation/ui/checkbox";
import clsx from "clsx";

const simulateProposalSchema = z.object({
  cpf: z.string().length(14, "CPF invalido"),
  fullname: z.string().min(4, "Nome completo e obrigatorio"),
  birthday: z.string().length(10, "Data de nascimento e obrigatoria"),
  motherName: z.string().min(2, "Nome da mae e obrigatorio"),
  email: z.email("Formato de email invalido"),
  phone: z.string().length(15, "Formato de telefone invalido"),
  zipCode: z.string().length(9, "CEP invalido"),
  addressStreet: z.string().optional(),
  addressNeighborhood: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  enterprise: z.string().min(1, "Nome da empresa e obrigatoria"),
  function: z.string().min(1, "Funcao exercida e obrigatoria"),
  income: z.object({
    mainValue: z.string().min(1, "Renda principal e obrigatoria"),
    extra: z
      .array(
        z.object({
          value: z.string().min(1, "Valor da renda extra e obrigatorio"),
          role: z.string().min(1, "Funcao da renda extra e obrigatoria"),
        }),
      )
      .optional(),
  }),
  admission: z.string().min(1, "Renda e obrigatoria").optional(),
  haveCNH: z.boolean(),
  categoryCNH: z.string().optional(),
  vehiclePlate: z.string().optional(),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  codeFIPE: z.string().optional(),
  priceFIPE: z.string().optional(),
  entryPrice: z.string().optional(),
  financedPrice: z.string().optional(),
  details: z.string().optional(),
});

export type SimulateProposalFormData = z.infer<typeof simulateProposalSchema>;

export interface ExtraProps {
  value: string;
  role: string;
}

interface CpfSummaryItem {
  label: string;
  value: string;
}

export type VehicleSummaryProps = {
  personType?: "PF" | "PJ" | "";
  operationType?: string;
  vehicleCategory?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleFuel?: string;
  fipeCode?: string;
  fipePrice?: string;
  entryPrice?: string;
  vehiclePlate?: string;
};

const ADDRESS_LABELS = [
  "CEP",
  "Rua",
  "Numero",
  "Bairro",
  "Cidade",
  "Complemento",
  "Estado",
];
const CNH_LABELS = ["Possui CNH", "Categoria CNH"];
const CONTACT_LABELS = ["Telefone", "E-mail"];
const INCOME_LABELS = ["Empresa", "Funcao", "Data de admissao", "Renda", "Renda extra"];
const VEHICLE_LABELS = [
  "Operacao",
  "Categoria do veiculo",
  "Marca",
  "Modelo",
  "Ano do veiculo",
  "Combustivel",
  "Codigo FIPE",
  "Valor FIPE",
  "Entrada",
];
const PRESERVED_LABELS_ON_CPF_RESET = new Set([
  ...ADDRESS_LABELS,
  ...CNH_LABELS,
  ...CONTACT_LABELS,
  ...INCOME_LABELS,
  ...VEHICLE_LABELS,
  "Nome da mae",
]);

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_WS_URL;
const LOGISTA_SIMULATOR_ID = "logista-simulador";
export function SimulacaoPFForm({ summaryVehicle }: { summaryVehicle?: VehicleSummaryProps }) {
  const [isCPFLookupLoading, setIsCPFLookupLoading] = useState(false);
  const [isCepLookupLoading, setIsCepLookupLoading] = useState(false);
  const [extra, setExtra] = useState<ExtraProps[]>([]);
  const [, setIsCalculating] = useState(false);
  const [resumeProposal, setResumeProposal] = useState<SimulateProposalFormData | null>(null);
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] = useState(false);
  const [cpfSummary, setCpfSummary] = useState<CpfSummaryItem[]>([]);
  const [cpfFederalStatus, setCpfFederalStatus] = useState("");
  const [cpfFederalUpdatedAt, setCpfFederalUpdatedAt] = useState("");
  const [cpfFederalSource, setCpfFederalSource] = useState("");
  const [extraModalOpen, setExtraModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
    watch,
    getValues,
  } = useForm<SimulateProposalFormData>({
    resolver: zodResolver(simulateProposalSchema),
    mode: "onSubmit",
    defaultValues: {
      cpf: "",
      fullname: "",
      birthday: "",
      motherName: "",
      email: "",
      phone: "",
      zipCode: "",
      addressStreet: "",
      addressNeighborhood: "",
      addressCity: "",
      addressState: "",
      addressNumber: "",
      addressComplement: "",
      haveCNH: false,
      categoryCNH: "",
      enterprise: "",
      function: "",
      admission: "",
      income: {
        mainValue: "",
      },
      vehiclePlate: "",
      vehicleBrand: "",
      vehicleModel: "",
      vehicleYear: "",
      codeFIPE: "",
      priceFIPE: "",
      entryPrice: "",
      financedPrice: "",
      details: "",
    },
  });

  const cpfValue = watch("cpf");
  const zipCodeValue = watch("zipCode");
  const addressStreetValue = watch("addressStreet");
  const addressNeighborhoodValue = watch("addressNeighborhood");
  const addressCityValue = watch("addressCity");
  const addressStateValue = watch("addressState");
  const addressNumberValue = watch("addressNumber");
  const addressComplementValue = watch("addressComplement");
  const motherNameValue = watch("motherName");
  const fullnameValue = watch("fullname");
  const birthdayValue = watch("birthday");
  const emailValue = watch("email");
  const phoneValue = watch("phone");
  const haveCNHValue = watch("haveCNH");
  const categoryCNHValue = watch("categoryCNH");
  const enterpriseValue = watch("enterprise");
  const functionValue = watch("function");
  const admissionValue = watch("admission");
  const incomeMainValue = watch("income.mainValue");
  const incomeExtraValue = watch("income.extra");
  const entryPriceValue = watch("entryPrice");
  const priceFIPEValue = watch("priceFIPE");
  const noHaveCPF = cpfValue.length !== 14;
  const hasVehicleDetails =
    Boolean(
      summaryVehicle?.vehicleBrand &&
        summaryVehicle?.vehicleModel &&
        summaryVehicle?.vehicleYear &&
        (summaryVehicle?.fipePrice || priceFIPEValue),
    );

  const updateSummaryEntries = useCallback((items: CpfSummaryItem[], labelsToClear?: string[]) => {
    setCpfSummary((prev) => {
      const labels = new Set(labelsToClear ?? items.map((item) => item.label));
      if (labels.size === 0 && items.length === 0) {
        return prev;
      }

      const filtered = labels.size ? prev.filter((item) => !labels.has(item.label)) : prev;
      const additions = items.filter((item) => Boolean(item.value));
      return [...filtered, ...additions];
    });
  }, []);

  const handleCPFLookup = async (cpfMasked: string) => {
    if (!cpfMasked) return;

    try {
      setIsCPFLookupLoading(true);

      const cpf = unmaskCPF(cpfMasked);
      const response = await fetch("/api/searchCPF", {
        method: "POST",
        body: JSON.stringify({ cpf }),
      });

      const data = await response.json();
      const pessoa = data?.data.response.content;

      if (pessoa) {
        const emailFromPreferredContact = pessoa.contato_preferencial?.conteudo?.find(
          (contact: { tipo?: string }) => contact?.tipo === "EMAIL",
        )?.valor;
        const emailFromList = pessoa.emails?.conteudo?.[0];
        const preferredPhone = pessoa.pesquisa_telefones?.conteudo?.[0]?.numero ?? "";

        setValue("fullname", formatName(pessoa.nome.conteudo?.nome) ?? "");
        setValue("birthday", pessoa.nome.conteudo?.data_nascimento ?? "");
        setValue("motherName", formatName(pessoa.nome.conteudo?.mae) ?? "");
        setValue("phone", preferredPhone);
        setValue("email", emailFromPreferredContact ?? emailFromList ?? "");

        const receitaFederalStatus =
          pessoa?.situacao_cadastral?.conteudo?.situacao ??
          pessoa?.situacao_cadastral?.conteudo?.status ??
          pessoa?.situacao_cadastral?.conteudo?.descricao ??
          pessoa?.situacao_cadastral?.conteudo?.situacao_cadastral ??
          pessoa?.situacao_cadastral?.descricao ??
          "";
        const receitaFederalUpdatedAt =
          pessoa?.situacao_cadastral?.conteudo?.data_atualizacao ??
          pessoa?.situacao_cadastral?.conteudo?.atualizado_em ??
          pessoa?.situacao_cadastral?.conteudo?.data_consulta ??
          pessoa?.situacao_cadastral?.conteudo?.data ??
          pessoa?.nome?.conteudo?.data_atualizacao ??
          pessoa?.nome?.conteudo?.atualizado_em ??
          "";
        const receitaFederalSource =
          pessoa?.situacao_cadastral?.conteudo?.fonte ??
          pessoa?.situacao_cadastral?.titulo ??
          "Receita Federal";

        const summaryItems: CpfSummaryItem[] = [
          { label: "Dados atualizados em", value: receitaFederalUpdatedAt },
          { label: "Status Receita Federal", value: receitaFederalStatus },
          { label: "Fonte de verificacao", value: receitaFederalSource },
          { label: "CPF consultado", value: cpfMasked },
          { label: "Nome completo", value: formatName(pessoa.nome.conteudo?.nome) ?? "" },
          { label: "Data de nascimento", value: pessoa.nome.conteudo?.data_nascimento ?? "" },
          { label: "Nome da mae", value: pessoa.nome.conteudo?.mae ?? "" },
          { label: "Telefone", value: preferredPhone },
          { label: "E-mail", value: emailFromPreferredContact ?? emailFromList ?? "" },
        ].filter((item) => Boolean(item.value));

        setCpfSummary(summaryItems);
        setCpfFederalStatus(receitaFederalStatus);
        setCpfFederalUpdatedAt(receitaFederalUpdatedAt);
        setCpfFederalSource(receitaFederalSource);

        toast.success("Dados do cliente encontrados");
      } else {
        setValue("motherName", "");
        setCpfSummary([]);
        setCpfFederalStatus("");
        setCpfFederalUpdatedAt("");
        setCpfFederalSource("");
      }
    } catch (error) {
      setValue("motherName", "");
      setCpfSummary([]);
      setCpfFederalStatus("");
      setCpfFederalUpdatedAt("");
      setCpfFederalSource("");
      toast.error("Erro ao buscar CPF");
    } finally {
      setIsCPFLookupLoading(false);
    }
  };

  const handleCepLookup = async (cepMasked: string) => {
    const sanitizedCep = (cepMasked ?? "").replace(/\D/g, "");

    if (sanitizedCep.length !== 8) {
      toast.error("Informe um CEP valido");
      return;
    }

    try {
      setIsCepLookupLoading(true);
      const address = await viaCepService.lookup(sanitizedCep);
      const summaryAddressItems: CpfSummaryItem[] = [
        { label: "CEP", value: maskCEP(sanitizedCep) },
        { label: "Rua", value: address.street ?? "" },
        { label: "Bairro", value: address.neighborhood ?? "" },
        { label: "Cidade", value: address.city ?? "" },
        { label: "Complemento", value: address.complement ?? "" },
        { label: "Estado", value: address.state ?? "" },
      ].filter((item) => Boolean(item.value));
      const maskedCEP = maskCEP(sanitizedCep);
      setValue("zipCode", maskedCEP, { shouldValidate: true });
      setValue("addressStreet", address.street ?? "", { shouldValidate: true });
      setValue("addressNeighborhood", address.neighborhood ?? "", { shouldValidate: true });
      setValue("addressCity", address.city ?? "", { shouldValidate: true });
      setValue("addressState", address.state ?? "", { shouldValidate: true });
      if (address.complement) {
        setValue("addressComplement", address.complement, { shouldValidate: true });
      }
      updateSummaryEntries(summaryAddressItems, ADDRESS_LABELS);
      toast.success("Endereco atualizado pelo CEP");
    } catch (error) {
      toast.error("Nao conseguimos consultar o CEP informado.");
    } finally {
      setIsCepLookupLoading(false);
    }
  };

  const handleAddNewExtra = () => {
    const newExtra: ExtraProps = {
      role: "",
      value: "",
    };

    setExtra((prev) => [...prev, newExtra]);
  };

  const handleDeleteExtra = () => {
    setExtra([]);
    setValue("income.extra", []);
    setExtraModalOpen(false);
  };

  const onSubmit = async (data: SimulateProposalFormData) => {
    setResumeProposal(data);
    setConfirmationDialogIsOpen(true);
  };

  useEffect(() => {
    if (cpfValue.length !== 14) {
      setCpfSummary((prev) => prev.filter((item) => PRESERVED_LABELS_ON_CPF_RESET.has(item.label)));
      setCpfFederalStatus("");
      setCpfFederalUpdatedAt("");
      setCpfFederalSource("");
      setValue("motherName", "");
    }
  }, [cpfValue, setValue]);

  useEffect(() => {
    const manualAddressItems: CpfSummaryItem[] = [];
    if (zipCodeValue) manualAddressItems.push({ label: "CEP", value: zipCodeValue });
    if (addressStreetValue) manualAddressItems.push({ label: "Rua", value: addressStreetValue });
    if (addressNeighborhoodValue) manualAddressItems.push({ label: "Bairro", value: addressNeighborhoodValue });
    if (addressCityValue) manualAddressItems.push({ label: "Cidade", value: addressCityValue });
    if (addressStateValue) manualAddressItems.push({ label: "Estado", value: addressStateValue });
    if (addressNumberValue) manualAddressItems.push({ label: "Numero", value: addressNumberValue });
    if (addressComplementValue) manualAddressItems.push({ label: "Complemento", value: addressComplementValue });

    updateSummaryEntries(manualAddressItems, ADDRESS_LABELS);
  }, [
    zipCodeValue,
    addressStreetValue,
    addressNeighborhoodValue,
    addressCityValue,
    addressStateValue,
    addressNumberValue,
    addressComplementValue,
    updateSummaryEntries,
  ]);

  useEffect(() => {
    const motherItems: CpfSummaryItem[] = motherNameValue ? [{ label: "Nome da mae", value: motherNameValue }] : [];
    updateSummaryEntries(motherItems, ["Nome da mae"]);
  }, [motherNameValue, updateSummaryEntries]);

  useEffect(() => {
    const cnhItems: CpfSummaryItem[] = haveCNHValue
      ? [
          { label: "Possui CNH", value: "Sim" },
          ...(categoryCNHValue ? [{ label: "Categoria CNH", value: categoryCNHValue }] : []),
        ]
      : [];
    updateSummaryEntries(cnhItems, CNH_LABELS);
  }, [haveCNHValue, categoryCNHValue, updateSummaryEntries]);

  useEffect(() => {
    const contactItems: CpfSummaryItem[] = [
      { label: "Telefone", value: phoneValue },
      { label: "E-mail", value: emailValue },
    ].filter((item) => Boolean(item.value));
    updateSummaryEntries(contactItems, CONTACT_LABELS);
  }, [phoneValue, emailValue, updateSummaryEntries]);

  useEffect(() => {
    const vehicleItems: CpfSummaryItem[] = [];
    if (summaryVehicle?.operationType) vehicleItems.push({ label: "Operacao", value: summaryVehicle.operationType });
    if (summaryVehicle?.vehicleCategory)
      vehicleItems.push({ label: "Categoria do veiculo", value: summaryVehicle.vehicleCategory });
    if (summaryVehicle?.vehicleBrand) vehicleItems.push({ label: "Marca", value: summaryVehicle.vehicleBrand });
    if (summaryVehicle?.vehicleModel) vehicleItems.push({ label: "Modelo", value: summaryVehicle.vehicleModel });
    if (summaryVehicle?.vehicleYear) vehicleItems.push({ label: "Ano do veiculo", value: summaryVehicle.vehicleYear });
    if (summaryVehicle?.vehicleFuel) vehicleItems.push({ label: "Combustivel", value: summaryVehicle.vehicleFuel });
    if (summaryVehicle?.fipeCode) vehicleItems.push({ label: "Codigo FIPE", value: summaryVehicle.fipeCode });
    const fipeDisplay = summaryVehicle?.fipePrice || priceFIPEValue;
    const entryDisplay = summaryVehicle?.entryPrice || entryPriceValue;
    if (fipeDisplay) vehicleItems.push({ label: "Valor FIPE", value: fipeDisplay });
    if (entryDisplay) vehicleItems.push({ label: "Entrada", value: entryDisplay });

    updateSummaryEntries(vehicleItems, VEHICLE_LABELS);
  }, [summaryVehicle, entryPriceValue, priceFIPEValue, updateSummaryEntries]);

  useEffect(() => {
    if (!summaryVehicle) return;

    if (summaryVehicle.vehicleBrand) setValue("vehicleBrand", summaryVehicle.vehicleBrand);
    if (summaryVehicle.vehicleModel) setValue("vehicleModel", summaryVehicle.vehicleModel);
    if (summaryVehicle.vehicleYear) setValue("vehicleYear", summaryVehicle.vehicleYear);
    if (summaryVehicle.fipeCode) setValue("codeFIPE", summaryVehicle.fipeCode);
    if (summaryVehicle.fipePrice) setValue("priceFIPE", summaryVehicle.fipePrice);
    if (summaryVehicle.vehiclePlate) setValue("vehiclePlate", summaryVehicle.vehiclePlate);
  }, [summaryVehicle, setValue]);

  useEffect(() => {
    const incomeItems: CpfSummaryItem[] = [];
    if (enterpriseValue) incomeItems.push({ label: "Empresa", value: enterpriseValue });
    if (functionValue) incomeItems.push({ label: "Funcao", value: functionValue });
    if (admissionValue) incomeItems.push({ label: "Data de admissao", value: admissionValue });
    if (incomeMainValue) incomeItems.push({ label: "Renda", value: incomeMainValue });

    const extrasSummary =
      (incomeExtraValue ?? [])
        ?.map((extra) => {
          if (!extra) return "";
          const parts = [extra.role, extra.value].filter(Boolean);
          return parts.join(": ");
        })
        .filter(Boolean) ?? [];
    if (extrasSummary.length > 0) {
      incomeItems.push({ label: "Renda extra", value: extrasSummary.join(" | ") });
    }

    updateSummaryEntries(incomeItems, INCOME_LABELS);
  }, [
    enterpriseValue,
    functionValue,
    admissionValue,
    incomeMainValue,
    incomeExtraValue,
    updateSummaryEntries,
  ]);

  useEffect(() => {
    if (!watch("haveCNH")) {
      setValue("categoryCNH", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("haveCNH")]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (getValues("priceFIPE").length > 0 && getValues("entryPrice").length > 0) {
        try {
          setIsCalculating(true);
          const financed = parseBRL(getValues("priceFIPE")) - parseBRL(getValues("entryPrice"));
          setValue("financedPrice", maskBRL(formatNumberToBRL(financed)));
        } catch (error) {
          toast.error(
            "Nao conseguimos realizar o calculo automaticamente. Tente novamente em instantes ou preencha manualmente.",
          );
        } finally {
          setIsCalculating(false);
        }
      }
    }, 750);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("priceFIPE"), watch("entryPrice")]);
  const isClientSectionComplete =
    cpfValue.length === 14 &&
    fullnameValue &&
    birthdayValue &&
    motherNameValue &&
    emailValue &&
    phoneValue &&
    zipCodeValue &&
    enterpriseValue &&
    functionValue &&
    incomeMainValue;

  const hasVehicleSummary =
    Boolean(
      summaryVehicle?.operationType &&
        summaryVehicle?.vehicleCategory &&
        summaryVehicle?.vehicleBrand &&
        summaryVehicle?.vehicleModel &&
        summaryVehicle?.vehicleYear &&
        (summaryVehicle?.fipePrice || priceFIPEValue),
    );

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="grid gap-6">
          <Card className="h-full">
            <CardHeader>
              <div className="flex gap-3 items-center">
                <UserCircle2 className="h-10 w-10" />
                <aside className="flex flex-col gap-1.5">
                  <CardTitle>Informacoes do cliente</CardTitle>
                  <CardDescription>Preencha ou consulte os dados principais do cliente.</CardDescription>
                </aside>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 items-start md:grid-cols-3">
                  <div className="space-y-3">
                    <Label htmlFor="haveCNH">Possui CNH?</Label>
                    <Controller
                      name="haveCNH"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Fragment>
                          <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                            <Switch
                              id="haveCNH"
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked)}
                            />
                            <span className="text-sm text-muted-foreground">{field.value ? "Sim" : "Nao"}</span>
                          </div>
                          {errors.haveCNH && (
                            <p className="text-red-500 text-xs mt-1">{errors.haveCNH.message}</p>
                          )}
                        </Fragment>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="categoryCNH">Categoria da CNH</Label>

                    <Controller
                      name="categoryCNH"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Fragment>
                          <Select value={field.value} onValueChange={field.onChange} disabled={!watch("haveCNH")}>
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
                          {errors.categoryCNH && (
                            <p className="text-red-500 text-xs mt-1">{errors.categoryCNH.message}</p>
                          )}
                        </Fragment>
                      )}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cpf">CPF (consulta automatica)</Label>
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                      <Input
                        id="cpf"
                        inputMode="numeric"
                        maxLength={14}
                        placeholder="Digite o CPF para buscar os dados"
                        {...register("cpf")}
                        onChange={(e) => {
                          const masked = maskCPF(e.target.value);
                          setValue("cpf", masked, { shouldValidate: true });
                        }}
                      />
                      {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>}

                      <div className="flex items-end">
                        <Button
                          type="button"
                          className="w-full gap-2"
                          onClick={() => handleCPFLookup(getValues("cpf"))}
                          disabled={isCPFLookupLoading || noHaveCPF}
                        >
                          {isCPFLookupLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                          Buscar dados com CPF
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Preencha o CPF corretamente para preenchimento automatico dos demais dados solicitados.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="motherName">Nome da mae</Label>
                    <Input
                      id="motherName"
                      placeholder="Nome completo da mae"
                      {...register("motherName")}
                      className={clsx(isCPFLookupLoading && "input-loading")}
                      disabled={isCPFLookupLoading}
                    />
                    {errors.motherName && (
                      <p className="text-red-500 text-xs mt-1">{errors.motherName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-3">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@email.com"
                      {...register("email")}
                      className={clsx(isCPFLookupLoading && "input-loading")}
                      disabled={isCPFLookupLoading}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-3 md:col-span-3">
                    <Label htmlFor="phone">Telefone / Whatsapp</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-0000"
                      {...register("phone")}
                      onChange={(e) => {
                        const masked = maskPhone(e.target.value);
                        setValue("phone", masked, { shouldValidate: true });
                      }}
                      className={clsx(isCPFLookupLoading && "input-loading")}
                      disabled={isCPFLookupLoading}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="zipCode">CEP</Label>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <Input
                      id="zipCode"
                      placeholder="00000-000"
                      {...register("zipCode")}
                      onChange={(e) => {
                        const masked = maskCEP(e.target.value);
                        setValue("zipCode", masked, { shouldValidate: true });
                      }}
                      className={clsx("md:max-w-xs", isCepLookupLoading && "input-loading")}
                    />
                    <Button
                      type="button"
                      className="md:w-auto gap-2"
                      onClick={() => handleCepLookup(getValues("zipCode"))}
                      disabled={isCepLookupLoading || zipCodeValue.replace(/\D/g, "").length !== 8}
                    >
                      {isCepLookupLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                      Buscar CEP
                    </Button>
                  </div>
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor="addressStreet">Rua</Label>
                    <Input id="addressStreet" placeholder="Av. Brasil" {...register("addressStreet")} />
                    {errors.addressStreet && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressStreet.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressNeighborhood">Bairro</Label>
                    <Input id="addressNeighborhood" placeholder="Centro" {...register("addressNeighborhood")} />
                    {errors.addressNeighborhood && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressNeighborhood.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressCity">Cidade</Label>
                    <Input id="addressCity" placeholder="Campinas" {...register("addressCity")} />
                    {errors.addressCity && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressCity.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressState">Estado</Label>
                    <Input
                      id="addressState"
                      placeholder="SP"
                      maxLength={2}
                      {...register("addressState")}
                      onChange={(e) => setValue("addressState", e.target.value.toUpperCase(), { shouldValidate: true })}
                    />
                    {errors.addressState && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressState.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressNumber">Numero</Label>
                    <Input id="addressNumber" placeholder="123" {...register("addressNumber")} />
                    {errors.addressNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressComplement">Complemento</Label>
                    <Input id="addressComplement" placeholder="Apartamento, bloco, etc" {...register("addressComplement")} />
                    {errors.addressComplement && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressComplement.message}</p>
                    )}
                  </div>
                </div>
                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[#134B73]">Informacoes de Renda</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-3">
                      <Label htmlFor="enterprise">Empresa</Label>
                      <Input
                        id="enterprise"
                        placeholder="Informe a empresa que trabalha"
                        {...register("enterprise")}
                        type="text"
                      />
                      {errors.enterprise && <p className="text-red-500 text-xs mt-1">{errors.enterprise.message}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="function">Funcao exercida</Label>
                      <Input
                        id="function"
                        placeholder="Informe a funcao que exerce"
                        {...register("function")}
                        type="text"
                      />
                      {errors.function && <p className="text-red-500 text-xs mt-1">{errors.function.message}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="admission">Data de admissao</Label>
                      <Input
                        id="admission"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="DD/MM/AAAA"
                        {...register("admission")}
                        onChange={(e) => {
                          const masked = maskDate(e.target.value);
                          setValue("admission", masked, { shouldValidate: true });
                        }}
                      />
                      {errors.admission && <p className="text-red-500 text-xs mt-1">{errors.admission.message}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="income.mainValue">Renda</Label>
                      <Input
                        id="income.mainValue"
                        type="text"
                        {...register("income.mainValue")}
                        placeholder="R$ 50.760"
                        onChange={(e) => {
                          const masked = maskBRL(e.target.value);
                          setValue("income.mainValue", masked, { shouldValidate: true });
                        }}
                      />
                      {errors.income?.mainValue && (
                        <p className="text-red-500 text-xs mt-1">{errors.income?.mainValue.message}</p>
                      )}
                      <button
                        type="button"
                        className="flex items-center gap-2 text-xs text-muted-foreground p-0.5"
                        onClick={() => {
                          if (extra.length === 0) handleAddNewExtra();
                          setExtraModalOpen(true);
                        }}
                      >
                        <Plus className="size-4" />
                        Adicionar/editar renda extra
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
        </Card>

        {hasVehicleDetails && (
          <Card>
            <CardHeader>
              <div className="flex gap-3 items-center">
                <GiReceiveMoney className="h-10 w-10" />
                <aside className="flex flex-col gap-1.5">
                  <CardTitle>Valores da Proposta</CardTitle>
                  <CardDescription>Confirme o valor FIPE, entrada e envie a proposta.</CardDescription>
                </aside>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3">
                  <Label htmlFor="priceFIPE">Valor FIPE</Label>
                  <Input id="priceFIPE" readOnly {...register("priceFIPE")} />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="entryPrice">Entrada</Label>
                  <Input
                    id="entryPrice"
                    type="text"
                    {...register("entryPrice")}
                    placeholder="R$ 10.000,00"
                    onChange={(e) => {
                      const masked = maskBRL(e.target.value);
                      setValue("entryPrice", masked, { shouldValidate: true });
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full gap-2">
                    Enviar proposta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        </div>

      </form>
      <ConfirmationDialog
        isOpen={confirmationDialogIsOpen}
        onOpenChange={setConfirmationDialogIsOpen}
        resumeProposal={resumeProposal}
        setResumeProposal={setResumeProposal}
        resetForm={reset}
        resetExtra={setExtra}
        summaryVehicle={summaryVehicle}
      />
      <Dialog open={extraModalOpen} onOpenChange={setExtraModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Renda Extra</DialogTitle>
            <DialogDescription>Adicione informacoes da(s) renda(s) extra do cliente.</DialogDescription>
          </DialogHeader>
          {extra.length === 0 && (
            <p className="text-sm text-muted-foreground">Clique em “Adicionar renda extra” para incluir um item.</p>
          )}
          {extra.length > 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {extra.map((_, index) => (
                  <Fragment key={index}>
                    <div className="space-y-3">
                      <Label htmlFor={`extraValue-${index}`}>Valor</Label>
                      <Input
                        id={`extraValue-${index}`}
                        type="text"
                        {...register(`income.extra.${index}.value`)}
                        placeholder="R$ 50.760"
                        onChange={(e) => {
                          const masked = maskBRL(e.target.value);
                          setValue(`income.extra.${index}.value`, masked, { shouldValidate: true });
                        }}
                      />
                      {errors.income?.extra?.[index]?.value && (
                        <p className="text-red-500 text-xs mt-1">{errors.income?.extra?.[index]?.value.message}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor={`extraRole-${index}`}>Funcao exercida</Label>
                      <Input
                        id={`extraRole-${index}`}
                        placeholder="Informe a funcao que exerce"
                        {...register(`income.extra.${index}.role`)}
                        type="text"
                      />
                      {errors.income?.extra?.[index]?.role && (
                        <p className="text-red-500 text-xs mt-1">{errors.income?.extra?.[index]?.role.message}</p>
                      )}
                      <button
                        type="button"
                        className={`flex items-center gap-2 text-xs text-muted-foreground p-0.5 ${extra.length > index + 1 ? "hidden" : ""}`}
                        onClick={handleAddNewExtra}
                        disabled={extra.length > index + 1}
                      >
                        <Plus className="size-4" />
                        Adicionar renda extra
                      </button>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="destructive" type="button" onClick={handleDeleteExtra} className="gap-2">
                  <Trash2 className="size-4" />
                  Limpar rendas extras
                </Button>
                <Button type="button" onClick={() => setExtraModalOpen(false)}>
                  Salvar e fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
type ConfirmationDialogProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  resumeProposal: SimulateProposalFormData | null;
  setResumeProposal: Dispatch<SetStateAction<SimulateProposalFormData | null>>;
  resetForm: UseFormReset<SimulateProposalFormData>;
  resetExtra: Dispatch<SetStateAction<ExtraProps[]>>;
  summaryVehicle?: VehicleSummaryProps;
};

const ConfirmationDialog = ({
  isOpen,
  onOpenChange,
  resumeProposal,
  setResumeProposal,
  resetForm,
  resetExtra,
  summaryVehicle,
}: ConfirmationDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLgpdAccepted, setIsLgpdAccepted] = useState(false);

  const { sendMessage } = useRealtimeChannel({
    channel: REALTIME_CHANNELS.PROPOSALS,
    identity: LOGISTA_SIMULATOR_ID,
    url: REALTIME_URL,
  });

  const emitRealtimeEvent = useCallback(
    (event: string, payload?: Record<string, unknown>) => {
      dispatchBridgeEvent(sendMessage, event, {
        source: LOGISTA_SIMULATOR_ID,
        ...(payload ?? {}),
      });
    },
    [sendMessage],
  );

  const handleFinishProposal = async () => {
    if (!resumeProposal) return;
    if (!isLgpdAccepted) {
      toast.error("Confirme a autorização LGPD antes de enviar.");
      return;
    }

    try {
      setIsSubmitting(true);

      const trackingNoteParts = [
        "Origem: simulacao/novo",
        summaryVehicle?.personType ? `Pessoa: ${summaryVehicle.personType}` : "",
        summaryVehicle?.operationType ? `Operacao: ${summaryVehicle.operationType}` : "",
        summaryVehicle?.vehicleCategory ? `Categoria: ${summaryVehicle.vehicleCategory}` : "",
      ].filter(Boolean);
      const trackingNote = trackingNoteParts.length > 0 ? `[${trackingNoteParts.join(" | ")}]` : "";
      const combinedNotes = [resumeProposal.details, trackingNote].filter(Boolean).join(" | ");

      const payload: CreateProposalPayload = {
        customerCpf: unmaskCPF(resumeProposal.cpf),
        customerName: resumeProposal.fullname,
        customerBirthDate: formatDateISO(resumeProposal.birthday),
        customerEmail: resumeProposal.email,
        customerPhone: resumeProposal.phone,
        hasCnh: resumeProposal.haveCNH,
        cnhCategory: resumeProposal.categoryCNH || "",
        vehiclePlate: resumeProposal.vehiclePlate || "",
        vehicleBrand: resumeProposal.vehicleBrand || "",
        vehicleModel: resumeProposal.vehicleModel || "",
        vehicleYear: Number(resumeProposal.vehicleYear) || 0,
        fipeCode: resumeProposal.codeFIPE || "",
        fipeValue: parseBRL(resumeProposal.priceFIPE),
        downPaymentValue: parseBRL(resumeProposal.entryPrice),
        financedValue: parseBRL(resumeProposal.financedPrice),
        notes: combinedNotes,
      };

      const proposal = await createProposal(payload);
      emitRealtimeEvent(REALTIME_EVENT_TYPES.PROPOSAL_CREATED, {
        proposal,
        metadata: {
          origin: "simulacao/novo",
          personType: summaryVehicle?.personType ?? "PF",
          operationType: summaryVehicle?.operationType ?? "",
          vehicleCategory: summaryVehicle?.vehicleCategory ?? "",
        },
      });
      emitRealtimeEvent(REALTIME_EVENT_TYPES.PROPOSALS_REFRESH_REQUEST, {
        reason: "logista-simulator-created",
        metadata: {
          origin: "simulacao/novo",
          personType: summaryVehicle?.personType ?? "PF",
          operationType: summaryVehicle?.operationType ?? "",
          vehicleCategory: summaryVehicle?.vehicleCategory ?? "",
        },
      });

      onOpenChange(false);
      toast.success("Proposta enviada para esteira!");
      setResumeProposal(null);
      resetExtra([]);
      resetForm();
    } catch (error) {
      toast.error("Falha ao enviar proposta");
    } finally {
      setIsSubmitting(false);
      setIsLgpdAccepted(false);
    }
  };

  const handleCloseDialog = () => {
    onOpenChange(false);
    setResumeProposal(null);
    resetExtra([]);
    resetForm();
    setIsLgpdAccepted(false);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] space-y-2 overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Resumo da simulacao</DialogTitle>
          <DialogDescription>Validamos automaticamente se o valor solicitado cabe na FIPE.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Cliente</p>
          <p className="font-semibold text-gray-900 dark:text-gray-50">{resumeProposal?.fullname}</p>
          <p className="text-xs text-muted-foreground">{resumeProposal?.cpf}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Veiculo</p>
          <p className="font-semibold">
            {resumeProposal?.vehicleBrand} - {resumeProposal?.vehicleModel}
          </p>
          <p className="text-xs text-muted-foreground">
            Ano {resumeProposal?.vehicleYear} - Placa {resumeProposal?.vehiclePlate}
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Valor FIPE</span>
            <span className="font-semibold text-gray-900 dark:text-gray-50">{resumeProposal?.priceFIPE}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Entrada</span>
            <span className="font-semibold text-gray-900 dark:text-gray-50">{resumeProposal?.entryPrice}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Valor financiado</span>
            <span className="font-semibold text-gray-900 dark:text-gray-50">{resumeProposal?.financedPrice}</span>
          </div>
        </div>
        <div className="rounded-md border p-3 space-y-2 bg-muted/40">
          <div className="flex items-start gap-2">
            <Checkbox id="lgpdConfirm" checked={isLgpdAccepted} onCheckedChange={(checked) => setIsLgpdAccepted(!!checked)} />
            <label htmlFor="lgpdConfirm" className="text-sm text-muted-foreground leading-relaxed">
              Confirmo que revisei e estou enviando os dados conforme autorização do cliente, em conformidade com a LGPD.
            </label>
          </div>
        </div>
        <div className="w-full flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={handleCloseDialog}>
            Fechar
          </Button>
          <Button onClick={handleFinishProposal} disabled={isSubmitting || !isLgpdAccepted} type="button">
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Enviar Proposta
                <Send size={20} />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
