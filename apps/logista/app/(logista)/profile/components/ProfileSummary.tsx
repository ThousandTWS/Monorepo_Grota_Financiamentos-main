"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import { Button } from "@/presentation/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/presentation/ui/alert";
import { CheckCircle2 } from "lucide-react";
import type { SubmitStatus } from "../profileTypes";
import type { DealerProfileDetailsResponse } from "@/application/services/DealerServices/DealerProfileService";

const infoOrPlaceholder = (value?: string | null) =>
  value && value.trim().length > 0 ? value : "--";

const formatCnpj = (cnpj?: string | null) => {
  const digits = (cnpj ?? "").replace(/\D/g, "");
  if (digits.length !== 14) return infoOrPlaceholder(cnpj);
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

const formatZipCode = (zip?: string | null) => {
  const digits = (zip ?? "").replace(/\D/g, "");
  if (digits.length !== 8) return infoOrPlaceholder(zip);
  return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
};

const formatDateDisplay = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
};

const buildStreetLine = (
  address?: DealerProfileDetailsResponse["address"],
) => {
  if (!address) return "--";
  const parts = [
    address.street?.trim(),
    address.number?.trim() ? `Nº ${address.number}` : null,
    address.complement?.trim(),
  ].filter(Boolean) as string[];

  return parts.length ? parts.join(", ") : "--";
};

const ProfileSummary = ({
  details,
  status,
  onEdit,
}: {
  details: DealerProfileDetailsResponse;
  status: SubmitStatus | null;
  onEdit: () => void;
}) => {
  const address = details.address;

  const generalRows = [
    {
      label: "Nome da empresa",
      value: infoOrPlaceholder(details.fullNameEnterprise),
    },
    { label: "CNPJ", value: formatCnpj(details.cnpj) },
    {
      label: "Data de fundação",
      value: formatDateDisplay(details.birthData),
    },
    { label: "E-mail de contato", value: infoOrPlaceholder(details.email) },
    { label: "Telefone", value: infoOrPlaceholder(details.phone) },
  ];

  const addressRows = [
    { label: "Logradouro", value: buildStreetLine(address) },
    { label: "Bairro", value: infoOrPlaceholder(address?.neighborhood) },
    { label: "Estado", value: infoOrPlaceholder(address?.state) },
    { label: "CEP", value: formatZipCode(address?.zipCode) },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle>Dados do lojista</CardTitle>
          <CardDescription>
            Seu perfil está completo. Revise e atualize quando for necessário.
          </CardDescription>
        </div>
        <Button type="button" variant="outline" onClick={onEdit}>
          Atualizar informações
        </Button>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {status?.type === "success" && (
          <Alert>
            <CheckCircle2 className="text-emerald-500" />
            <AlertTitle>Perfil atualizado</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <SummarySection
          title="Informações gerais"
          description="Dados do responsável e do empreendimento."
          rows={generalRows}
        />

        <SummarySection
          title="Endereço comercial"
          description="Localização principal da loja ou matriz."
          rows={addressRows}
        />
      </CardContent>
    </Card>
  );
};

const SummarySection = ({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: { label: string; value: string }[];
}) => (
  <section className="space-y-4">
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>

    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={`border-t border-gray-100 dark:border-gray-800 ${
                index % 2 === 0
                  ? "bg-white dark:bg-gray-900"
                  : "bg-gray-50/70 dark:bg-gray-900/70"
              }`}
            >
              <td className="w-1/3 px-5 py-4 font-medium text-gray-500 dark:text-gray-400">
                {row.label}
              </td>
              <td className="px-5 py-4 text-base font-semibold text-gray-900 dark:text-white">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default ProfileSummary;
