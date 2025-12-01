"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createSeller } from "@/application/services/Seller/sellerService";
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
import { SellersList } from "@/presentation/features/painel-geral/components/SellersList";
import { Checkbox } from "@/presentation/layout/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/layout/components/ui/select";
import { fetchAddressByCep } from "@/application/services/cep/cepService";

const sellerSchema = z.object({
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

type SellerFormValues = z.infer<typeof sellerSchema>;

const digitsOnly = (value: string) => value.replace(/\D/g, "");
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
    setIsSubmitting(true);
    try {
      const dealerId = values.dealerId ? Number(values.dealerId) : undefined;
      await createSeller({
        dealerId,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: digitsOnly(values.phone),
        password: values.password,
        CPF: digitsOnly(values.cpf),
        birthData: values.birthData,
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

      toast.success("Vendedor cadastrado com sucesso!");
      reset();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o vendedor.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
      console.error("[vendedores] CEP lookup", error);
      toast.error("Não foi possível buscar o CEP.");
    } finally {
      setIsCepLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Novo vendedor</CardTitle>
          <CardDescription>
            Crie usuários que poderão acessar o painel do logista com o e-mail e
            senha cadastrados.
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
                value={watch("dealerId") ?? ""}
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
              <Input id="cpf" {...register("cpf")} placeholder="000.000.000-00" />
              {errors.cpf && (
                <p className="text-sm text-red-500">{errors.cpf.message}</p>
              )}
            </div>
            
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Cadastrar vendedor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <SellersList dealerId={selectedDealerId ? Number(selectedDealerId) : undefined} />
    </div>
  );
}
