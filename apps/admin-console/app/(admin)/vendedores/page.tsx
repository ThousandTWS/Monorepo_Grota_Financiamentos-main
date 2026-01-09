"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Select,
  Spin,
  Typography,
} from "antd";
import { createSeller } from "@/application/services/Seller/sellerService";
import { getAllLogistics, Dealer } from "@/application/services/Logista/logisticService";
import { SellersList } from "@/presentation/features/painel-geral/components/SellersList";
import { fetchAddressByCep } from "@/application/services/cep/cepService";
import { StatusBadge } from "@/presentation/features/logista/components/status-badge";
import { formatName } from "@/lib/formatters";
import { convertBRtoISO } from "@/application/core/utils/formatters";
import { maskCEP, maskCPF, maskPhone } from "@/lib/masks";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const sellerSchema = z.object({
  dealerId: z.string().optional(),
  fullName: z.string().min(2, "Informe o nome completo").transform(v => v.trim()),
  email: z.string()
    .optional()
    .or(z.literal(""))
    .transform(v => v ? v.trim().toLowerCase() : v),
  phone: z.string()
    .optional()
    .or(z.literal(""))
    .transform(v => v ? digitsOnly(v) : v),
  password: z
    .string()
    .max(50, "A senha deve ter no máximo 50 caracteres")
    .optional()
    .or(z.literal("")),
  cpf: z.string()
    .optional()
    .or(z.literal(""))
    .transform(v => v ? digitsOnly(v) : ""),
  birthData: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      // Aceita formato AAAA-MM-DD (input type="date")
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return true;
      return false;
    }, {
      message: "Use o formato AAAA-MM-DD",
    }),
  street: z.string().optional().or(z.literal("")).transform(v => v?.trim()),
  number: z.string().optional().or(z.literal("")).transform(v => v?.trim()),
  complement: z.string().optional().transform(v => v?.trim()),
  neighborhood: z.string().optional().or(z.literal("")).transform(v => v?.trim()),
  city: z.string().optional().or(z.literal("")).transform(v => v?.trim()),
  state: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform(v => v ? v.trim().toUpperCase() : v),
  zipCode: z.string()
    .optional()
    .or(z.literal(""))
    .transform(v => v ? digitsOnly(v) : ""),
  canView: z.boolean().default(true),
  canCreate: z.boolean().default(true),
  canUpdate: z.boolean().default(true),
  canDelete: z.boolean().default(true),
});

type SellerFormValues = z.infer<typeof sellerSchema>;

const brazilStates = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default function Vendedores() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VendedoresContent />
    </Suspense>
  );
}

