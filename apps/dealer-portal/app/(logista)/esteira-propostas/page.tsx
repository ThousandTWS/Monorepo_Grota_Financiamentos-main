import { EsteiraDePropostasFeature } from "@/presentation/features/esteira-propostas";

export default function EsteiraDePropostasPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Esteira de Propostas
        </h1>
        <p className="text-muted-foreground">
          Monitore suas fichas, refine filtros e avance cada etapa exatamente
          como o lojista precisa, com foco na operação do parceiro.
        </p>
      </div>

      <EsteiraDePropostasFeature />
    </div>
  );
}
