import { EsteiraDePropostasFeature } from "@/presentation/features/esteira-propostas";

export default function EsteiraDePropostasPage() {
  return (
    <div className="min-h-screen bg-[#0F456A] px-4 py-6 animate-in fade-in duration-500">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="space-y-2 text-white">
          <p className="text-xs uppercase tracking-wide text-white/70">Operações Grota</p>
          <h1 className="text-3xl font-bold tracking-tight">
            Esteira de Propostas
          </h1>
          <p className="text-white/80">
            Monitore suas fichas, refine filtros e avance cada etapa do processo de crédito.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/95 p-4 shadow-2xl backdrop-blur text-slate-900">
          <EsteiraDePropostasFeature />
        </div>
      </div>
    </div>
  );
}
