"use client";

import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import { Input } from "@/presentation/ui/input";
import { Button } from "@/presentation/ui/button";
import { Label } from "@/presentation/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/presentation/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import viaCepService from "@/application/services/External/viaCepService";
import {
  type CepLookupState,
  type ProfileFormValues,
  type SubmitStatus,
  onlyDigits,
} from "../profileTypes";

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
};

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues>;
  status: SubmitStatus | null;
  loadError: string | null;
  loadingProfile: boolean;
  onSubmit: (values: ProfileFormValues) => void | Promise<void>;
}

const ProfileForm = ({
  form,
  status,
  loadError,
  loadingProfile,
  onSubmit,
}: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const [cepLookup, setCepLookup] = useState<CepLookupState>({
    status: "idle",
    message: null,
  });

  const zipCodeValue = watch("address.zipCode");
  const formDisabled = loadingProfile || isSubmitting;

  useEffect(() => {
    const cepDigits = onlyDigits(zipCodeValue ?? "");

    if (cepDigits.length !== 8) {
      setCepLookup({ status: "idle", message: null });
      return;
    }

    let canceled = false;

    setCepLookup({
      status: "loading",
      message: "Consultando CEP no ViaCEP...",
    });

    const timeout = setTimeout(async () => {
      try {
        const address = await viaCepService.lookup(cepDigits);
        if (canceled) return;

        setCepLookup({
          status: "success",
          message: "Endereço preenchido automaticamente via ViaCEP.",
        });

        if (address.street) {
          setValue("address.street", address.street, {
            shouldDirty: true,
          });
        }

        if (address.complement) {
          setValue("address.complement", address.complement, {
            shouldDirty: true,
          });
        }

        if (address.neighborhood) {
          setValue("address.neighborhood", address.neighborhood, {
            shouldDirty: true,
          });
        }

        if (address.state) {
          setValue("address.state", address.state.toUpperCase(), {
            shouldDirty: true,
          });
        }
      } catch (error) {
        if (canceled) return;

        const message =
          error instanceof Error ? error.message : "CEP não encontrado.";
        setCepLookup({ status: "error", message });
      }
    }, 500);

    return () => {
      canceled = true;
      clearTimeout(timeout);
    };
  }, [zipCodeValue, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader className="border-b border-gray-100 dark:border-gray-800">
          <div>
            <CardTitle>Dados do lojista</CardTitle>
            <CardDescription>
              Preencha os campos abaixo com as mesmas informações utilizadas
              no contrato social.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {status && (
            <Alert variant={status.type === "error" ? "destructive" : "default"}>
              {status.type === "error" ? (
                <AlertCircle className="text-destructive" />
              ) : (
                <CheckCircle2 className="text-emerald-500" />
              )}
              <AlertTitle>
                {status.type === "error" ? "Falha ao atualizar" : "Tudo certo!"}
              </AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          {loadError && (
            <Alert variant="destructive">
              <AlertCircle className="text-destructive" />
              <AlertTitle>Não foi possível carregar</AlertTitle>
              <AlertDescription>{loadError}</AlertDescription>
            </Alert>
          )}

          <section className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Informações gerais
              </h2>
              <p className="text-sm text-muted-foreground">
                Dados do empreendimento e documento do responsável legal.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullNameEnterprise">Nome da empresa</Label>
                <Input
                  id="fullNameEnterprise"
                  placeholder="Ex: Doin Motors LTDA"
                  {...register("fullNameEnterprise")}
                  disabled={formDisabled}
                />
                <FieldError message={errors.fullNameEnterprise?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthData">Data de fundação</Label>
                <Input
                  id="birthData"
                  type="date"
                  {...register("birthData")}
                  disabled={formDisabled}
                />
                <FieldError message={errors.birthData?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  {...register("cnpj")}
                  disabled={formDisabled}
                />
                <FieldError message={errors.cnpj?.message} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Endereço comercial
              </h2>
              <p className="text-sm text-muted-foreground">
                Utilize o endereço principal da loja ou matriz.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Rua / Avenida</Label>
                <Input
                  id="street"
                  placeholder="Rua das Lojas"
                  {...register("address.street")}
                  disabled={formDisabled}
                />
                <FieldError message={errors.address?.street?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  placeholder="201"
                  {...register("address.number")}
                  disabled={formDisabled}
                />
                <FieldError message={errors.address?.number?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  placeholder="Loja, bloco, sala..."
                  {...register("address.complement")}
                  disabled={formDisabled}
                />
                <FieldError message={errors.address?.complement?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  placeholder="Vila das Lojas"
                  {...register("address.neighborhood")}
                  disabled={formDisabled}
                />
                <FieldError message={errors.address?.neighborhood?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado (UF)</Label>
                <Input
                  id="state"
                  placeholder="SP"
                  maxLength={2}
                  {...register("address.state")}
                  disabled={formDisabled}
                />
                <FieldError message={errors.address?.state?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  placeholder="05665-060"
                  {...register("address.zipCode")}
                  disabled={formDisabled}
                />
                <FieldError message={errors.address?.zipCode?.message} />
                {cepLookup.message && (
                  <p
                    className={`text-sm flex items-center gap-2 ${
                      cepLookup.status === "error"
                        ? "text-destructive"
                        : "text-brand-600 dark:text-brand-400"
                    }`}
                  >
                    {cepLookup.status === "loading" && (
                      <Loader2 className="size-3 animate-spin" />
                    )}
                    {cepLookup.message}
                  </p>
                )}
              </div>
            </div>
          </section>
        </CardContent>

        <CardFooter className="border-t border-gray-100 dark:border-gray-800">
          <Button type="submit" disabled={formDisabled}>
            {formDisabled ? (
              <>
                <Loader2 className="animate-spin" />
                {loadingProfile ? "Carregando..." : "Salvando..."}
              </>
            ) : (
              "Salvar informações"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProfileForm;
