"use client";

import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, FileText, UserCircle2, Info, Search, Plus, Coins, Trash2 } from "lucide-react";
import { GiCarKey, GiReceiveMoney } from "react-icons/gi";
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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maskBRL, maskCPF, maskDate, maskFipeCode, maskPhone, maskPlate, unmaskCPF } from "@/lib/masks";
import { Controller } from "react-hook-form";
import { formatName, formatNumberToBRL, parseBRL } from "@/lib/formatters";
import clsx from "clsx";
import { ConfirmationDialog } from "./components/ConfirmationDialog";

const simulateProposalSchema = z.object({
  cpf: z.string().length(14, "CPF inválido"),
  fullname: z.string().min(4, "Nome completo é obrigatório"),
  birthday: z.string().length(10, "Data de nascimento é obrigatório"),
  email: z.email("Formato de email inválido"),
  phone: z.string().length(15, "Formato de telefone inválido"),
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
  vehiclePlate: z
  .string()
  .regex(
    /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/,
    "Formato de placa inválida"
  ),
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

export interface ExtraProps {
  value: string;
  role: string;
}

export default function SimulacaoPage() {
  const [isCPFLookupLoading, setIsCPFLookupLoading] = useState(false);
  const [isPlateLookupLoading, setIsPlateLookupLoading] = useState(false);
  const [extra, setExtra] = useState<ExtraProps[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resumeProposal, setResumeProposal] = useState<SimulateProposalFormData | null>(null);
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] = useState(false);

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
      email: "",
      phone: "",
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

  const noHaveCPF = getValues("cpf").length !== 14;

  const noHavePlate = !watch("vehiclePlate");

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
        setValue("fullname", formatName(pessoa.nome.conteudo.nome) || "");
        setValue("birthday", pessoa.nome.conteudo.data_nascimento || "");
        setValue("email", pessoa.pessoas_contato.conteudo[0].numero || "");
        setValue("phone", pessoa.emails.conteudo[0].email || "");
      }
    } catch (error) {
      toast.error("Erro ao buscar CPF")
    } finally {
      setIsCPFLookupLoading(false);
      toast.success("Busca dados com CPF concluida")
    }
  }

  const handlePlateLookup = async (plateMasked: string) => {
    if(!plateMasked) return;

    try {
      setIsPlateLookupLoading(true);

      const placa = plateMasked;

      const response = await fetch("/api/searchPlaca", {
        method: "POST",
        body: JSON.stringify({ placa }),
      })

      const data = await response.json();
      const veiculo = data?.data.response;

      console.log(data);

      if(veiculo) {
        setValue("vehicleBrand", veiculo.Marca || "");
        setValue("vehicleModel", formatName(veiculo.Modelo) || "");
        setValue("vehicleYear", veiculo.AnoModelo.split("/").pop() || "");
        setValue("codeFIPE", veiculo.CodigoFipe || "");
        setValue("priceFIPE", veiculo.Valor || "");
      }
    } catch (error) {
      toast.error("Erro ao buscar placa")
    } finally {
      setIsPlateLookupLoading(false);
      toast.success("Busca dados com placa concluida")
    }
  }

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

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex gap-3 items-center">
                <UserCircle2 className="h-10 w-10" />
                <aside className="flex flex-col gap-1.5">
                  <CardTitle>Informações do cliente</CardTitle>
                  <CardDescription>
                    Use a placa para buscar as informações pré-configuradas ou
                    preencha manualmente.
                  </CardDescription>
                </aside>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 items-center">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF (consulta automática)</Label>
                      <div className="flex items-center gap-4">
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
                </div>
                <Separator />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                    <Label htmlFor="fullname" className={clsx(noHaveCPF ? "opacity-40" : "opacity-100")}>Nome completo</Label>
                    <Input
                      id="fullname"
                      placeholder="Fulano da Silva"
                      {...register("fullname")}
                      type="text"
                      disabled={noHaveCPF}
                    />
                    {errors.fullname && (
                          <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
                    )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="birthday" className={clsx(noHaveCPF ? "opacity-40" : "opacity-100")}>Data de nascimento</Label>
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
                    disabled={noHaveCPF}
                  />
                  {errors.birthday && (
                    <p className="text-red-500 text-xs mt-1">{errors.birthday.message}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className={clsx(noHaveCPF ? "opacity-40" : "opacity-100")}>E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@email.com"
                    {...register("email")}
                    disabled={noHaveCPF}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className={clsx(noHaveCPF ? "opacity-40" : "opacity-100")}>Telefone / Whatsapp</Label>
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
                    disabled={noHaveCPF}
                  />
                </div>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex gap-3 items-center">
                <GiCarKey className="h-10 w-10" />
                <aside className="flex flex-col gap-1.5">
                  <CardTitle>Dados do veículo</CardTitle>
                  <CardDescription>
                    Use a placa para buscar as informações pré-configuradas ou
                    preencha manualmente.
                  </CardDescription>
                </aside>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 items-center">
                    <div className="space-y-2">
                      <Label htmlFor="vehiclePlate">Placa do veículo</Label>
                      <div className="flex items-center gap-4">
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
                        />
                        {errors.vehiclePlate && (
                          <p className="text-red-500 text-xs mt-1">{errors.vehiclePlate.message}</p>
                        )}

                        <div className="flex items-end">
                          <Button
                            type="button"
                            className="w-full gap-2"
                            onClick={() => handlePlateLookup(getValues("vehiclePlate"))}
                            disabled={isPlateLookupLoading || !getValues("vehiclePlate")}
                          >
                            {isPlateLookupLoading ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Search className="size-4" />
                            )}
                            Buscar dados com placa
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Aceitamos placas no padrão Mercosul e antigo. A consulta FIPE
                        usa uma base local de demonstração.
                      </p>
                    </div>
                </div>
                <Separator />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="vehicleBrand" className={clsx(noHavePlate ? "opacity-40" : "opacity-100")}>Marca</Label>
                  <Input
                    id="vehicleBrand"
                    placeholder="Marca"
                    {...register("vehicleBrand")}
                    disabled={noHavePlate}
                  />
                  {errors.vehicleBrand && (
                    <p className="text-red-500 text-xs mt-1">{errors.vehicleBrand.message}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="vehicleModel" className={clsx(noHavePlate ? "opacity-40" : "opacity-100")}>Modelo</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="Modelo"
                    {...register("vehicleModel")}
                    disabled={noHavePlate}
                  />
                  {errors.vehicleModel && (
                    <p className="text-red-500 text-xs mt-1">{errors.vehicleModel.message}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="vehicleYear" className={clsx(noHavePlate ? "opacity-40" : "opacity-100")}>Ano</Label>
                  <Controller
                    name="vehicleYear"
                    control={control}
                    defaultValue=""
                    render={({ field }) => {
                      const currentYear = new Date().getFullYear();
                      const years = Array.from(
                        { length: currentYear - 1990 + 1 },
                        (_, i) => String(currentYear - i)
                      );

                      return (
                        <Fragment>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={noHavePlate}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o ano" />
                            </SelectTrigger>

                            <SelectContent className="max-h-40">
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.vehicleYear && (
                            <p className="text-red-500 text-xs mt-1">{errors.vehicleYear.message}</p>
                          )}
                        </Fragment>
                      );
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="codeFIPE" className={clsx(noHavePlate ? "opacity-40" : "opacity-100")}>Código FIPE</Label>
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
                    disabled={noHavePlate}
                  />
                  {errors.codeFIPE && (
                    <p className="text-red-500 text-xs mt-1">{errors.codeFIPE.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3">
                  <Label htmlFor="priceFIPE" className={clsx(noHavePlate ? "opacity-40" : "opacity-100")}>Valor FIPE</Label>
                  <Input
                    id="priceFIPE"
                    type="text"
                    {...register("priceFIPE")}
                    placeholder="R$69.900"
                    onChange={
                      (e) => {
                        const masked = maskBRL(e.target.value);
                        setValue("priceFIPE", masked, { shouldValidate: true })
                      }
                    }
                    disabled={noHavePlate}
                  />
                  {errors.priceFIPE && (
                    <p className="text-red-500 text-xs mt-1">{errors.priceFIPE.message}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="entryPrice">Entrada</Label>
                  <Input
                    id="entryPrice"
                    type="text"
                    placeholder="R$80.900"
                    {...register("entryPrice")}
                    onChange={
                      (e) => {
                        const masked = maskBRL(e.target.value);
                        setValue("entryPrice", masked, { shouldValidate: true })
                      }
                    }
                  />
                  {errors.entryPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.entryPrice.message}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="financedPrice">Valor financiado</Label>
                  <Input
                    id="financedPrice"
                    type="text"
                    placeholder="R$80.980"
                    disabled={isCalculating}
                    {...register("financedPrice")}
                    onChange={
                      (e) => {
                        const masked = maskBRL(e.target.value);
                        setValue("financedPrice", masked, { shouldValidate: true })
                      }
                    }
                  />
                  {errors.financedPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.financedPrice.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex gap-3 items-center">
                <Info className="h-10 w-10" />
                <aside className="flex flex-col gap-1.5">
                  <CardTitle>Observações</CardTitle>
                  <CardDescription>
                    Use este campo para avisar o time administrativo sobre acordos
                    especiais ou documentos pendentes.
                  </CardDescription>
                </aside>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                id="details"
                placeholder="CNH vence em 30 dias, cliente aceita portabilidade, etc."
                rows={4}
                className="h-[118px] resize-none"
                {...register("details")}
              />
              {errors.details && (
                <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>
              )}
              <Button
                type="submit"
                className="w-full gap-2"
              >
                <CheckCircle2 className="size-4" />
                Enviar ficha para a esteira
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>

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