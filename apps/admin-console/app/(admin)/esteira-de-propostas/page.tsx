import EsteiraDePropostasFeature from "@/presentation/features/esteira-propostas";
import React from "react";

export default function EsteiraDePropostasPage() {
  return (
    <div
      className=" bg-[#0F456A] px-4 py-6 animate-in fade-in duration-500"
      data-oid="w9w2t9k"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="space-y-2 text-white" data-oid="orsc6pt">
          <p className="text-xs uppercase tracking-wide text-white/70">Operações Grota</p>
          <h1 className="text-3xl font-bold tracking-tight" data-oid="0z0t7ee">
            Esteira de Propostas
          </h1>
          <p className="text-white/80" data-oid="9btpc_9">
            Acompanhe suas fichas, atualize filtros e avance cada etapa do processo de crédito.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/95 p-4 shadow-2xl backdrop-blur text-slate-900">
          <EsteiraDePropostasFeature data-oid="v9ya2na" />
        </div>
      </div>
    </div>
  );
}
