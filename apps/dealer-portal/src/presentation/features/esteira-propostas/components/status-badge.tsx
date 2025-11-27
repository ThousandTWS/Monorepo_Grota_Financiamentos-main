"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatusBadgeProps {
  status?: string | null;
  children?: ReactNode;
  className?: string;
}

const statusConfig = {
  enviada: {
    label: "Enviada",
    className:
      "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/40 hover:bg-sky-500/20 dark:hover:bg-sky-500/25",
    dotClassName: "bg-sky-500 shadow-sky-500/50",
  },
  pendente: {
    label: "Pendente",
    className:
      "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/40 hover:bg-amber-500/20 dark:hover:bg-amber-500/25",
    dotClassName: "bg-amber-500 shadow-amber-500/50",
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
};

type StatusKey = keyof typeof statusConfig;

const normalizeStatus = (status?: string | null): StatusKey => {
  const normalized = (status ?? "").toString().trim().toLowerCase();

  if (
    normalized === "enviada" ||
    normalized === "enviado" ||
    normalized === "submitted" ||
    normalized === "submetida" ||
    normalized === "submetido"
  ) {
    return "enviada";
  }

  if (normalized === "aprovada" || normalized === "aprovado" || normalized === "approved") {
    return "aprovada";
  }

  if (normalized === "recusada" || normalized === "recusado" || normalized === "rejected") {
    return "recusada";
  }

  return "pendente";
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);
  const config = statusConfig[normalizedStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md cursor-default",
        config?.className,
        className,
      )}
    >
      <span className={cn("relative flex size-2 rounded-full", config?.dotClassName)}>
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            config?.dotClassName,
          )}
        />
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full shadow-sm",
            config?.dotClassName,
          )}
        />
      </span>
      {children ?? config?.label}
    </span>
  );
}
