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

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const sellerSchema = z.object({
  dealerId: z.string().optional(),
  fullName: z.string().min(2, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().refine((val) => digitsOnly(val).length >= 10, {
    message: "Informe um telefone válido (mínimo 10 dígitos)",
  }),
  password: z
    .string()
    .min(6, "A senha precisa ter no mínimo 6 caracteres")
    .max(8, "A senha deve ter no máximo 8 caracteres"),
  cpf: z.string().refine((val) => digitsOnly(val).length === 11, {
    message: "Informe um CPF válido (11 dígitos)",
  }),
  birthData: z
    .string()
    .min(1, "Informe a data de nascimento")
    .refine((val) => {
      if (!val) return false;
      // Aceita formato AAAA-MM-DD (input type="date")
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return true;
      return false;
    }, {
      message: "Use o formato AAAA-MM-DD",
    }),
  street: z.string().min(3, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z
    .string()
    .min(2, "UF inválida")
    .max(2, "UF inválida"),
  zipCode: z.string().refine((val) => digitsOnly(val).length === 8, {
    message: "Informe um CEP válido (8 dígitos)",
  }),
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
      // Valida e formata a data de nascimento
      let birthDateIso: string;
      if (values.birthData) {
        const date = new Date(values.birthData);
        if (isNaN(date.getTime())) {
          toast.error("Data de nascimento inválida.");
          setIsSubmitting(false);
          return;
        }
        birthDateIso = date.toISOString().split("T")[0];
      } else {
        toast.error("Data de nascimento é obrigatória.");
        setIsSubmitting(false);
        return;
      }
      const dealerId = values.dealerId ? Number(values.dealerId) : undefined;
      
      // Validações finais antes de enviar
      const phoneDigits = digitsOnly(values.phone);
      const cpfDigits = digitsOnly(values.cpf);
      const zipCodeDigits = digitsOnly(values.zipCode);
      
      if (phoneDigits.length < 10) {
        toast.error("Telefone deve ter no mínimo 10 dígitos.");
        setIsSubmitting(false);
        return;
      }
      
      if (cpfDigits.length !== 11) {
        toast.error("CPF deve ter exatamente 11 dígitos.");
        setIsSubmitting(false);
        return;
      }
      
      if (zipCodeDigits.length !== 8) {
        toast.error("CEP deve ter exatamente 8 dígitos.");
        setIsSubmitting(false);
        return;
      }
      
      const payload = {
        dealerId: dealerId || null,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: phoneDigits,
        password: values.password,
        CPF: cpfDigits,
        birthData: birthDateIso,
        address: {
          street: values.street.trim(),
          number: values.number.trim(),
          complement: values.complement?.trim() || undefined,
          neighborhood: values.neighborhood.trim(),
          city: values.city.trim(),
          state: values.state.trim().toUpperCase(),
          zipCode: zipCodeDigits,
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
    const cep = digitsOnly(watch("zipCode") ?? "");
    if (cep.length !== 8) {
      toast.error("Informe um CEP com 8 dígitos.");
      return;
    }
    setIsCepLoading(true);
    try {
      const address = await fetchAddressByCep(cep);
      if (!address) {
        toast.error("CEP não encontrado. Verifique o número e tente novamente.");
        return;
      }
      setValue("street", address.street ?? "");
      setValue("neighborhood", address.neighborhood ?? "");
      setValue("city", address.city ?? "");
      setValue("state", (address.state ?? "").toUpperCase());
      toast.success("Endereço encontrado e preenchido automaticamente!");
    } catch (error) {
      console.error("[vendedores] CEP lookup", error);
      toast.error("Não foi possível buscar o CEP. Tente novamente mais tarde.");
    } finally {
      setIsCepLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card title="Novo vendedor">
        <Typography.Paragraph className="text-sm text-muted-foreground">
          Crie usuarios que poderao acessar o painel do logista com o e-mail e senha cadastrados.
        </Typography.Paragraph>
        <form
          //@ts-ignore
          onSubmit={handleSubmit(onSubmit)}
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
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>Telefone</Typography.Text>
            <Input id="phone" {...register("phone")} placeholder="(11) 99999-0000" />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>Senha (6 a 8 caracteres)</Typography.Text>
            <Input.Password id="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography.Text>CPF</Typography.Text>
            <Input
              id="cpf"
              {...register("cpf", {
                onChange: (event) => handleCpfLookup(event.target.value),
              })}
              placeholder="000.000.000-00"
              suffix={isCpfLoading ? <Spin size="small" /> : <span style={{ width: 16 }} />}
            />
            {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
            {cpfError && (
              <div className="space-y-2">
                <p className="text-sm text-red-500">{cpfError}</p>
                <Button
                  type="default"
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
              <Input id="zipCode" {...register("zipCode")} placeholder="00000-000" />
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
            <Input id="street" {...register("street")} />
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
            <Button type="primary" htmlType="submit" disabled={isSubmitting || !cpfVerified}>
              {isSubmitting ? "Salvando..." : "Cadastrar vendedor"}
            </Button>
          </div>
        </form>
      </Card>

      <SellersList dealerId={selectedDealerId ? Number(selectedDealerId) : undefined} />
    </div>
  );
}
