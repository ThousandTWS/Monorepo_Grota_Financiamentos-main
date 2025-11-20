"use client";

import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  dispatchBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { Loader2, CheckCircle2, Zap, RefreshCw } from "lucide-react";
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

type FormState = {
  dealerId: string;
  sellerId: string;
  customerName: string;
  customerCpf: string;
  customerBirthDate: string;
  customerEmail: string;
  customerPhone: string;
  cnhCategory: string;
  hasCnh: boolean;
  vehiclePlate: string;
  fipeCode: string;
  fipeValue: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  downPaymentValue: string;
  financedValue: string;
  notes: string;
};

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_WS_URL;
const LOGISTA_SIMULATOR_ID = "logista-simulador";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const currentYear = new Date().getFullYear();

const emptyFormState: FormState = {
  dealerId: "",
  sellerId: "",
  customerName: "",
  customerCpf: "",
  customerBirthDate: "",
  customerEmail: "",
  customerPhone: "",
  cnhCategory: "B",
  hasCnh: true,
  vehiclePlate: "",
  fipeCode: "",
  fipeValue: "",
  vehicleBrand: "",
  vehicleModel: "",
  vehicleYear: String(currentYear),
  downPaymentValue: "",
  financedValue: "",
  notes: "",
};

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

export default function SimulacaoPage() {
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const [isPlateLookupLoading, setIsPlateLookupLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastProposal, setLastProposal] = useState<Proposal | null>(null);

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

  const handleChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "vehiclePlate"
          ? event.target.value.toUpperCase()
          : event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSelectChange = (field: keyof FormState) => (value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleHasCnh = (checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      hasCnh: checked,
      cnhCategory: checked ? prev.cnhCategory : "",
    }));
  };

  const handlePlateLookup = async () => {
    const normalizedPlate = formState.vehiclePlate
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase();
    if (!normalizedPlate) {
      toast.info("Informe a placa antes de consultar a FIPE.");
      return;
    }

    setIsPlateLookupLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const snapshot = KNOWN_PLATES[normalizedPlate];
    if (!snapshot) {
      toast.info(
        "Não encontramos essa placa em nossa base de demonstração. Preencha os dados manualmente.",
      );
      setIsPlateLookupLoading(false);
      return;
    }

    setFormState((prev) => ({
      ...prev,
      vehiclePlate: normalizedPlate,
      vehicleBrand: snapshot.vehicleBrand,
      vehicleModel: snapshot.vehicleModel,
      vehicleYear: String(snapshot.vehicleYear),
      fipeCode: snapshot.fipeCode,
      fipeValue: String(snapshot.fipeValue),
      downPaymentValue: String(snapshot.downPaymentValue),
      financedValue: String(snapshot.financedValue),
    }));
    toast.success("Consulta FIPE preenchida automaticamente.");
    setIsPlateLookupLoading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: CreateProposalPayload = {
        dealerId: formState.dealerId ? Number(formState.dealerId) : undefined,
        sellerId: formState.sellerId ? Number(formState.sellerId) : undefined,
        customerName: formState.customerName.trim(),
        customerCpf: formState.customerCpf.replace(/\D/g, ""),
        customerBirthDate: formState.customerBirthDate,
        customerEmail: formState.customerEmail.trim(),
        customerPhone: formState.customerPhone.replace(/\s/g, ""),
        cnhCategory: formState.cnhCategory,
        hasCnh: formState.hasCnh,
        vehiclePlate: formState.vehiclePlate.trim().toUpperCase(),
        fipeCode: formState.fipeCode.trim(),
        fipeValue: sanitizeNumber(formState.fipeValue),
        vehicleBrand: formState.vehicleBrand.trim(),
        vehicleModel: formState.vehicleModel.trim(),
        vehicleYear: Number(formState.vehicleYear || currentYear),
        downPaymentValue: sanitizeNumber(formState.downPaymentValue),
        financedValue: sanitizeNumber(formState.financedValue),
        notes: formState.notes.trim() || undefined,
      };

      const proposal = await createProposal(payload);
      setLastProposal(proposal);
      toast.success("Ficha enviada para a esteira da Grota.");
      emitRealtimeEvent(REALTIME_EVENT_TYPES.PROPOSAL_CREATED, {
        proposal,
      });
      emitRealtimeEvent(REALTIME_EVENT_TYPES.PROPOSALS_REFRESH_REQUEST, {
        reason: "logista-simulator-created",
      });
      setFormState((prev) => ({
        ...emptyFormState,
        dealerId: prev.dealerId,
        sellerId: prev.sellerId,
      }));
    } catch (error) {
      console.error("[Simulacao] Falha ao enviar proposta", error);
      toast.error(
        "Não conseguimos enviar a ficha agora. Tente novamente em instantes.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const summary = useMemo(() => {
    const fipe = sanitizeNumber(formState.fipeValue);
    const financed = sanitizeNumber(formState.financedValue);
    const downPayment = sanitizeNumber(formState.downPaymentValue);
    const difference = fipe - financed - downPayment;
    return {
      fipe,
      financed,
      downPayment,
      difference,
      statusLabel:
        fipe > 0
          ? financed + downPayment <= fipe
            ? "Valor dentro da FIPE"
            : "Verificar ajuste de valores"
          : "Aguardando consulta da placa",
      statusTone:
        fipe > 0
          ? financed + downPayment <= fipe
            ? "text-emerald-600"
            : "text-amber-600"
          : "text-muted-foreground",
    };
  }, [formState]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-500 flex items-center gap-2">
          <Zap className="size-4" />
          Simulador de Propostas
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Capture todos os dados da loja em um único fluxo
        </h1>
        <p className="text-sm text-muted-foreground">
          Consulte o veículo pela placa, puxe a FIPE pré-configurada e gere a
          ficha que cai automaticamente na esteira do admin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Identificação da loja</CardTitle>
              <CardDescription>
                Informe os códigos da loja e do vendedor conectados neste login.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dealerId">ID do lojista</Label>
                <Input
                  id="dealerId"
                  type="number"
                  min={1}
                  placeholder="Ex: 12"
                  value={formState.dealerId}
                  onChange={handleChange("dealerId")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerId">ID do vendedor</Label>
                <Input
                  id="sellerId"
                  type="number"
                  min={1}
                  placeholder="Ex: 34"
                  value={formState.sellerId}
                  onChange={handleChange("sellerId")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do cliente</CardTitle>
              <CardDescription>
                CPF, nome completo, data de nascimento e contatos entram aqui.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nome completo</Label>
                  <Input
                    id="customerName"
                    placeholder="Fulano da Silva"
                    value={formState.customerName}
                    onChange={handleChange("customerName")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerCpf">CPF</Label>
                  <Input
                    id="customerCpf"
                    inputMode="numeric"
                    maxLength={14}
                    placeholder="000.000.000-00"
                    value={formState.customerCpf}
                    onChange={handleChange("customerCpf")}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="customerBirthDate">Data de nascimento</Label>
                  <Input
                    id="customerBirthDate"
                    type="date"
                    value={formState.customerBirthDate}
                    onChange={handleChange("customerBirthDate")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">E-mail</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="cliente@email.com"
                    value={formState.customerEmail}
                    onChange={handleChange("customerEmail")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Celular</Label>
                  <Input
                    id="customerPhone"
                    placeholder="(11) 99999-0000"
                    value={formState.customerPhone}
                    onChange={handleChange("customerPhone")}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CNH e contato</CardTitle>
              <CardDescription>
                Informe se o cliente possui CNH e qual categoria.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Possui CNH?</Label>
                <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                  <Switch
                    checked={formState.hasCnh}
                    onCheckedChange={handleToggleHasCnh}
                    id="hasCnh"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formState.hasCnh ? "Sim" : "Não"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={formState.cnhCategory}
                  onValueChange={handleSelectChange("cnhCategory")}
                  disabled={!formState.hasCnh}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Categoria A</SelectItem>
                    <SelectItem value="B">Categoria B</SelectItem>
                    <SelectItem value="AB">Categoria AB</SelectItem>
                    <SelectItem value="C">Categoria C</SelectItem>
                    <SelectItem value="D">Categoria D</SelectItem>
                  </SelectContent>
                </Select>
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
                    placeholder="ABC1D23"
                    value={formState.vehiclePlate}
                    onChange={handleChange("vehiclePlate")}
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
                    onClick={handlePlateLookup}
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
                    value={formState.vehicleBrand}
                    onChange={handleChange("vehicleBrand")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Modelo</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="Modelo"
                    value={formState.vehicleModel}
                    onChange={handleChange("vehicleModel")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear">Ano</Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    min={1990}
                    max={currentYear + 1}
                    value={formState.vehicleYear}
                    onChange={handleChange("vehicleYear")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fipeCode">Código FIPE</Label>
                  <Input
                    id="fipeCode"
                    placeholder="000000-0"
                    value={formState.fipeCode}
                    onChange={handleChange("fipeCode")}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="fipeValue">Valor FIPE</Label>
                  <Input
                    id="fipeValue"
                    type="number"
                    min={0}
                    value={formState.fipeValue}
                    onChange={handleChange("fipeValue")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downPaymentValue">Entrada</Label>
                  <Input
                    id="downPaymentValue"
                    type="number"
                    min={0}
                    value={formState.downPaymentValue}
                    onChange={handleChange("downPaymentValue")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financedValue">Valor financiado</Label>
                  <Input
                    id="financedValue"
                    type="number"
                    min={0}
                    value={formState.financedValue}
                    onChange={handleChange("financedValue")}
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
                value={formState.notes}
                onChange={handleChange("notes")}
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
                  {formState.customerName || "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formState.customerCpf || "CPF em branco"}
                </p>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Veículo</p>
                <p className="font-semibold">
                  {formState.vehicleBrand || "—"} {formState.vehicleModel}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ano {formState.vehicleYear || "—"} • Placa{" "}
                  {formState.vehiclePlate || "—"}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Valor FIPE</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {currency.format(summary.fipe)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Entrada</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {currency.format(summary.downPayment)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Valor financiado</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {currency.format(summary.financed)}
                  </span>
                </div>
                <p className={`text-xs font-semibold ${summary.statusTone}`}>
                  {summary.statusLabel}
                  <span className="block text-muted-foreground">
                    Diferença: {currency.format(summary.difference)}
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
