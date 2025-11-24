"use client";

import { cn } from "@/lib/utils";
import { Logista } from "./columns";

interface StatusBadgeProps {
  status: Logista["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    ativo: {
      label: "Ativo",
      className:
      "bg-green-500/10 text-green-700 border-green-500/30 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/40 hover:bg-green-500/20 dark:hover:bg-green-500/25",
      dotClassName: "bg-green-500 shadow-green-500/50"
    },
    inativo: {
      label: "Inativo",
      className:
      "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/40 hover:bg-red-500/20 dark:hover:bg-red-500/25",
      dotClassName: "bg-red-500 shadow-red-500/50"
    },
    pendente: {
      label: "Pendente",
      className:
      "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/40 hover:bg-yellow-500/20 dark:hover:bg-yellow-500/25",
      dotClassName: "bg-yellow-500 shadow-yellow-500/50"
    }
  };

  const normalizedStatus = status.toLowerCase() as keyof typeof statusConfig;
  const config = statusConfig[normalizedStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md cursor-default",
        config?.className
      )}
      data-oid="jlxffql">

      <span
        className={cn("relative flex size-2 rounded-full", config?.dotClassName)}
        data-oid="dtuiar2">

        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            config?.dotClassName
          )}
          data-oid="zrxzuad" />


        <span
          className={cn(
            "relative inline-flex size-2 rounded-full shadow-sm",
            config?.dotClassName
          )}
          data-oid="toov2_7" />

      </span>
      {config?.label}
    </span>
    );

}