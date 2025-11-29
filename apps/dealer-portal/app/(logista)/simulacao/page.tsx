"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, FileText, UserCircle2, Info, Search, Plus, Coins, Trash2 } from "lucide-react";
import { GiReceiveMoney } from "react-icons/gi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import { Badge } from "@/presentation/ui/badge";
import { Input } from "@/presentation/ui/input";
import { Label } from "@/presentation/ui/label";
import { Button } from "@/presentation/ui/button";
import { Switch } from "@/presentation/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/ui/select";
import { Separator } from "@/presentation/ui/separator";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maskBRL, maskCEP, maskCPF, maskDate, maskPhone, unmaskCPF } from "@/application/core/utils/masks";
import { Controller } from "react-hook-form";
import { formatName, formatNumberToBRL, parseBRL } from "@/application/core/utils/formatters";
import clsx from "clsx";
import { ConfirmationDialog } from "./components/ConfirmationDialog";
import viaCepService from "@/application/services/External/viaCepService";

const simulateProposalSchema = z.object({
  cpf: z.string().length(14, "CPF inválido"),
  fullname: z.string().min(4, "Nome completo é obrigatório"),
  birthday: z.string().length(10, "Data de nascimento é obrigatório"),
  motherName: z.string().min(2, "Nome da mãe é obrigatório"),
  email: z.email("Formato de email inválido"),
  phone: z.string().length(15, "Formato de telefone inválido"),
  zipCode: z.string().length(9, "CEP inválido"),
  addressStreet: z.string().optional(),
  addressNeighborhood: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  enterprise: z.string().min(1, "Nome da empresa é obrigatória"),
  function: z.string().min(1, "Função exercida é obrigatória"),
  income: z.object({
    mainValue: z.string().min(1, "Renda principal é obrigatória"),
    extra: z.array(
      z.object({
        value: z.string().min(1, "Valor da renda extra é obrigatório"),
        role: z.string().min(1, "Função da renda extra é obrigatória"),
      })
    ).optional()
  }),
  admission: z.string().min(1, "Renda é obrigatória").optional(),
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
  details: z.string().optional()
})

export type SimulateProposalFormData = z.infer<typeof simulateProposalSchema>;

export interface ExtraProps {
  value: string;
  role: string;
}

interface CpfSummaryItem {
  label: string;
  value: string;
}

const ADDRESS_LABELS = [
  "CEP",
  "Rua",
  "Número",
  "Bairro",
  "Cidade",
  "Complemento",
  "Estado",
];
const CNH_LABELS = ["Possui CNH", "Categoria CNH"];
const CONTACT_LABELS = ["Telefone", "E-mail"];
const PRESERVED_LABELS_ON_CPF_RESET = new Set([
  ...ADDRESS_LABELS,
  ...CNH_LABELS,
  ...CONTACT_LABELS,
  "Nome da mãe",
]);

