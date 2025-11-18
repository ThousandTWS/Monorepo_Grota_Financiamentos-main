"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  dispatchBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { Loader2, CheckCircle2, RefreshCw, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import { Input } from "@/presentation/ui/input";
import { Label } from "@/presentation/ui/label";
import { Textarea } from "@/presentation/ui/textarea";
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
import {
  CreateProposalPayload,
  Proposal,
} from "@/application/core/@types/Proposals/Proposal";
import { createProposal } from "@/application/services/Proposals/proposalService";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maskBRL, maskCPF, maskDate, maskFipeCode, maskPhone, maskPlate } from "@/application/core/utils/masks";
import { Controller } from "react-hook-form";
import { formatNumberToBRL, parseBRL } from "@/application/core/utils/formatters";

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_WS_URL;
const LOGISTA_SIMULATOR_ID = "logista-simulador";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const KNOWN_PLATES: Record<
  string,
  {
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: number;
    fipeCode: string;
    fipeValue: number;
    downPaymentValue: number;
    financedValue: number;
  }
> = {
  ABC1D23: {
    vehicleBrand: "Chevrolet",
    vehicleModel: "Onix LTZ 1.0 Turbo",
    vehicleYear: 2022,
    fipeCode: "004567-2",
    fipeValue: 83690,
    downPaymentValue: 20000,
    financedValue: 63690,
  },
  BRA2E19: {
    vehicleBrand: "Volkswagen",
    vehicleModel: "Nivus Comfortline",
    vehicleYear: 2021,
    fipeCode: "005987-4",
    fipeValue: 118500,
    downPaymentValue: 35000,
    financedValue: 83500,
  },
  GRT0A10: {
    vehicleBrand: "Jeep",
    vehicleModel: "Compass Longitude",
    vehicleYear: 2020,
    fipeCode: "006432-1",
    fipeValue: 149900,
    downPaymentValue: 45000,
    financedValue: 104900,
  },
};

