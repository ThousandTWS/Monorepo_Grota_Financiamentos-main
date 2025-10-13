"use client";

import { Button } from "@/presentation/layout/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye, } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from
  "@/presentation/layout/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";

export type Logista = {
  id: string;
  fullName: string;
  cpf: string;
  cnpj: string;
  email: string;
  phone: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  comissaoTotal: number;
};

type LogistaActionsProps = {
  logista: Logista;
  onView: (logista: Logista) => void;
  onEdit: (logista: Logista) => void;
  onDelete: (logista: Logista) => void;
};

export function LogistaActions({
  logista,
  onView,
  onEdit,
  onDelete
}: LogistaActionsProps) {
  return (
    <DropdownMenu data-oid="8xat6mv">
      <DropdownMenuTrigger asChild data-oid="puq9q_b">
        <Button variant="ghost" size="icon" data-oid="s30lt:h">
          <MoreHorizontal className="size-4" data-oid="gzs5wj7" />
          <span className="sr-only" data-oid="tmfnits">
            Abrir menu
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-oid="ldr2mjd">
        <DropdownMenuLabel data-oid="7udh9n_">Ações</DropdownMenuLabel>
        <DropdownMenuSeparator data-oid="3s.-cik" />
        <DropdownMenuItem onClick={() => onView(logista)} data-oid="1h.xlk7">
          <Eye className="size-4 mr-2" data-oid="zteg2rm" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(logista)} data-oid="fwa73xh">
          <Pencil className="size-4 mr-2" data-oid="va_.t34" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator data-oid=".7-hwtv" />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(logista)}
          data-oid=":0w01:x">

          <Trash2 className="size-4 mr-2" data-oid="qpsyu28" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>);

}

export const getLogistaColumns = (actions: {
  onView: (logista: Logista) => void;
  onEdit: (logista: Logista) => void;
  onDelete: (logista: Logista) => void;
}) => [
    {
      key: "fullName",
      header: "Nome",
      cell: (logista: Logista) =>
        <div className="font-medium" data-oid="prv:wgx">
          {logista.fullName}
        </div>

    },
    {
      key: "cpf",
      header: "CPF",
      cell: (logista: Logista) =>
        <div className="text-muted-foreground" data-oid="c6-jzwr">
          {logista.cpf}
        </div>

    },
    {
      key: "cnpj",
      header: "CNPJ",
      cell: (logista: Logista) =>
        <div className="text-muted-foreground" data-oid="c6-jzwr">
          {logista.cnpj}
        </div>
    },
    {
      key: "email",
      header: "E-mail",
      cell: (logista: Logista) =>
        <div className="text-muted-foreground" data-oid="fh9f-xk">
          {logista.email}
        </div>

    },
    {
      key: "telefone",
      header: "Telefone",
      cell: (logista: Logista) =>
        <div className="text-muted-foreground" data-oid="ao67jhu">
          {logista.phone}
        </div>

    },
    {
      key: "status",
      header: "Status",
      cell: (logista: Logista) => {
        return (
         <StatusBadge status={logista.status} />
          );

      }
    },
    {
      key: "comissaoTotal",
      header: "Comissão Total",
      cell: (logista: Logista) =>
        <div className="font-medium" data-oid="7u2oi42">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
          }).format(logista.comissaoTotal)}
        </div>

    },
    {
      key: "dataRegistro",
      header: "Data de Registro",
      cell: (logista: Logista) =>
        <div className="text-muted-foreground" data-oid=":_wr2bt">
          {new Date(logista.createdAt).toLocaleDateString("pt-BR")}
        </div>

    },
    {
      key: "acoes",
      header: "Ações",
      cell: (logista: Logista) =>
        <LogistaActions
          logista={logista}
          onView={actions.onView}
          onEdit={actions.onEdit}
          onDelete={actions.onDelete}
          data-oid="j-ksfjm" />


    }];