export function SimulacaoPFForm() {
  const [isCPFLookupLoading, setIsCPFLookupLoading] = useState(false);
  const [isCepLookupLoading, setIsCepLookupLoading] = useState(false);
  const [extra, setExtra] = useState<ExtraProps[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resumeProposal, setResumeProposal] = useState<SimulateProposalFormData | null>(null);
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] = useState(false);
  const [cpfSummary, setCpfSummary] = useState<CpfSummaryItem[]>([]);
  const [cpfFederalStatus, setCpfFederalStatus] = useState("");
  const [cpfFederalUpdatedAt, setCpfFederalUpdatedAt] = useState("");
  const [cpfFederalSource, setCpfFederalSource] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
    watch,
    getValues
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
      details: ""
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
  const emailValue = watch("email");
  const phoneValue = watch("phone");
  const haveCNHValue = watch("haveCNH");
  const categoryCNHValue = watch("categoryCNH");
  const noHaveCPF = cpfValue.length !== 14;
  const updateSummaryEntries = useCallback(
    (items: CpfSummaryItem[], labelsToClear?: string[]) => {
      setCpfSummary((prev) => {
        const labels = new Set(labelsToClear ?? items.map((item) => item.label));
        if (labels.size === 0 && items.length === 0) {
          return prev;
        }

        const filtered = labels.size
          ? prev.filter((item) => !labels.has(item.label))
          : prev;

        const additions = items.filter((item) => Boolean(item.value));
        return [...filtered, ...additions];
      });
    },
    []
  );

  const handleCPFLookup = async (cpfMasked: string) => {
    if(!cpfMasked) return;

    try {
      setIsCPFLookupLoading(true);

      const cpf = unmaskCPF(cpfMasked);

      const response = await fetch("/api/searchCPF", {
        method: "POST",
        body: JSON.stringify({ cpf }),
      })

      const data = await response.json();
      const pessoa = data?.data.response.content;

      if(pessoa) {
        const emailFromPreferredContact = pessoa.contato_preferencial?.conteudo?.find(
          (contact: { tipo?: string }) => contact?.tipo === "EMAIL"
        )?.valor;
        const emailFromList = pessoa.emails?.conteudo?.[0];
        const preferredPhone = pessoa.pesquisa_telefones?.conteudo?.[0]?.numero ?? "";

        setValue("fullname", formatName(pessoa.nome.conteudo?.nome) ?? "");
        setValue("birthday", pessoa.nome.conteudo?.data_nascimento ?? "");
        setValue("motherName", formatName(pessoa.nome.conteudo?.mae) ?? "");
        setValue(
          "phone",
          preferredPhone
        );
        setValue("email", emailFromPreferredContact ?? emailFromList ?? "");
        const primaryAddress = pessoa.pesquisa_enderecos?.conteudo?.[0]
          ?? pessoa.enderecos?.conteudo?.[0]
          ?? pessoa.endereco?.conteudo
          ?? null;
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
          {
            label: "Dados atualizados em",
            value: receitaFederalUpdatedAt,
          },
          {
            label: "Status Receita Federal",
            value: receitaFederalStatus,
          },
          {
            label: "Fonte de verificação",
            value: receitaFederalSource,
          },
          {
            label: "CPF consultado",
            value: cpfMasked,
          },
          {
            label: "Nome completo",
            value: formatName(pessoa.nome.conteudo?.nome) ?? "",
          },
          {
            label: "Data de nascimento",
            value: pessoa.nome.conteudo?.data_nascimento ?? "",
          },
          {
            label: "Nome da mãe",
            value: pessoa.nome.conteudo?.mae ?? "",
          },
          {
            label: "Telefone",
            value: preferredPhone,
          },
          {
            label: "E-mail",
            value: emailFromPreferredContact ?? emailFromList ?? "",
          },
        ].filter((item) => Boolean(item.value));
        setCpfSummary(summaryItems);
        setCpfFederalStatus(receitaFederalStatus);
        setCpfFederalUpdatedAt(receitaFederalUpdatedAt);
        setCpfFederalSource(receitaFederalSource);

        toast.success("Dados da pessoa encontradas");
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
      toast.error("Erro ao buscar CPF")
    } finally {
      setIsCPFLookupLoading(false);
    }
  }

  const handleCepLookup = async (cepMasked: string) => {
    const sanitizedCep = (cepMasked ?? "").replace(/\D/g, "");

    if (sanitizedCep.length !== 8) {
      toast.error("Informe um CEP válido");
      return;
    }

    try {
      setIsCepLookupLoading(true);
      const address = await viaCepService.lookup(sanitizedCep);
      const summaryAddressItems: CpfSummaryItem[] = [
        {
          label: "CEP",
          value: maskCEP(sanitizedCep),
        },
        {
          label: "Rua",
          value: address.street ?? "",
        },
        {
          label: "Bairro",
          value: address.neighborhood ?? "",
        },
        {
          label: "Cidade",
          value: address.city ?? "",
        },
        {
          label: "Complemento",
          value: address.complement ?? "",
        },
        {
          label: "Estado",
          value: address.state ?? "",
        },
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
      toast.success("Endereço atualizado pelo CEP");
    } catch (error) {
      toast.error("Não conseguimos consultar o CEP informado.");
    } finally {
      setIsCepLookupLoading(false);
    }
  };

  const handleAddNewExtra = () => {
    const newExtra: ExtraProps = {
      role: "",
      value: ""
    }

    setExtra((prev) => [
      ...prev,
      newExtra
    ])
  }

  const handleDeleteExtra = () => {
    setExtra([]);
    setValue("income.extra", []);
  };


  const onSubmit = async (data: SimulateProposalFormData) => {
    setResumeProposal(data);
    setConfirmationDialogIsOpen(true);
  };

  useEffect(() => {
    if (cpfValue.length !== 14) {
      setCpfSummary((prev) =>
        prev.filter((item) => PRESERVED_LABELS_ON_CPF_RESET.has(item.label))
      );
      setCpfFederalStatus("");
      setCpfFederalUpdatedAt("");
      setCpfFederalSource("");
      setValue("motherName", "");
    }
  }, [cpfValue, setValue]);

  useEffect(() => {
    const manualAddressItems: CpfSummaryItem[] = [];
    if (zipCodeValue) {
      manualAddressItems.push({ label: "CEP", value: zipCodeValue });
    }
    if (addressStreetValue) {
      manualAddressItems.push({ label: "Rua", value: addressStreetValue });
    }
    if (addressNeighborhoodValue) {
      manualAddressItems.push({ label: "Bairro", value: addressNeighborhoodValue });
    }
    if (addressCityValue) {
      manualAddressItems.push({ label: "Cidade", value: addressCityValue });
    }
    if (addressStateValue) {
      manualAddressItems.push({ label: "Estado", value: addressStateValue });
    }
    if (addressNumberValue) {
      manualAddressItems.push({ label: "Número", value: addressNumberValue });
    }
    if (addressComplementValue) {
      manualAddressItems.push({ label: "Complemento", value: addressComplementValue });
    }

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
    const motherItems: CpfSummaryItem[] = motherNameValue
      ? [{ label: "Nome da mãe", value: motherNameValue }]
      : [];
    updateSummaryEntries(motherItems, ["Nome da mãe"]);
  }, [motherNameValue, updateSummaryEntries]);

  useEffect(() => {
    const cnhItems: CpfSummaryItem[] = haveCNHValue
      ? [
          { label: "Possui CNH", value: "Sim" },
          ...(categoryCNHValue
            ? [{ label: "Categoria CNH", value: categoryCNHValue }]
            : []),
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
    if (!watch("haveCNH")) {
      setValue("categoryCNH", "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("haveCNH")]);

  useEffect(() => {
    setTimeout(() => {
      if (getValues("priceFIPE").length > 0 && getValues("entryPrice").length > 0) {
        try {
          setIsCalculating(true);
          const someValue = parseBRL(getValues("priceFIPE")) - parseBRL(getValues("entryPrice"));
          setValue("financedPrice", maskBRL(formatNumberToBRL(someValue)));
        } catch (error) {
          toast.error(
            "Não conseguimos realizar o cálculo automáticamente. Tente novamente em instantes ou preencha manualmente.",
          );
        } finally {
          setIsCalculating(false);
        }
      }
    }, 750)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("priceFIPE"), watch("entryPrice")]);

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <Card className="h-full">
            <CardHeader>
              <div className="flex gap-3 items-center">
                <UserCircle2 className="h-10 w-10" />
                <aside className="flex flex-col gap-1.5">
                  <CardTitle>Informações do cliente</CardTitle>
                  <CardDescription>
                    Preencha ou consulte os dados principais do cliente.
                  </CardDescription>
                </aside>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 items-start md:grid-cols-2">
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
                              <span className="text-sm text-muted-foreground">
                                {field.value ? "Sim" : "Não"}
                              </span>
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
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!watch("haveCNH")}
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
                            {errors.categoryCNH && (
                              <p className="text-red-500 text-xs mt-1">{errors.categoryCNH.message}</p>
                            )}
                          </Fragment>
                        )}
                      />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cpf">CPF (consulta automática)</Label>
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                      <Input
                        id="cpf"
                        inputMode="numeric"
                        maxLength={14}
                        placeholder="Digite o CPF para buscar os dados"
                        {...register("cpf")}
                        onChange={
                          (e) => {
                            const masked = maskCPF(e.target.value);
                            setValue("cpf", masked, { shouldValidate: true })
                          }
                        }
                      />
                      {errors.cpf && (
                        <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>
                      )}

                      <div className="flex items-end">
                        <Button
                          type="button"
                          className="w-full gap-2"
                          onClick={() => handleCPFLookup(getValues("cpf"))}
                          disabled={isCPFLookupLoading || noHaveCPF}
                        >
                          {isCPFLookupLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Search className="size-4" />
                          )}
                          Buscar dados com CPF
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Preencha o CPF corretamente para preenchimento automático dos demais dados solicitados.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="motherName">Nome da mãe</Label>
                    <Input
                      id="motherName"
                      placeholder="Nome completo da mãe"
                      {...register("motherName")}
                      className={clsx(isCPFLookupLoading && "input-loading")}
                      disabled={isCPFLookupLoading}
                    />
                    {errors.motherName && (
                      <p className="text-red-500 text-xs mt-1">{errors.motherName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@email.com"
                      {...register("email")}
                      className={clsx(isCPFLookupLoading && "input-loading")}
                      disabled={isCPFLookupLoading}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                    <div className="space-y-1">
                      <Input />
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="phone">Telefone / Whatsapp</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-0000"
                      {...register("phone")}
                      onChange={
                        (e) => {
                          const masked = maskPhone(e.target.value);
                          setValue("phone", masked, { shouldValidate: true })
                        }
                      }
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
                      className={clsx(
                        "md:max-w-xs",
                        isCepLookupLoading && "input-loading"
                      )}
                    />
                    <Button
                      type="button"
                      className="md:w-auto gap-2"
                      onClick={() => handleCepLookup(getValues("zipCode"))}
                      disabled={
                        isCepLookupLoading ||
                        zipCodeValue.replace(/\D/g, "").length !== 8
                      }
                    >
                      {isCepLookupLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Search className="size-4" />
                      )}
                      Buscar CEP
                    </Button>
                  </div>
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="addressStreet">Rua</Label>
                    <Input
                      id="addressStreet"
                      placeholder="Av. Brasil"
                      {...register("addressStreet")}
                    />
                    {errors.addressStreet && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressStreet.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressNeighborhood">Bairro</Label>
                    <Input
                      id="addressNeighborhood"
                      placeholder="Centro"
                      {...register("addressNeighborhood")}
                    />
                    {errors.addressNeighborhood && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressNeighborhood.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressCity">Cidade</Label>
                    <Input
                      id="addressCity"
                      placeholder="Campinas"
                      {...register("addressCity")}
                    />
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
                      onChange={(e) =>
                        setValue("addressState", e.target.value.toUpperCase(), {
                          shouldValidate: true,
                        })
                      }
                    />
                    {errors.addressState && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressState.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressNumber">Número</Label>
                    <Input
                      id="addressNumber"
                      placeholder="123"
                      {...register("addressNumber")}
                    />
                    {errors.addressNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressComplement">Complemento</Label>
                    <Input
                      id="addressComplement"
                      placeholder="Apartamento, bloco, etc"
                      {...register("addressComplement")}
                    />
                    {errors.addressComplement && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressComplement.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {cpfSummary.length > 0 && (
            <Card className="h-full">
              <CardHeader>
                <div className="flex gap-3 items-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  <aside className="flex flex-col gap-1.5">
                    <CardTitle>Resumo da validação</CardTitle>
                    <CardDescription>
                      Dados confirmados automaticamente pela consulta do CPF.
                    </CardDescription>
                  </aside>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(cpfFederalStatus || cpfFederalUpdatedAt) && (
                  <div className="space-y-1.5 rounded-md border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Info className="size-4" />
                        <div className="flex flex-col">
                          <span className="font-semibold">Dados atualizados e verificados</span>
                          {cpfFederalSource && (
                            <span className="text-xs text-emerald-800/80 dark:text-emerald-200/80">
                              Origem: {cpfFederalSource}
                            </span>
                          )}
                        </div>
                      </div>
                      {cpfFederalStatus && (
                        <Badge className="bg-white text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100" variant="outline">
                          {cpfFederalStatus}
                        </Badge>
                      )}
                    </div>
                    {cpfFederalUpdatedAt && (
                      <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80">
                        Última atualização: {cpfFederalUpdatedAt}
                      </p>
                    )}
                  </div>
                )}
                {cpfSummary.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between rounded-md border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                    <CheckCircle2 className="size-5 flex-shrink-0 text-emerald-500" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-3 items-center">
              <GiReceiveMoney className="h-10 w-10" />
              <aside className="flex flex-col gap-1.5">
                <CardTitle>Informações de Renda</CardTitle>
                <CardDescription>
                  Preencha qual os dados quanto a renda do cliente.
                </CardDescription>
              </aside>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                  <Label htmlFor="enterprise">Empresa</Label>
                  <Input
                    id="enterprise"
                    placeholder="Informe a empresa que trabalha"
                    {...register("enterprise")}
                    type="text"
                  />
                  {errors.enterprise && (
                    <p className="text-red-500 text-xs mt-1">{errors.enterprise.message}</p>
                  )}
              </div>
              <div className="space-y-3">
                  <Label htmlFor="function">Função exercida</Label>
                  <Input
                    id="function"
                    placeholder="Informe a função que exerce"
                    {...register("function")}
                    type="text"
                  />
                  {errors.function && (
                    <p className="text-red-500 text-xs mt-1">{errors.function.message}</p>
                  )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="admission">Data de admissão</Label>
                <Input
                  id="admission"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="DD/MM/AAAA"
                  {...register("admission")}
                  onChange={
                    (e) => {
                      const masked = maskDate(e.target.value);
                      setValue("admission", masked, { shouldValidate: true })
                    }
                  }
                />
                {errors.admission && (
                  <p className="text-red-500 text-xs mt-1">{errors.admission.message}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="income.mainValue">Renda</Label>
                <Input
                  id="income.mainValue"
                  type="text"
                  {...register("income.mainValue")}
                  placeholder="R$50.760"
                  onChange={
                    (e) => {
                      const masked = maskBRL(e.target.value);
                      setValue("income.mainValue", masked, { shouldValidate: true })
                    }
                  }
                />
                {errors.income?.mainValue && (
                  <p className="text-red-500 text-xs mt-1">{errors.income?.mainValue.message}</p>
                )}
                <button
                  className={`flex items-center gap-2 text-xs text-muted-foreground p-0.5 ${extra.length > 0 ? "hidden" : ""}`}
                  onClick={handleAddNewExtra}
                  disabled={extra.length > 0}
                >
                  <Plus className="size-4"/>
                  Adicionar renda extra
                </button>
              </div>
              {
                 extra.length > 0 && (
                  <Card className="w-full col-span-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3 items-center">
                            <Coins className="h-10 w-10" />
                            <aside className="flex flex-col gap-1.5">
                              <CardTitle>Renda Extra</CardTitle>
                              <CardDescription>
                                Adicione informações da(s) renda(s) extra do cliente.
                              </CardDescription>
                            </aside>
                          </div>
                          <Button variant="destructive" size="icon" onClick={handleDeleteExtra}>
                            <Trash2 />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          {
                            extra.map((extraInfo, index) => (
                              <Fragment key={index}>
                                <div className="space-y-3">
                                  <Label htmlFor="extraValue">Valor</Label>
                                  <Input
                                    id="extraValue"
                                    type="text"
                                    {...register(`income.extra.${index}.value`)}
                                    placeholder="R$50.760"
                                    onChange={
                                      (e) => {
                                        const masked = maskBRL(e.target.value);
                                        setValue(`income.extra.${index}.value`, masked, { shouldValidate: true })
                                      }
                                    }
                                  />
                                  {errors.income?.extra?.[index]?.value && (
                                    <p className="text-red-500 text-xs mt-1">{errors.income?.extra?.[index]?.value.message}</p>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  <Label htmlFor="extraRole">Função exercida</Label>
                                  <Input
                                    id="extraRole"
                                    placeholder="Informe a função que exerce"
                                    {...register(`income.extra.${index}.role`)}
                                    type="text"
                                  />
                                  {errors.income?.extra?.[index]?.role && (
                                    <p className="text-red-500 text-xs mt-1">{errors.income?.extra?.[index]?.role.message}</p>
                                  )}
                                  <button
                                    className={`flex items-center gap-2 text-xs text-muted-foreground p-0.5 ${extra.length > index + 1 ? "hidden" : ""}`}
                                    onClick={handleAddNewExtra}
                                    disabled={extra.length > index + 1}
                                  >
                                    <Plus className="size-4"/>
                                    Adicionar renda extra
                                  </button>
                                </div>
                              </Fragment>
                            ))
                          }
                        </div>
                      </CardContent>
                    </Card>
                ) 
              }
            </div>
          </CardContent>
        </Card>
      </form>
      <ConfirmationDialog
        isOpen={confirmationDialogIsOpen}
        onOpenChange={setConfirmationDialogIsOpen}
        resumeProposal={resumeProposal}
        setResumeProposal={setResumeProposal}
        resetForm={reset}
        resetExtra={setExtra}
      />
    </Fragment>
  );
}

export default function SimulacaoPage() {
  const [personType, setPersonType] = useState<"PF" | "PJ">("PF");

  return (
    <Fragment>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-brand-500 flex items-center gap-2">
            <FileText className="size-4" />
            Simulador de Propostas
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Preencha todos os dados do cliente em um único fluxo simples
          </h1>
          <p className="text-sm text-muted-foreground">
            Informe os dados do cliente e gere a ficha pronta para análise no sistema administrativo.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <UserCircle2 className="h-8 w-8" />
                <aside className="flex flex-col">
                  <CardTitle>Operação</CardTitle>
                  <CardDescription>Selecione o tipo de simulação.</CardDescription>
                </aside>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant={personType === "PF" ? "default" : "outline"}
                  className="gap-2"
                  onClick={() => setPersonType("PF")}
                >
                  <UserCircle2 className="h-4 w-4" />
                  Pessoa Física
                </Button>
                <Button
                  type="button"
                  variant={personType === "PJ" ? "default" : "outline"}
                  className="gap-2"
                  onClick={() => setPersonType("PJ")}
                >
                  <FileText className="h-4 w-4" />
                  Pessoa Jurídica
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {personType === "PF" ? (
          <SimulacaoPFForm />
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8" />
                <aside className="flex flex-col gap-1.5">
                  <CardTitle>Simulação para Pessoa Jurídica</CardTitle>
                  <CardDescription>
                    Em breve vamos preencher com dados da API Brasil para PJ.
                  </CardDescription>
                </aside>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                Selecione Pessoa Jurídica quando quiser simular empresas. Integração com API Brasil será adicionada aqui.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Fragment>
  );
}
