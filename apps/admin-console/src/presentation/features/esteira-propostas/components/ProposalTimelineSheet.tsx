"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/presentation/layout/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/layout/components/ui/dialog";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import { Separator } from "@/presentation/layout/components/ui/separator";
import { Skeleton } from "@/presentation/layout/components/ui/skeleton";
import { Proposal, ProposalEvent, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { fetchProposalTimeline } from "@/application/services/Proposals/proposalService";
import { Clock3, History } from "lucide-react";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  parseBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { getRealtimeUrl } from "@/application/config/realtime";

type ProposalTimelineSheetProps = {
  proposalId: number;
  proposal?: Proposal;
  dealerName?: string;
  sellerName?: string;
};

const statusLabel: Record<ProposalStatus, string> = {
  SUBMITTED: "Enviada",
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Recusada",
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const formatCurrency = (value: number | null | undefined) =>
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

export function ProposalTimelineSheet({ proposalId, proposal, dealerName, sellerName }: ProposalTimelineSheetProps) {
  const identity = `admin-timeline-${proposalId}`;
  const processedRealtimeIds = useRef<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<ProposalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { messages } = useRealtimeChannel({
    channel: REALTIME_CHANNELS.PROPOSALS,
    identity,
    url: getRealtimeUrl(),
  });

  const loadTimeline = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const timeline = await fetchProposalTimeline(proposalId);
      setEvents(timeline);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar o histórico.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    if (!open) return;
    void loadTimeline();
  }, [loadTimeline, open]);

  useEffect(() => {
    if (messages.length === 0) return;
    const latest = messages[messages.length - 1];
    if (processedRealtimeIds.current.has(latest.id)) return;
    processedRealtimeIds.current.add(latest.id);
    const parsed = parseBridgeEvent(latest);

    if (parsed?.event === REALTIME_EVENT_TYPES.PROPOSAL_EVENT_APPENDED) {
      const payload = parsed.payload as { proposalId?: number };
      if (payload?.proposalId === proposalId) {
        void loadTimeline();
      }
    }
  }, [messages, open, proposalId, loadTimeline, identity]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 border-[#0F456A] bg-[#134B73] text-white hover:bg-[#0F456A] hover:text-white"
        >
          <History className="size-4" />
          Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-[#134B73]">
            Histórico da ficha #{proposalId}
          </DialogTitle>
          <p className="text-sm text-slate-500">
            Linha do tempo detalhada desta ficha.
          </p>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {proposal ? (
            <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#134B73]">
                Dados informados pelo lojista
              </p>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Cliente</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {proposal.customerName}
                  </p>
                  <p className="text-xs text-slate-500">{maskCpf(proposal.customerCpf)}</p>
                  <p className="text-xs text-slate-500">{proposal.customerPhone}</p>
                  <p className="text-xs text-slate-500">{proposal.customerEmail}</p>
                </div>
                <div className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Lojista / Empresa</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {dealerName ?? (proposal.dealerId ? `Lojista #${proposal.dealerId}` : "Não informado")}
                  </p>
                  <p className="text-xs text-slate-500">
                    Sócio/Responsável: {sellerName ?? (proposal.sellerId ? `Responsável #${proposal.sellerId}` : "Responsável não informado")}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Valores</p>
                  <p className="text-sm font-semibold text-[#0F9F6E]">
                    Financiado: {formatCurrency(proposal.financedValue)}
                  </p>
                  <p className="text-xs text-slate-500">FIPE: {formatCurrency(proposal.fipeValue)}</p>
                  <p className="text-xs text-slate-500">Entrada: {formatCurrency(proposal.downPaymentValue)}</p>
                  <p className="text-xs text-slate-500">
                    Parcelas: {proposal.termMonths ?? "—"}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Veículo</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {proposal.vehicleBrand} {proposal.vehicleModel}
                  </p>
                  <p className="text-xs text-slate-500">
                    Ano: {proposal.vehicleYear ?? "—"} • Placa: {proposal.vehiclePlate}
                  </p>
                  <p className="text-xs text-slate-500">FIPE código: {proposal.fipeCode}</p>
                </div>
                <div className="rounded-md bg-slate-50 px-3 py-2 sm:col-span-2 md:col-span-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Endereço</p>
                  <p className="text-sm text-slate-700">
                    {proposal.address ?? "—"}, {proposal.addressNumber ?? "—"} {proposal.addressComplement ?? ""}
                  </p>
                  <p className="text-xs text-slate-500">
                    {proposal.neighborhood ?? "—"} • {proposal.city ?? "—"} / {proposal.uf ?? "—"} • CEP: {proposal.cep ?? "—"}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 px-3 py-2 sm:col-span-2 md:col-span-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Renda e notas</p>
                  <p className="text-sm text-slate-700">
                    Renda: {proposal.income ? formatCurrency(proposal.income) : "—"} • Outras rendas: {proposal.otherIncomes ? formatCurrency(proposal.otherIncomes) : "—"}
                  </p>
                  {proposal.notes ? (
                    <p className="text-xs text-slate-500 mt-1">Observações: {proposal.notes}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum evento registrado para esta ficha.
            </p>
          ) : (
            <ScrollArea className="h-[65vh] pr-2">
              <div className="mx-auto max-w-4xl space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#134B73]">Linha do tempo</p>
                  <span className="text-[11px] uppercase tracking-wide text-slate-500">
                    Auditoria
                  </span>
                </div>
                <div className="space-y-3 border-l-2 border-[#134B73]/20 pl-3">
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <span className="absolute -left-[9px] top-4 h-3 w-3 rounded-full border-2 border-white bg-[#134B73]" />
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-full border border-slate-200 bg-slate-50 p-2 text-[#134B73] shadow-xs">
                          <Clock3 className="size-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
                            <span>{formatDateTime(event.createdAt)}</span>
                            {event.actor ? (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                {event.actor}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm font-semibold text-[#134B73] leading-snug">
                            {event.type === "STATUS_UPDATED"
                              ? `Status: ${event.statusFrom ? statusLabel[event.statusFrom] ?? event.statusFrom : "—"} → ${event.statusTo ? statusLabel[event.statusTo] ?? event.statusTo : "—"}`
                              : event.type === "CREATED"
                                ? "Ficha criada"
                                : event.type}
                          </p>
                          {event.note ? (
                            <p className="text-sm text-slate-600 leading-relaxed">{event.note}</p>
                          ) : null}
                        </div>
                      </div>
                      {index < events.length - 1 ? <Separator className="mt-3" /> : null}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
