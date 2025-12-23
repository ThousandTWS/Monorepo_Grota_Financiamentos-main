"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createManager } from "@/application/services/Manager/managerService";
import { getAllLogistics, Dealer } from "@/application/services/Logista/logisticService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { Input } from "@/presentation/layout/components/ui/input";
import { Label } from "@/presentation/layout/components/ui/label";
import { Button } from "@/presentation/layout/components/ui/button";
import { Separator } from "@/presentation/layout/components/ui/separator";
import { ManagersList } from "@/presentation/features/painel-geral/components/ManagersList";
import { createNotification } from "@/application/services/Notifications/notificationService";
import { Checkbox } from "@/presentation/layout/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/layout/components/ui/select";
import { fetchAddressByCep } from "@/application/services/cep/cepService";
import { StatusBadge } from "@/presentation/features/logista/components/status-badge";
import { formatName } from "@/lib/formatters";
import { convertBRtoISO } from "@/application/core/utils/formatters";
import { Loader2 } from "lucide-react";

const managerSchema = z.object({
  dealerId: z.string().optional(),
  fullName: z.string().min(2, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Informe o telefone"),
  password: z
    .string()
    .min(6, "A senha precisa ter no mínimo 6 caracteres")
    .max(8, "A senha deve ter no máximo 8 caracteres"),
  cpf: z.string().min(11, "Informe o CPF"),
  birthData: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD"),
  street: z.string().min(3, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z
    .string()
    .min(2, "UF inválida")
    .max(2, "UF inválida"),
  zipCode: z.string().min(8, "Informe o CEP"),
  canView: z.boolean().default(true),
  canCreate: z.boolean().default(true),
  canUpdate: z.boolean().default(true),
  canDelete: z.boolean().default(true),
});

type ManagerFormValues = z.infer<typeof managerSchema>;

const digitsOnly = (value: string) => value.replace(/\D/g, "");
const brazilStates = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default function Gestores() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <GestoresContent />
    </Suspense>
  );
}

function GestoresContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isCpfLoading, setIsCpfLoading] = useState(false);
  const [cpfVerified, setCpfVerified] = useState(false);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [lastCpfLookup, setLastCpfLookup] = useState("");
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ManagerFormValues>({
    //@ts-ignore
    resolver: zodResolver(managerSchema),
    defaultValues: {
      dealerId: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      cpf: "",
      birthData: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "SP",
      zipCode: "",
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
    },
  });

  const selectedDealerId = watch("dealerId");

  useEffect(() => {
    getAllLogistics()
      .then((data) => setDealers(Array.isArray(data) ? data : []))
      .catch(() => setDealers([]));
  }, []);

  useEffect(() => {
    const dealerIdParam = searchParams.get("dealerId");
    if (dealerIdParam) {
      setValue("dealerId", dealerIdParam);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (values: ManagerFormValues) => {
    const cpfDigits = digitsOnly(values.cpf);
    if (isCpfLoading) {
      toast.error("Aguarde a verificacao do CPF.");
      return;
    }
    if (cpfDigits.length === 11 && !cpfVerified) {
      toast.error("CPF nao verificado na Receita.");
      return;
    }

    setIsSubmitting(true);
    try {
      const birthDateIso = new Date(values.birthData).toISOString().split("T")[0];
      const dealerId = values.dealerId ? Number(values.dealerId) : undefined;

      await createManager({
        dealerId,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: digitsOnly(values.phone),
        password: values.password,
        CPF: digitsOnly(values.cpf),
        birthData: birthDateIso,
        address: {
          street: values.street.trim(),
          number: values.number.trim(),
          complement: values.complement?.trim() ?? "",
          neighborhood: values.neighborhood.trim(),
          //@ts-ignore
          city: values.city.trim(),
          state: values.state.trim().toUpperCase(),
          zipCode: digitsOnly(values.zipCode),
        },
        canView: values.canView,
        canCreate: values.canCreate,
        canUpdate: values.canUpdate,
        canDelete: values.canDelete,
      });

      toast.success("Gestor cadastrado com sucesso!");
      await createNotification({
        title: "Novo gestor cadastrado",
        description: `${values.fullName} foi criado no painel admin.`,
        actor: "Admin",
        targetType: "ADMIN",
        targetId: 0,
        href: "/gestores",
      }).catch((err) => {
        console.warn("Falha ao notificar criação de gestor:", err);
      });
      reset();
      setCpfVerified(false);
      setCpfError(null);
      setLastCpfLookup("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o gestor.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCpfLookup = async (value: string) => {
    const digits = digitsOnly(value);
    if (digits.length < 11) {
      setCpfVerified(false);
      setCpfError(null);
      setLastCpfLookup("");
      return;
    }

    if (digits.length !== 11 || digits === lastCpfLookup) return;

    setIsCpfLoading(true);
    setCpfVerified(false);
    setCpfError(null);
    setLastCpfLookup(digits);
    try {
      const res = await fetch("/api/searchCPF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: digits }),
      });
      const response = await res.json().catch(() => null);
      if (!res.ok || !response?.success) {
        const message =
          response?.error ||
          response?.message ||
          response?.data?.error ||
          response?.data?.message ||
          "Nao foi possivel verificar o CPF.";
        setCpfError(message);
        throw new Error(message);
      }

      const data = response?.data?.response?.content;
      const name = data?.nome?.conteudo?.nome || "";
      const birthDate = data?.nome?.conteudo?.data_nascimento || "";

      if (name) {
        setValue("fullName", formatName(name), { shouldValidate: true });
      }
      if (birthDate) {
        setValue("birthData", convertBRtoISO(birthDate), { shouldValidate: true });
      }
      setCpfVerified(true);
      setCpfError(null);
      toast.success("CPF verificado na Receita!");
    } catch (error) {
      console.error("[gestores] CPF lookup", error);
      setCpfVerified(false);
      const message =
        error instanceof Error ? error.message : "Nao foi possivel verificar o CPF.";
      setCpfError(message);
      toast.error(message);
    } finally {
      setIsCpfLoading(false);
    }
  };

  const handleCepLookup = async () => {
    const cep = digitsOnly(watch("zipCode") ?? "");
    if (cep.length !== 8) {
      toast.error("Informe um CEP com 8 dígitos.");
      return;
    }
    setIsCepLoading(true);
    try {
      const address = await fetchAddressByCep(cep);
      if (!address) {
        toast.error("CEP não encontrado.");
        return;
      }
      setValue("street", address.street ?? "");
      setValue("neighborhood", address.neighborhood ?? "");
      setValue("city", address.city ?? "");
      setValue("state", (address.state ?? "").toUpperCase());
    } catch (error) {
      console.error("[gestores] CEP lookup", error);
      toast.error("Não foi possível buscar o CEP.");
    } finally {
      setIsCepLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Novo gestor</CardTitle>
          <CardDescription>
            Crie gestores que poderão administrar o painel com o e-mail e senha cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          <form
           //@ts-ignore
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dealerId">Loja (opcional)</Label>
              <Select
                value={selectedDealerId ?? ""}
                onValueChange={(value) => setValue("dealerId", value)}
              >
                <SelectTrigger id="dealerId">
                  <SelectValue placeholder="Selecione a loja (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {dealers.map((dealer) => (
                    <SelectItem key={dealer.id} value={String(dealer.id)}>
                      {dealer.fullName} — {dealer.enterprise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dealerId && (
                <p className="text-sm text-red-500">{errors.dealerId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register("phone")} placeholder="(11) 99999-0000" />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha (6 a 8 caracteres)</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <div className="relative">
                <Input
                  id="cpf"
                  {...register("cpf", {
                    onChange: (event) => handleCpfLookup(event.target.value),
                  })}
                  placeholder="000.000.000-00"
                />
                {isCpfLoading && (
                  <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-[#134B73]" />
                )}
              </div>
              {errors.cpf && (
                <p className="text-sm text-red-500">{errors.cpf.message}</p>
              )}
              {cpfError && (
                <div className="space-y-2">
                  <p className="text-sm text-red-500">{cpfError}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCpfLookup(watch("cpf") ?? "")}
                    disabled={isCpfLoading}
                  >
                    {isCpfLoading ? "Consultando..." : "Tentar novamente"}
                  </Button>
                </div>
              )}
            </div>

            {digitsOnly(watch("cpf") ?? "").length === 11 && (
              <div className="space-y-2 md:col-span-2">
                <Label>Verificacao na Receita</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={cpfVerified ? "aprovada" : "pendente"}
                    className="shadow-none"
                  >
                    {cpfVerified ? "Verificado" : "Nao verificado"}
                  </StatusBadge>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="birthData">Data de nascimento</Label>
              <Input id="birthData" type="date" {...register("birthData")} />
              {errors.birthData && (
                <p className="text-sm text-red-500">{errors.birthData.message}</p>
              )}
            </div>

                    <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <div className="flex gap-2">
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  placeholder="00000-000"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCepLookup}
                  disabled={isCepLoading}
                >
                  {isCepLoading ? "Buscando..." : "Buscar CEP"}
                </Button>
              </div>
              {errors.zipCode && (
                <p className="text-sm text-red-500">{errors.zipCode.message}</p>
              )}
            </div>

            <Separator className="md:col-span-2" />

            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input id="street" {...register("street")} />
              {errors.street && (
                <p className="text-sm text-red-500">{errors.street.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" {...register("number")} />
              {errors.number && (
                <p className="text-sm text-red-500">{errors.number.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input id="complement" {...register("complement")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" {...register("neighborhood")} />
              {errors.neighborhood && (
                <p className="text-sm text-red-500">
                  {errors.neighborhood.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">UF</Label>
              <Select
                value={watch("state")}
                onValueChange={(value) => setValue("state", value, { shouldValidate: true })}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {brazilStates.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>


            <Separator className="md:col-span-2" />

            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold mb-2">Permissões</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <Controller
                    control={control}
                    name="canView"
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    )}
                  />
                  Ver
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Controller
                    control={control}
                    name="canCreate"
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    )}
                  />
                  Criar
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Controller
                    control={control}
                    name="canUpdate"
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    )}
                  />
                  Atualizar
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Controller
                    control={control}
                    name="canDelete"
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    )}
                  />
                  Excluir
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting || !cpfVerified}>
                {isSubmitting ? "Salvando..." : "Cadastrar gestor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ManagersList dealerId={selectedDealerId ? Number(selectedDealerId) : undefined} />
    </div>
  );
}
