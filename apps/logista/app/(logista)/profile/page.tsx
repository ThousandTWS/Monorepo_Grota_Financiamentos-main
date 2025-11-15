/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { Card, CardContent } from "@/presentation/ui/card";
import { Button } from "@/presentation/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/presentation/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import dealerProfileService, {
  type CompleteDealerProfilePayload,
  type DealerProfileDetailsResponse,
} from "@/application/services/DealerServices/DealerProfileService";
import userServices from "@/application/services/UserServices/UserServices";
import ProfileSummary from "./components/ProfileSummary";
import ProfileForm from "./components/ProfileForm";
import {
  profileSchema,
  onlyDigits,
  type ProfileFormValues,
  type SubmitStatus,
} from "./profileTypes";

const isProfileInformationComplete = (
  details?: DealerProfileDetailsResponse | null,
) => {
  if (!details) return false;
  const basicFields = [
    details.fullNameEnterprise,
    details.birthData,
    details.cnpj,
  ];
  if (
    basicFields.some(
      (field) => !field || String(field).trim().length === 0,
    )
  ) {
    return false;
  }

  const address = details.address;
  if (!address) return false;

  const requiredAddressFields = [
    address.street,
    address.number,
    address.neighborhood,
    address.state,
    address.zipCode,
  ];

  return !requiredAddressFields.some(
    (field) => !field || String(field).trim().length === 0,
  );
};

const defaultValues: ProfileFormValues = {
  fullNameEnterprise: "",
  birthData: "",
  cnpj: "",
  address: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    state: "",
    zipCode: "",
  },
};

const formatDateInput = (value?: string | null) => {
  if (!value) return "";
  return value.split("T")[0] ?? "";
};

const mapDetailsToForm = (
  details?: DealerProfileDetailsResponse,
): ProfileFormValues => ({
  fullNameEnterprise: details?.fullNameEnterprise ?? "",
  birthData: formatDateInput(details?.birthData),
  cnpj: details?.cnpj ?? "",
  address: {
    street: details?.address?.street ?? "",
    number: details?.address?.number ?? "",
    complement: details?.address?.complement ?? "",
    neighborhood: details?.address?.neighborhood ?? "",
    state: details?.address?.state ?? "",
    zipCode: details?.address?.zipCode ?? "",
  },
});

const normalizePayload = (
  values: ProfileFormValues,
): CompleteDealerProfilePayload => ({
  fullNameEnterprise: values.fullNameEnterprise.trim(),
  birthData: values.birthData,
  cnpj: onlyDigits(values.cnpj),
  address: {
    street: values.address.street.trim(),
    number: values.address.number.trim(),
    complement: values.address.complement?.trim(),
    neighborhood: values.address.neighborhood.trim(),
    state: values.address.state.trim().toUpperCase(),
    zipCode: onlyDigits(values.address.zipCode),
  },
});

export default function ProfilePage() {
  const [status, setStatus] = useState<SubmitStatus | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profileDetails, setProfileDetails] =
    useState<DealerProfileDetailsResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dealerId, setDealerId] = useState<number | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });
  const { reset } = form;

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      let currentDealerId = dealerId;
      if (!currentDealerId) {
        const user = await userServices.me();
        currentDealerId = user.id;
        setDealerId(user.id);
      }

      if (!currentDealerId) {
        throw new Error("Usuário não encontrado");
      }

      const details = await dealerProfileService.fetchDetails(
        currentDealerId,
      );

      setProfileDetails(details);
      reset(mapDetailsToForm(details));
      setLoadError(null);

      const isComplete = isProfileInformationComplete(details);
      setIsEditing(!isComplete);
      setCepLookup({ status: "idle", message: null });
    } catch (error) {
      setProfileDetails(null);
      setIsEditing(true);
    } finally {
      setLoadingProfile(false);
    }
  }, [dealerId, reset]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onSubmit = async (values: ProfileFormValues) => {
    setStatus(null);
    try {
      await dealerProfileService.completeProfile(normalizePayload(values));
      await loadProfile();
      setStatus({
        type: "success",
        message: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ??
        "Não foi possível salvar seus dados. Tente novamente.";
      setStatus({ type: "error", message });
    }
  };

  const pageTitle = isEditing ? "Complete seus dados" : "Dados do seu perfil";
  const pageDescription = isEditing
    ? "Essas informações são utilizadas para validar sua operação junto aos bancos parceiros."
    : "Seu perfil já está configurado. Revise os dados abaixo e atualize quando necessário.";
  const formLoadError = profileDetails ? null : loadError;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-500">Perfil</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {pageTitle}
        </h1>
        <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
          <span>{pageDescription}</span>
          {loadingProfile && isEditing && (
            <span className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
              <Loader2 className="size-4 animate-spin" />
              Carregando dados do seu perfil...
            </span>
          )}
        </div>
      </div>

      {loadingProfile && !isEditing ? (
        <Card>
          <CardContent className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Buscando dados do seu perfil...
          </CardContent>
        </Card>
      ) : isEditing ? (
        <ProfileForm
          form={form}
          status={status}
          loadError={formLoadError}
          loadingProfile={loadingProfile}
          onSubmit={onSubmit}
        />
      ) : profileDetails ? (
        <ProfileSummary
          details={profileDetails}
          status={status}
          onEdit={() => {
            setIsEditing(true);
            setStatus(null);
            setLoadError(null);
          }}
        />
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="text-destructive" />
          <AlertTitle>Não foi possível exibir os dados</AlertTitle>
          <AlertDescription className="space-y-3">
            <span>
              {loadError ??
                "Não encontramos informações para o seu perfil neste momento."}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadProfile}
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
function setCepLookup(arg0: { status: string; message: null; }) {
  throw new Error("Function not implemented.");
}
