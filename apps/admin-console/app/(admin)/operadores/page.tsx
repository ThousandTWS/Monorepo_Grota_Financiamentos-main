"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createSeller,
  getAllSellers,
  type Seller,
} from "@/application/services/Seller/sellerService";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/layout/components/ui/table";
import { Separator } from "@/presentation/layout/components/ui/separator";

const sellerSchema = z.object({
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
  state: z
    .string()
    .min(2, "UF inválida")
    .max(2, "UF inválida"),
  zipCode: z.string().min(8, "Informe o CEP"),
});

type SellerFormValues = z.infer<typeof sellerSchema>;

const digitsOnly = (value: string) => value.replace(/\D/g, "");

export default function Operadores() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SellerFormValues>({
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
      state: "SP",
      zipCode: "",
    },
  });

  const loadSellers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllSellers();
      setSellers(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao carregar vendedores.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSellers();
  }, [loadSellers]);

  const onSubmit = async (values: SellerFormValues) => {
    setIsSubmitting(true);
    try {
      await createSeller({
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
          state: values.state.trim().toUpperCase(),
          zipCode: digitsOnly(values.zipCode),
        },
      });

      toast.success("Vendedor cadastrado com sucesso!");
      reset();
      await loadSellers();
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
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 md:grid-cols-2"
          >
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
              <Label htmlFor="state">UF</Label>
              <Input
                id="state"
                {...register("state")}
                placeholder="SP"
                maxLength={2}
              />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" {...register("zipCode")} placeholder="00000-000" />
              {errors.zipCode && (
                <p className="text-sm text-red-500">{errors.zipCode.message}</p>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Cadastrar vendedor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendedores cadastrados</CardTitle>
          <CardDescription>
            Utilize o e-mail e a senha definidos acima para acessar o painel do logista.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando vendedores...</p>
          ) : sellers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum vendedor cadastrado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell>{seller.fullName ?? "--"}</TableCell>
                    <TableCell>{seller.email ?? "--"}</TableCell>
                    <TableCell>{seller.phone ?? "--"}</TableCell>
                    <TableCell className="capitalize">
                      {seller.status?.toLowerCase() ?? "pendente"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
