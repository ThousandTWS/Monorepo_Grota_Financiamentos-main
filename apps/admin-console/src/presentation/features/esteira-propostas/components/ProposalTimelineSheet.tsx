 "use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/presentation/layout/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/presentation/layout/components/ui/sheet";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import { Separator } from "@/presentation/layout/components/ui/separator";
import { Skeleton } from "@/presentation/layout/components/ui/skeleton";
import { ProposalEvent, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { fetchProposalTimeline } from "@/application/services/Proposals/proposalService";
import { Clock3, History } from "lucide-react";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  dispatchBridgeEvent,
  parseBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { getRealtimeUrl } from "@/application/config/realtime";
import { Textarea } from "@/presentation/layout/components/ui/textarea";
import { Input } from "@/presentation/layout/components/ui/input";
import { Button as UiButton } from "@/presentation/layout/components/ui/button";
// Chat usa o bridge interno (não Ably)

type ProposalTimelineSheetProps = {
  proposalId: number;
};

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  status: "sent" | "received" | "read";
  mine?: boolean;
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

export function ProposalTimelineSheet({ proposalId }: ProposalTimelineSheetProps) {
  const identity = `admin-timeline-${proposalId}`;
  const processedRealtimeIds = useRef<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<ProposalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const { messages, sendMessage, participants } = useRealtimeChannel({
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
    if (!open || messages.length === 0) return;
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

  useEffect(() => {
    if (!open || messages.length === 0) return;
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

    if (parsed?.event === "PROPOSAL_CHAT") {
      const payload = parsed.payload as {
        proposalId?: number;
        text?: string;
        actor?: string;
        actorName?: string;
        timestamp?: string;
        messageId?: string;
      };
      if (payload?.proposalId === proposalId && payload.text) {
        const actorIdentity = payload.actor ?? latest.sender ?? "Desconhecido";
        const displayName = payload.actorName ?? actorIdentity;
        const messageId = payload.messageId ?? latest.id;
        const isMine = actorIdentity === identity;
        const timestamp = payload.timestamp ?? latest.timestamp ?? new Date().toISOString();

        setChatMessages((current) => {
          const existingIndex = current.findIndex((msg) => msg.id === messageId);
          if (existingIndex >= 0) {
            const next = [...current];
            next[existingIndex] = {
              ...next[existingIndex],
              status: isMine ? "sent" : "received",
              timestamp,
              text: payload.text as string,
            };
            return next;
          }
          return [
            ...current,
            {
              id: messageId,
              sender: isMine ? "Você (Admin)" : displayName,
              text: payload.text as string,
              timestamp,
              status: isMine ? "sent" : "received",
              mine: isMine,
            },
          ];
        });

        if (!isMine) {
          dispatchBridgeEvent(sendMessage, "PROPOSAL_CHAT_SEEN", {
            proposalId,
            messageIds: [messageId],
            actor: identity,
          });
        }
      }
    }

    if (parsed?.event === "PROPOSAL_CHAT_SEEN") {
      const payload = parsed.payload as { proposalId?: number; messageIds?: string[] };
      if (payload?.proposalId === proposalId && Array.isArray(payload.messageIds)) {
        setChatMessages((current) =>
          current.map((msg) =>
            payload.messageIds?.includes(msg.id) ? { ...msg, status: "read" } : msg,
          ),
        );
      }
    }
  }, [messages, open, proposalId, loadTimeline, sendMessage, identity]);

  const formatTime = (value: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));

  const handleSendChat = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    const messageId = `admin-${proposalId}-${Date.now()}`;
    const success = dispatchBridgeEvent(sendMessage, "PROPOSAL_CHAT", {
      proposalId,
      text,
      actor: identity,
      actorName: "Admin",
      timestamp: new Date().toISOString(),
      messageId,
    });
    if (success) {
      setChatMessages((current) => [
        ...current,
        {
          id: messageId,
          sender: "Você (Admin)",
          text,
          timestamp: new Date().toISOString(),
          status: "sent",
          mine: true,
        },
      ]);
      setChatInput("");
    }
  }, [chatInput, proposalId, sendMessage, identity]);

  const handleClearChat = useCallback(() => {
    setChatInput("");
    setChatSearch("");
  }, []);

  const filteredChat = useMemo(() => {
    const term = chatSearch.trim().toLowerCase();
    if (!term) return chatMessages;
    return chatMessages.filter(
      (msg) =>
        msg.text.toLowerCase().includes(term) ||
        msg.sender.toLowerCase().includes(term),
    );
  }, [chatMessages, chatSearch]);

  const onlineCount = participants.length;
  const presenceLabel =
    onlineCount > 1 ? "Lojista online" : "Aguardando lojista entrar";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 border-[#0F456A] bg-[#134B73] text-white hover:bg-[#0F456A] hover:text-white"
        >
          <History className="size-4" />
          Histórico
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-5xl">
        <SheetHeader>
          <SheetTitle className="text-[#134B73]">
            Histórico da ficha #{proposalId}
          </SheetTitle>
          <p className="text-sm text-slate-500">
            Linha do tempo e comunicação entre Admin e Lojista.
          </p>
        </SheetHeader>
        <div className="mt-4">
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
            <ScrollArea className="h-[70vh] pr-2">
              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#134B73]">Linha do tempo</p>
                    <span className="text-[11px] uppercase tracking-wide text-slate-500">
                      Auditoria
                    </span>
                  </div>
                  <div className="space-y-3 pl-3 border-l-2 border-[#134B73]/20">
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

                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#134B73]">Chat com o lojista</p>
                      <p className="text-xs text-slate-500">Canal dedicado desta ficha</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                          onlineCount > 1
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                            : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                        }`}
                        title={participants.map((p) => p.sender).join(", ")}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            onlineCount > 1 ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {presenceLabel}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-slate-500">
                        Conversa
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
                    <Input
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      placeholder="Buscar por mensagem ou remetente"
                      className="h-9"
                    />
                    <div className="flex items-center justify-end text-xs text-slate-500">
                      {filteredChat.length} mensagens
                    </div>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {filteredChat.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {chatMessages.length === 0
                          ? "Nenhuma mensagem ainda. Envie a primeira."
                          : "Nenhum resultado para a busca."}
                      </p>
                    ) : (
                      filteredChat.map((msg) => (
                        <div
                          key={msg.id}
                          className={`rounded-md border px-3 py-2 shadow-xs ${
                            msg.mine
                              ? "border-[#134B73]/40 bg-[#134B73]/5"
                              : "border-slate-100 bg-gradient-to-r from-white to-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-semibold text-[#134B73]">{msg.sender}</span>
                            <div className="flex items-center gap-2">
                              <span>{formatTime(msg.timestamp)}</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  msg.status === "read"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : msg.status === "sent"
                                      ? "bg-sky-50 text-sky-700"
                                      : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {msg.status === "read"
                                  ? "Lida"
                                  : msg.status === "sent"
                                    ? "Enviada"
                                    : "Recebida"}
                              </span>
                            </div>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-slate-700">{msg.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Escreva uma mensagem para o lojista..."
                      className="min-h-[90px]"
                    />
                    <div className="flex justify-end gap-2">
                      <UiButton variant="outline" onClick={handleClearChat}>
                        Limpar
                      </UiButton>
                      <UiButton onClick={handleSendChat} disabled={!chatInput.trim()}>
                        Enviar mensagem
                      </UiButton>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
