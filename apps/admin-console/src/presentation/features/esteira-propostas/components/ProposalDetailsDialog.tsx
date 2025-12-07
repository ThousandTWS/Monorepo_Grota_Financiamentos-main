"use client";

import { Proposal } from "@/application/core/@types/Proposals/Proposal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/layout/components/ui/dialog";
import { Button } from "@/presentation/layout/components/ui/button";

type ProposalDetailsDialogProps = {
  proposal: Proposal;
  dealerName?: string | null;
  sellerName?: string | null;
};

const formatCurrency = (value?: number | null) =>
  typeof value === "number"
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(value)
    : "—";

const maskCpf = (cpf?: string) => {
  if (!cpf) return "—";
  const digits = cpf.replace(/\D/g, "").padStart(11, "0").slice(-11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export function ProposalDetailsDialog({
  proposal,
  dealerName,
  sellerName,
}: ProposalDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 border-[#0F456A] text-[#134B73] hover:bg-[#e9f0f5]"
        >
          Ver dados da ficha
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#134B73]">
            Dados da ficha #{proposal.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Cliente</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">{proposal.customerName}</p>
                <p className="text-xs text-slate-500">{maskCpf(proposal.customerCpf)}</p>
              </div>
              <div className="text-sm text-slate-700">
                <p>Email: {proposal.customerEmail}</p>
                <p>Telefone: {proposal.customerPhone}</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Lojista</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {dealerName ?? (proposal.dealerId ? `Lojista #${proposal.dealerId}` : "Não informado")}
                </p>
              </div>
              <div className="text-sm text-slate-700">
                <p>Responsável: {sellerName ?? (proposal.sellerId ? `Responsável #${proposal.sellerId}` : "Não informado")}</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Veículo</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="text-sm text-slate-700">
                <p>{proposal.vehicleBrand} {proposal.vehicleModel}</p>
                <p>Ano: {proposal.vehicleYear ?? "—"}</p>
                <p>Placa: {proposal.vehiclePlate}</p>
              </div>
              <div className="text-sm text-slate-700">
                <p>FIPE: {formatCurrency(proposal.fipeValue)}</p>
                <p>Entrada: {formatCurrency(proposal.downPaymentValue)}</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Financiamento</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="text-sm text-slate-700">
                <p>Valor financiado: {formatCurrency(proposal.financedValue)}</p>
                <p>Parcelas: {proposal.termMonths ?? "—"}</p>
              </div>
              <div className="text-sm text-slate-700">
                <p>Status: {proposal.status}</p>
                <p>Atualizado em: {new Intl.DateTimeFormat("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(proposal.updatedAt))}</p>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