function VendedoresContent() {
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
  } = useForm<SellerFormValues>({
    //@ts-ignore
    resolver: zodResolver(sellerSchema),
    defaultValues: {
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
      dealerId: "",
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

  const onSubmit = async (values: SellerFormValues) => {
    console.log("[vendedores] onSubmit values:", values);
    const cpfDigits = values.cpf ? digitsOnly(values.cpf) : "";
    if (isCpfLoading) {
      toast.error("Aguarde a verificação do CPF ou tente novamente.");
      return;
    }
    
    // Deixamos de exigir o cpfVerified para permitir o cadastro mesmo se a API de consulta falhar
    // O backend validará se o CPF já existe ou se é válido.
    
    setIsSubmitting(true);
    try {
      // Valida e formata a data de nascimento
      let birthDateIso: string | undefined = undefined;
      if (values.birthData) {
        const date = new Date(values.birthData);
        if (isNaN(date.getTime())) {
          toast.error("Data de nascimento inválida.");
          setIsSubmitting(false);
          return;
        }
        birthDateIso = date.toISOString().split("T")[0];
      }
      const dealerId = values.dealerId ? Number(values.dealerId) : undefined;
      
      const payload = {
        dealerId: dealerId || null,
        fullName: values.fullName,
        email: values.email || null,
        phone: values.phone || null,
        password: values.password || null,
        CPF: values.cpf || null,
        birthData: birthDateIso || null,
        address: {
          street: values.street || null,
          number: values.number || null,
          complement: values.complement || null,
          neighborhood: values.neighborhood || null,
          city: values.city || null,
          state: values.state || null,
          zipCode: values.zipCode || null,
        },
        canView: values.canView ?? true,
        canCreate: values.canCreate ?? true,
        canUpdate: values.canUpdate ?? true,
        canDelete: values.canDelete ?? true,
      };
      
      console.log("[vendedores] Enviando payload:", JSON.stringify(payload, null, 2));
      
      await createSeller(payload);

      toast.success("Vendedor cadastrado com sucesso!");
      reset();
      setCpfVerified(false);
      setCpfError(null);
      setLastCpfLookup("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel cadastrar o vendedor.";
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
      console.error("[vendedores] CPF lookup", error);
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
    const rawZip = watch("zipCode") ?? "";
    const cep = digitsOnly(rawZip);
    if (cep.length !== 8) {
      toast.error("Informe um CEP com 8 dígitos.");
      return;
    }
    setIsCepLoading(true);
    try {
      console.log("[vendedores] Buscando CEP:", cep);
      const address = await fetchAddressByCep(cep);
      if (!address) {
        toast.error("CEP não encontrado. Verifique o número e tente novamente.");
        return;
      }
      console.log("[vendedores] Endereço encontrado:", address);
      
      // Pequeno timeout para garantir que os campos existam/renderizem se necessário
      // e forçar a atualização no react-hook-form
      setTimeout(() => {
        // Log para depuração
        console.log("[vendedores] Atualizando campos com:", {
          street: address.street,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state
        });

        setValue("street", address.street ?? "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setValue("neighborhood", address.neighborhood ?? "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setValue("city", address.city ?? "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setValue("state", (address.state ?? "").toUpperCase(), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        
        toast.success("Endereço encontrado e preenchido!");
      }, 0);
    } catch (error) {
      console.error("[vendedores] CEP lookup error:", error);
      toast.error("Erro ao buscar o CEP. Tente preencher manualmente.");
    } finally {
      setIsCepLoading(false);
    }
  };

  const onError = (errors: any) => {
    console.error("[vendedores] Erros de validação detalhados:", errors);
    
    // Nomes amigáveis para os campos
    const fieldNames: Record<string, string> = {
      fullName: "Nome completo",
      email: "E-mail",
      phone: "Telefone",
      password: "Senha",
      cpf: "CPF",
      birthData: "Data de nascimento",
      street: "Rua",
      number: "Número",
      neighborhood: "Bairro",
      city: "Cidade",
      state: "UF",
      zipCode: "CEP",
      dealerId: "Loja"
    };

    // Lista todos os erros para o usuário
    Object.keys(errors).forEach((key) => {
      const error = errors[key];
      if (error?.message) {
        const fieldName = fieldNames[key] || key;
        toast.error(`${fieldName}: ${error.message}`);
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card title="Novo vendedor">
        <Typography.Paragraph className="text-sm text-muted-foreground">
          Crie usuarios que poderao acessar o painel do logista com o e-mail e senha cadastrados.
        </Typography.Paragraph>
        <form
          //@ts-ignore
          onSubmit={handleSubmit(onSubmit, onError)}
          className="grid gap-6 md:grid-cols-2"
        >
          <div className="space-y-2 md:col-span-2">
            <Typography.Text>Loja (opcional)</Typography.Text>
            <Controller
              control={control}
              name="dealerId"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Selecione a loja (opcional)"
                  options={dealers.map((dealer) => ({
                    value: String(dealer.id),
                    label: `${dealer.fullName} - ${dealer.enterprise}`,
                  }))}
                  className="w-full"
                  popupMatchSelectWidth={false}
                  styles={{ popup: { root: { minWidth: 420 } } }}
                />
              )}
            />
            {errors.dealerId && (
              <p className="text-sm text-red-500">{errors.dealerId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Typography.Text>Nome completo</Typography.Text>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>E-mail</Typography.Text>
            <Input 
              id="email" 
              type="email" 
              {...register("email")} 
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>Telefone</Typography.Text>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  {...field}
                  id="phone"
                  placeholder="(11) 99999-0000"
                  onChange={(e) => field.onChange(maskPhone(e.target.value))}
                />
              )}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>Senha (mínimo 6 caracteres)</Typography.Text>
            <Input.Password id="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>CPF</Typography.Text>
            <Controller
              control={control}
              name="cpf"
              render={({ field }) => (
                <Input
                  {...field}
                  id="cpf"
                  placeholder="000.000.000-00"
                  suffix={isCpfLoading ? <Spin size="small" /> : <span style={{ width: 16 }} />}
                  onChange={(e) => {
                    const masked = maskCPF(e.target.value);
                    field.onChange(masked);
                    handleCpfLookup(masked);
                  }}
                />
              )}
            />
            {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
            {cpfError && (
              <div className="space-y-2">
                <p className="text-sm text-red-500">{cpfError}</p>
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleCpfLookup(watch("cpf") ?? "")}
                  disabled={isCpfLoading}
                >
                  {isCpfLoading ? "Consultando..." : "Tentar consulta novamente"}
                </Button>
              </div>
            )}
          </div>

          {digitsOnly(watch("cpf") ?? "").length === 11 && (
            <div className="space-y-2 md:col-span-2">
              <Typography.Text>Verificacao na Receita</Typography.Text>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={cpfVerified ? "aprovada" : "pendente"} className="shadow-none">
                  {cpfVerified ? "Verificado" : "Nao verificado"}
                </StatusBadge>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Typography.Text>Data de nascimento</Typography.Text>
            <Input
              id="birthData"
              type="date"
              {...register("birthData")}
              className="w-full"
            />
            {errors.birthData && (
              <p className="text-sm text-red-500">{errors.birthData.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>CEP</Typography.Text>
            <div className="flex gap-2">
              <Controller
                control={control}
                name="zipCode"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="zipCode"
                    placeholder="00000-000"
                    onChange={(e) => field.onChange(maskCEP(e.target.value))}
                  />
                )}
              />
              <Button
                type="default"
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

          <Divider className="md:col-span-2" />

          <div className="space-y-2">
            <Typography.Text>Rua</Typography.Text>
            <Input id="street" {...register("street")} placeholder="Ex: Av. Paulista" />
            {errors.street && (
              <p className="text-sm text-red-500">{errors.street.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>Numero</Typography.Text>
            <Input id="number" {...register("number")} />
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>Complemento</Typography.Text>
            <Input id="complement" {...register("complement")} />
          </div>
          <div className="space-y-2">
            <Typography.Text>Bairro</Typography.Text>
            <Input id="neighborhood" {...register("neighborhood")} />
            {errors.neighborhood && (
              <p className="text-sm text-red-500">{errors.neighborhood.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>Cidade</Typography.Text>
            <Input id="city" {...register("city")} />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>UF</Typography.Text>
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  options={brazilStates.map((uf) => ({ value: uf, label: uf }))}
                  placeholder="UF"
                  className="w-full"
                />
              )}
            />
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          <Divider className="md:col-span-2" />

          <div className="md:col-span-2">
            <Typography.Text className="text-sm font-semibold">Permissoes</Typography.Text>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <label className="flex items-center gap-2 text-sm">
                <Controller
                  control={control}
                  name="canView"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
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
                      onChange={(e) => field.onChange(e.target.checked)}
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
                      onChange={(e) => field.onChange(e.target.checked)}
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
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                Excluir
              </label>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="primary" htmlType="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Cadastrar vendedor"}
            </Button>
          </div>
        </form>
      </Card>

      <SellersList dealerId={selectedDealerId ? Number(selectedDealerId) : undefined} />
    </div>
  );
}
