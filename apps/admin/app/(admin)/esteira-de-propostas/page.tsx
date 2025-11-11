import EsteiraDePropostasFeature from "@/presentation/features/esteira-propostas";
import React from "react";

export default function EsteiraDePropostasPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500" data-oid="w9w2t9k">
      <div className="space-y-2" data-oid="orsc6pt">
        <h1 className="text-3xl font-bold tracking-tight" data-oid="0z0t7ee">
          Esteira de Propostas
        </h1>
        <p className="text-muted-foreground" data-oid="9btpc_9">
          Acompanhe suas fichas, atualize filtros e avance cada etapa do processo de crédito.
        </p>
      </div>

      <EsteiraDePropostasFeature data-oid="v9ya2na" />
    </div>
  );
}
