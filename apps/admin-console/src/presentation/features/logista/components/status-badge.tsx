"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Logista } from "./columns";

interface StatusBadgeProps {
  status?: Logista["status"] | string | null;
  children?: ReactNode;
  className?: string;
}

const statusConfig = {
  ativo: {
    label: "Ativo",
    className:
      "bg-green-500/10 text-green-700 border-green-500/30 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/40 hover:bg-green-500/20 dark:hover:bg-green-500/25",
    dotClassName: "bg-green-500 shadow-green-500/50",
  },
  inativo: {
    label: "Inativo",
    className:
      "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/40 hover:bg-red-500/20 dark:hover:bg-red-500/25",
    dotClassName: "bg-red-500 shadow-red-500/50",
  },
  pendente: {
    label: "Pendente",
    className:
      "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/40 hover:bg-yellow-500/20 dark:hover:bg-yellow-500/25",
    dotClassName: "bg-yellow-500 shadow-yellow-500/50",
  },
<<<<<<< HEAD
  enviada: {
    label: "Enviada",
    className:
      "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/40 hover:bg-sky-500/20 dark:hover:bg-sky-500/25",
    dotClassName: "bg-sky-500 shadow-sky-500/50",
  },
  aprovada: {
    label: "Aprovada",
    className:
      "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/25",
    dotClassName: "bg-emerald-500 shadow-emerald-500/50",
  },
  recusada: {
    label: "Recusada",
    className:
      "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/40 hover:bg-red-500/20 dark:hover:bg-red-500/25",
    dotClassName: "bg-red-500 shadow-red-500/50",
  },
=======
>>>>>>> 4aa090e (fix)
};

type StatusKey = keyof typeof statusConfig;

const normalizeStatus = (status?: string | null): StatusKey => {
  const normalized = (status ?? "").toString().trim().toLowerCase();

  if (normalized === "ativo" || normalized === "active") return "ativo";
  if (normalized === "inativo" || normalized === "inactive") return "inativo";
  if (normalized === "pendente" || normalized === "pending") return "pendente";
<<<<<<< HEAD
  if (
    normalized === "enviada" ||
    normalized === "enviado" ||
    normalized === "submitted" ||
    normalized === "submetida" ||
    normalized === "submetido"
  ) {
    return "enviada";
  }
  if (
    normalized === "aprovada" ||
    normalized === "aprovado" ||
    normalized === "approved"
  ) {
    return "aprovada";
  }
  if (
    normalized === "recusada" ||
    normalized === "recusado" ||
    normalized === "rejected"
  ) {
    return "recusada";
  }
=======
>>>>>>> 4aa090e (fix)

  return "pendente";
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);
  const config = statusConfig[normalizedStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md cursor-default",
        config?.className,
        className
      )}
      data-oid="jlxffql"
    >
      <span
        className={cn("relative flex size-2 rounded-full", config?.dotClassName)}
        data-oid="dtuiar2"
      >
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            config?.dotClassName
          )}
          data-oid="zrxzuad"
        />

        <span
          className={cn(
            "relative inline-flex size-2 rounded-full shadow-sm",
            config?.dotClassName
          )}
          data-oid="toov2_7"
        />
      </span>
      {children ?? config?.label}
    </span>
  );
}