const sanitizeNumber = (value: string) => {
  if (!value) return 0;
  const normalized = value.replace(",", ".").replace(/\s/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const simulateProposalSchema = z.object({
  cpf: z.string().length(14, "CPF inválido"),
  fullname: z.string().min(4, "Nome completo é obrigatório"),
  birthday: z.string().length(10, "Data de nascimento é obrigatório"),
  email: z.email("Formato de email inválido"),
  phone: z.string().length(14, "Formato de telefone inválido"),
  haveCNH: z.boolean(),
  categoryCNH: z.string().optional(),
  vehiclePlate: z.string().min(8, "Formato de placa inválida"),
  vehicleBrand: z.string().min(1, "Marca do veículo é necessário"),
  vehicleModel: z.string().min(1, "Modelo do veículo é necessário"),
  vehicleYear: z.string().min(1, "Ano do veículo é necessário"),
  codeFIPE: z.string().length(8, "Formato do código FIPE inválido"),
  priceFIPE: z.string().min(1, "Valor do veículo é necessário"),
  entryPrice: z.string().min(1, "Valor de entrada do veículo é necessário"),
  financedPrice: z.string().min(1, "Valor de financiamento é necessário"),
  details: z.string().optional()
})

export type SimulateProposalFormData = z.infer<typeof simulateProposalSchema>;

export default function SimulacaoPage() {
  const [isPlateLookupLoading, setIsPlateLookupLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastProposal, setLastProposal] = useState<Proposal | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
    control,
    watch
  } = useForm<SimulateProposalFormData>({
    resolver: zodResolver(simulateProposalSchema),
    mode: "onTouched",
    defaultValues: {
      cpf: "",
      fullname: "",
      birthday: "",
      email: "",
      phone: "",
      haveCNH: false,
      categoryCNH: "",
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

  const onSubmit = async (data: SimulateProposalFormData) => {
    setIsSubmitting(true);
    try {
      // const payload: CreateProposalPayload = {
      //   customerName: formState.customerName.trim(),
      //   customerCpf: formState.customerCpf.replace(/\D/g, ""),
      //   customerBirthDate: formState.customerBirthDate,
      //   customerEmail: formState.customerEmail.trim(),
      //   customerPhone: formState.customerPhone.replace(/\s/g, ""),
      //   cnhCategory: formState.cnhCategory,
      //   hasCnh: formState.hasCnh,
      //   vehiclePlate: formState.vehiclePlate.trim().toUpperCase(),
      //   fipeCode: formState.fipeCode.trim(),
      //   fipeValue: sanitizeNumber(formState.fipeValue),
      //   vehicleBrand: formState.vehicleBrand.trim(),
      //   vehicleModel: formState.vehicleModel.trim(),
      //   vehicleYear: Number(formState.vehicleYear || currentYear),
      //   downPaymentValue: sanitizeNumber(formState.downPaymentValue),
      //   financedValue: sanitizeNumber(formState.financedValue),
      //   notes: formState.notes.trim() || undefined,
      // };

      // const proposal = await createProposal(payload);
      // setLastProposal(proposal);
      toast.success("Ficha enviada para a esteira da Grota.");
      // emitRealtimeEvent(REALTIME_EVENT_TYPES.PROPOSAL_CREATED, {
      //   proposal,
      // });
      emitRealtimeEvent(REALTIME_EVENT_TYPES.PROPOSALS_REFRESH_REQUEST, {
        reason: "logista-simulator-created",
      });
    } catch (error) {
      console.error("[Simulacao] Falha ao enviar proposta", error);
      toast.error(
        "Não conseguimos enviar a ficha agora. Tente novamente em instantes.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!watch("haveCNH")) {
      setValue("categoryCNH", "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("haveCNH")]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-500 flex items-center gap-2">
          <FileText className="size-4" />
          Simulador de Propostas
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Preencha todos os dados do cliente e do veículo em um único fluxo simples
        </h1>
        <p className="text-sm text-muted-foreground">
          Informe os dados do cliente, consulte automaticamente o veículo pela placa e gere a ficha pronta para análise no sistema administrativo.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do cliente</CardTitle>
              <CardDescription>
                Informe o CPF para buscarmos automaticamente os dados do cliente. Os demais campos serão preenchidos quando a consulta retornar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF (consulta automática)</Label>
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullname">Nome completo</Label>
                  <Input
                    id="fullname"
                    placeholder="Fulano da Silva"
                    {...register("fullname")}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="birthday">Data de nascimento</Label>
                  <Input
                    id="birthday"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="DD/MM/AAAA"
                    {...register("birthday")}
                    onChange={
                      (e) => {
                        const masked = maskDate(e.target.value);
                        setValue("birthday", masked, { shouldValidate: true })
                      }
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@email.com"
                    {...register("email")}
                    required
                  />
                </div>
                <div className="space-y-2">
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
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações de Habilitação</CardTitle>
              <CardDescription>
                Informe se o cliente possui CNH e qual é a categoria.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="haveCNH">Possui CNH?</Label>
                <Controller
                    name="haveCNH"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
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
                    )}
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryCNH">Categoria da CNH</Label>
                
                <Controller
                  name="categoryCNH"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
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
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do veículo</CardTitle>
              <CardDescription>
                Use a placa para buscar as informações pré-configuradas ou
                preencha manualmente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                <div className="space-y-2">
                  <Label htmlFor="vehiclePlate">Placa do veículo</Label>
                  <Input
                    id="vehiclePlate"
                    placeholder="ABC-1234 ou ABC1D23"
                    maxLength={8}
                    inputMode="text"
                    {...register("vehiclePlate")}
                    onChange={
                      (e) => {
                        const masked = maskPlate(e.target.value);
                        setValue("vehiclePlate", masked, { shouldValidate: true })
                      }
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Aceitamos placas no padrão Mercosul e antigo. A consulta FIPE
                    usa uma base local de demonstração.
                  </p>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    className="w-full gap-2"
                    // onClick={handlePlateLookup}
                    disabled={isPlateLookupLoading}
                  >
                    {isPlateLookupLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <RefreshCw className="size-4" />
                    )}
                    Consultar FIPE
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicleBrand">Marca</Label>
                  <Input
                    id="vehicleBrand"
                    placeholder="Marca"
                    {...register("vehicleBrand")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Modelo</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="Modelo"
                    {...register("vehicleModel")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear">Ano</Label>
                  <Controller
                    name="vehicleYear"
                    control={control}
                    defaultValue=""
                    render={({ field }) => {
                      const currentYear = new Date().getFullYear();
                      const years = Array.from(
                        { length: currentYear - 1990 + 2 },
                        (_, i) => String(1990 + i)
                      );

                      return (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o ano" />
                          </SelectTrigger>

                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codeFIPE">Código FIPE</Label>
                  <Input
                    id="codeFIPE"
                    placeholder="000000-0"
                    {...register("codeFIPE")}
                    onChange={
                      (e) => {
                        const masked = maskFipeCode(e.target.value);
                        setValue("codeFIPE", masked, { shouldValidate: true })
                      }
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="priceFIPE">Valor FIPE</Label>
                  <Input
                    id="priceFIPE"
                    type="number"
                    {...register("priceFIPE")}
                    onChange={
                      (e) => {
                        const masked = maskBRL(e.target.value);
                        setValue("priceFIPE", masked, { shouldValidate: true })
                      }
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entrada</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    min={0}
                    {...register("entryPrice")}
                    onChange={
                      (e) => {
                        const masked = maskBRL(e.target.value);
                        setValue("entryPrice", masked, { shouldValidate: true })
                      }
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financedPrice">Valor financiado</Label>
                  <Input
                    id="financedPrice"
                    type="number"
                    min={0}
                    {...register("financedPrice")}
                    onChange={
                      (e) => {
                        const masked = maskBRL(e.target.value);
                        setValue("financedPrice", masked, { shouldValidate: true })
                      }
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
              <CardDescription>
                Use este campo para avisar o time administrativo sobre acordos
                especiais ou documentos pendentes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                id="notes"
                placeholder="CNH vence em 30 dias, cliente aceita portabilidade, etc."
                rows={4}
                className="max-h-60"
                {...register("details")}
              />
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                Enviar ficha para a esteira
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Resumo da simulação</CardTitle>
              <CardDescription>
                Validamos automaticamente se o valor solicitado cabe na FIPE.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cliente</p>
                <p className="font-semibold text-gray-900 dark:text-gray-50">
                  {watch("fullname") || "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {watch("cpf") || "CPF em branco"}
                </p>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Veículo</p>
                <p className="font-semibold">
                  {watch("vehicleBrand") || "—"} {watch("vehicleModel")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ano {watch("vehicleYear") || "—"} • Placa{" "}
                  {watch("vehiclePlate") || "—"}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Valor FIPE</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {watch("priceFIPE") || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Entrada</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {watch("entryPrice") || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Valor financiado</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {watch("financedPrice") || "—"}
                  </span>
                </div>
                <p className={`text-xs font-semibold`}>
                  {/* {summary.statusLabel} */}
                  <span className="block text-muted-foreground">
                    Diferença: {formatNumberToBRL(parseBRL(watch("financedPrice")) - parseBRL(watch("entryPrice")))}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {lastProposal ? (
            <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/40 dark:bg-emerald-950/30">
              <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-emerald-200 text-base">
                  Última ficha enviada
                </CardTitle>
                <CardDescription>
                  #{lastProposal.id} • {lastProposal.customerName} ({lastProposal.status})
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-emerald-900 dark:text-emerald-100 space-y-1">
                <p>
                  CPF: <span className="font-semibold">{lastProposal.customerCpf}</span>
                </p>
                <p>
                  Veículo:{" "}
                  <span className="font-semibold">
                    {lastProposal.vehicleBrand} {lastProposal.vehicleModel} •{" "}
                    {lastProposal.vehicleYear}
                  </span>
                </p>
                <p>
                  Valor financiado:{" "}
                  <span className="font-semibold">
                    {currency.format(lastProposal.financedValue)}
                  </span>
                </p>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80">
                  Status inicial: {lastProposal.status}. Acompanhe os andamentos na
                  esteira de propostas.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </form>
    </div>
  );
}
