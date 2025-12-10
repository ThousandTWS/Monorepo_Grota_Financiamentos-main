"use client";

import { Button } from "@/presentation/layout/components/ui/button";
import { StatusBadge } from "./status-badge";

export type Logista = {
  id: number;
  fullName: string;
  razaoSocial?: string | null;
  cnpj?: string | null;
  referenceCode?: string | null;
  phone: string;
  enterprise: string;
  status?: string;
  createdAt?: string;
};

type LogistaActionsProps = {
  logista: Logista;
  onOpenActions: (logista: Logista) => void;
};

export function LogistaActions({ logista, onOpenActions }: LogistaActionsProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onOpenActions(logista)}
      className="h-8"
      title="Ações do lojista"
    >
      Ações
    </Button>
  );
}

export const getLogistaColumns = (actions: {
  onOpenActions: (logista: Logista) => void;
}) => [
  {
    key: "referenceCode",
    header: "Código Ref.",
    cell: (logista: Logista) => {
      const numberOnly =
        logista.referenceCode?.match(/\d+/g)?.join("") || logista.referenceCode || "--";
      return (
        <div className="font-mono text-sm" data-oid="refCode">
          {numberOnly}
        </div>
      );
    },
  },
  {
    key: "fullName",
    header: "Nome",
    cell: (logista: Logista) => (
      <div className="font-medium" data-oid="prv:wgx">
        {logista.fullName}
      </div>
    ),
  },
  {
    key: "enterprise",
    header: "Empresa",
    cell: (logista: Logista) => (
      <div className="text-muted-foreground" data-oid="c6-jzwr">
        {logista.enterprise}
      </div>
    ),
  },
  {
    key: "razaoSocial",
    header: "Razão Social",
    cell: (logista: Logista) => (
      <div className="text-muted-foreground" data-oid="razao">
        {logista.razaoSocial || "--"}
      </div>
    ),
  },
  {
    key: "cnpj",
    header: "CNPJ",
    cell: (logista: Logista) => (
      <div className="text-muted-foreground" data-oid="cnpj">
        {logista.cnpj || "--"}
      </div>
    ),
  },
  {
    key: "telefone",
    header: "Telefone",
    cell: (logista: Logista) => (
      <div className="text-muted-foreground" data-oid="ao67jhu">
        {logista.phone}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (logista: Logista) => <StatusBadge status={logista.status} />,
  },
  {
    key: "dataRegistro",
    header: "Data de Registro",
    cell: (logista: Logista) => (
      <div className="text-muted-foreground" data-oid=":_wr2bt">
        {logista.createdAt
          ? new Date(logista.createdAt).toLocaleDateString("pt-BR")
          : "--"}
      </div>
    ),
  },
  {
    key: "acoes",
    header: "Ações",
    cell: (logista: Logista) => (
      <LogistaActions logista={logista} onOpenActions={actions.onOpenActions} data-oid="j-ksfjm" />
    ),
  },
];
