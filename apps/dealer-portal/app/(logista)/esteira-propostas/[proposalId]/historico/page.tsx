/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, User, Car, Building2, Mic, Square, Send } from "lucide-react";
import { Proposal, ProposalEvent, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { fetchProposalTimeline, fetchProposals } from "@/application/services/Proposals/proposalService";
import { Button } from "@/presentation/ui/button";
import { Separator } from "@/presentation/ui/separator";
import { Skeleton } from "@/presentation/ui/skeleton";
import { Input } from "@/presentation/ui/input";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  parseBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { getRealtimeUrl } from "@/application/config/realtime";
import { fetchAllSellers } from "@/application/services/Sellers/sellerService";

type Params = Promise<{
  proposalId: string;
}>;

type DealerDetails = {
  fullNameEnterprise?: string;
  enterprise?: string;
  fullName?: string;
  name?: string;
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

const formatTime = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "";

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Erro ao ler áudio"));
    };
    reader.onerror = () => reject(new Error("Erro ao converter áudio"));
    reader.readAsDataURL(blob);
  });

const formatSeconds = (valueSeconds?: number) => {
  if (!valueSeconds || Number.isNaN(valueSeconds)) return "0:00";
  const minutes = Math.floor(valueSeconds / 60);
  const seconds = Math.floor(valueSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function ProposalHistoryPage({ params }: { params: Params }) {
  const resolvedParams = use(params);
  const proposalId = Number(resolvedParams.proposalId);
  const isValidId = Number.isFinite(proposalId);

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [timeline, setTimeline] = useState<ProposalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sellerIndex, setSellerIndex] = useState<Record<number, string>>({});
  const [dealerName, setDealerName] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingStartRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const playingAudioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const processedTimelineIds = useRef<Set<string>>(new Set());

  const dealerLabel = useMemo(() => {
    if (dealerName) return dealerName;
    if (!proposal?.dealerId) return "Lojista nao informado";
    return `Lojista #${proposal.dealerId}`;
  }, [dealerName, proposal]);

  const chatIdentity = useMemo(
    () => (isValidId ? `logista-ficha-${proposalId}` : "logista-ficha"),
    [isValidId, proposalId],
  );
  const timelineIdentity = useMemo(
    () => (isValidId ? `logista-timeline-${proposalId}` : "logista-timeline"),
    [isValidId, proposalId],
  );

  const {
    messages,
    sendMessage,
    status: chatStatus,
    participants,
  } = useRealtimeChannel({
    channel: REALTIME_CHANNELS.CHAT,
    identity: chatIdentity,
    url: getRealtimeUrl(),
    metadata: { proposalId },
    historyLimit: 100,
  });
  const { messages: timelineMessages } = useRealtimeChannel({
    channel: REALTIME_CHANNELS.PROPOSALS,
    identity: timelineIdentity,
    url: getRealtimeUrl(),
  });

  const filteredMessages = useMemo(
    () =>
      messages.filter(
        (msg) =>
          msg?.meta?.proposalId === proposalId ||
          msg?.meta?.proposalId === String(proposalId),
      ),
    [messages, proposalId],
  );

  const sortedMessages = useMemo(
    () =>
      [...filteredMessages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    [filteredMessages],
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedMessages]);

  type AudioBubbleProps = {
    id: string;
    src: string;
    durationMs?: number;
    timestamp?: string;
    isActive: boolean;
    formatSeconds: (v?: number) => string;
    formatTime: (v?: string) => string;
    onPlayRequest: (id: string, audio: HTMLAudioElement, start: () => void) => void;
    onStop: (id: string, audio: HTMLAudioElement) => void;
  };

  const AudioBubble = ({
    id,
    src,
    durationMs,
    timestamp,
    isActive,
    formatSeconds,
    formatTime,
    onPlayRequest,
    onStop,
  }: AudioBubbleProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState<number>(durationMs ? durationMs / 1000 : 0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioRef.current = audio;

      const handleTime = () => {
        setProgress(audio.currentTime);
        if (!Number.isNaN(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
      };
      const handleLoaded = () => {
        if (!Number.isNaN(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        onStop(id, audio);
      };
      audio.addEventListener("timeupdate", handleTime);
      audio.addEventListener("loadedmetadata", handleLoaded);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleEnded);

      return () => {
        audio.pause();
        audio.src = "";
        audio.removeEventListener("timeupdate", handleTime);
        audio.removeEventListener("loadedmetadata", handleLoaded);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("error", handleEnded);
      };
    }, [id, src, onStop]);

    useEffect(() => {
      if (!isActive && isPlaying && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
      }
    }, [isActive, isPlaying]);

    const togglePlay = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        onStop(id, audio);
      } else {
        onPlayRequest(id, audio, () => {
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        });
      }
    };

    const progressPct =
      duration && duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

    return (
      <div className="w-[260px] flex flex-col rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow ${isPlaying ? "play-pulse" : ""}`}
            aria-label={isPlaying ? "Pausar áudio" : "Reproduzir áudio"}
          >
            {isPlaying ? (
              <Square className="size-4" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current translate-x-[1px]">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex flex-1 flex-col gap-1">
            <div className="relative h-[3px] rounded-full bg-white/20 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white/80 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-white/70">
              <span>{formatSeconds(duration)}</span>
              <span>{formatTime(timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSend = useCallback(
    (evt?: React.FormEvent) => {
      evt?.preventDefault();
      const content = chatInput.trim();
      if (!content || !isValidId) return;
      const ok = sendMessage(content, {
        proposalId,
        fromName: "Lojista",
      });
      if (!ok) {
        setChatError("Não foi possível enviar. Verifique a conexão.");
      } else {
        setChatError(null);
        setChatInput("");
      }
    },
    [chatInput, isValidId, proposalId, sendMessage],
  );

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    try {
      recorder.stop();
    } catch (_err) {
      // ignore stop errors
    }
  }, []);

  const handleAudioStop = useCallback(async () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    const durationMs =
      recordingStartRef.current !== null
        ? Date.now() - recordingStartRef.current
        : 0;
    recordingStartRef.current = null;
    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    audioChunksRef.current = [];
    if (!blob.size) return;
    try {
      const dataUrl = await blobToDataUrl(blob);
      const ok = sendMessage("Áudio", {
        proposalId,
        fromName: "Lojista",
        audio: true,
        mimeType: blob.type,
        durationMs,
        dataUrl,
      });
      if (!ok) {
        setChatError("Não foi possível enviar o áudio.");
      }
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Erro ao enviar áudio.");
    }
  }, [proposalId, sendMessage]);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
      return;
    }
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setChatError("Áudio não suportado neste dispositivo.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recordingStartRef.current = Date.now();
      setRecordingSeconds(0);
      setIsRecording(true);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      recorder.ondataavailable = (event) => {
        if (event.data?.size) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.onerror = () => {
        setChatError("Erro na gravação de áudio.");
        setIsRecording(false);
      };
      recorder.onstop = () => {
        handleAudioStop();
      };
      recorder.start();
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Permissão de áudio negada.");
      setIsRecording(false);
    }
  }, [handleAudioStop, isRecording, stopRecording]);

  useEffect(() => {
    if (chatError && chatStatus === "connected") {
      setChatError(null);
    }
  }, [chatError, chatStatus]);

  const handlePlayRequest = useCallback(
    (id: string, audio: HTMLAudioElement, startPlayback: () => void) => {
      if (playingAudioRef.current && playingAudioRef.current !== audio) {
        try {
          playingAudioRef.current.pause();
          playingAudioRef.current.currentTime = 0;
        } catch (_err) {
          // ignore
        }
      }
      playingAudioRef.current = audio;
      setPlayingId(id);
      startPlayback();
    },
    [],
  );

  const handleAudioStopPlayback = useCallback(
    (id: string, audio: HTMLAudioElement) => {
      if (playingAudioRef.current === audio) {
        playingAudioRef.current = null;
        setPlayingId((current) => (current === id ? null : current));
      }
    },
    [],
  );

  const refreshTimeline = useCallback(async () => {
    if (!isValidId) return;
    try {
      setError(null);
      const events = await fetchProposalTimeline(proposalId);
      setTimeline(events);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nao foi possivel carregar o historico.",
      );
    }
  }, [isValidId, proposalId]);

  useEffect(() => {
    if (chatError && chatStatus === "connected") {
      setChatError(null);
    }
  }, [chatError, chatStatus]);

  useEffect(() => {
    if (!isValidId || timelineMessages.length === 0) return;
    const latest = timelineMessages[timelineMessages.length - 1];
    if (processedTimelineIds.current.has(latest.id)) return;
    processedTimelineIds.current.add(latest.id);
    const parsed = parseBridgeEvent(latest);
    if (
      parsed?.event !== REALTIME_EVENT_TYPES.PROPOSAL_EVENT_APPENDED &&
      parsed?.event !== REALTIME_EVENT_TYPES.PROPOSALS_REFRESH_REQUEST
    ) {
      return;
    }
    const payload = parsed.payload as { proposalId?: number | string } | null;
    if (Number(payload?.proposalId) === proposalId) {
      void refreshTimeline();
    }
  }, [isValidId, proposalId, refreshTimeline, timelineMessages]);

  useEffect(() => {
    if (!isValidId) return;
    let mounted = true;
    const fetchDealerDetails = async (): Promise<DealerDetails | null> => {
      const response = await fetch("/api/dealers/details", { cache: "no-store" });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          (payload as { error?: string })?.error ??
          "Nao foi possivel carregar os dados do lojista.";
        throw new Error(message);
      }
      return (payload ?? null) as DealerDetails | null;
    };
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [events, proposals, sellers, dealerDetails] = await Promise.all([
          fetchProposalTimeline(proposalId),
          fetchProposals(),
          fetchAllSellers(),
          fetchDealerDetails().catch(() => null),
        ]);
        if (!mounted) return;
        setTimeline(events);
        const found = proposals.find((p) => p.id === proposalId) ?? null;
        setProposal(found);
        setSellerIndex(
          sellers.reduce<Record<number, string>>((acc, seller) => {
            if (typeof seller.id === "number") {
              acc[seller.id] =
                seller.fullName ?? seller.name ?? `Responsavel #${seller.id}`;
            }
            return acc;
          }, {}),
        );
        if (dealerDetails) {
          const displayName =
            dealerDetails.fullNameEnterprise ??
            dealerDetails.enterprise ??
            dealerDetails.fullName ??
            dealerDetails.name ??
            "";
          setDealerName(displayName);
        }
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error ? err.message : "Não foi possível carregar o histórico.",
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [isValidId, proposalId]);

  return (
    <>
      <main className="min-h-screen bg-[#0F456A] px-4 py-6 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="bg-white text-[#0F456A] border border-white/40 hover:bg-white/90 hover:text-[#0F456A] shadow-sm"
              >
                <Link href="/esteira-propostas">
                  <ArrowLeft className="size-4" />
                  Voltar
                </Link>
              </Button>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">
                  Ficha #{isValidId ? proposalId : "—"}
                </p>
                <h1 className="text-2xl font-semibold text-white">
                  Histórico e dados da ficha
                </h1>
                <p className="text-sm text-white/80">
                  Visão completa dos dados preenchidos e auditoria da ficha.
                </p>
              </div>
            </div>
          </div>

          {proposal ? (
            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-xl border border-white/10 bg-white/10 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-white/80">
                  <User className="size-4" /> Cliente & Contato
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Cliente</p>
                    <p className="text-sm font-semibold">{proposal.customerName}</p>
                    <p className="text-xs text-white/70">{maskCpf(proposal.customerCpf)}</p>
                    <p className="text-xs text-white/70">{proposal.customerPhone}</p>
                    <p className="text-xs text-white/70">{proposal.customerEmail}</p>
                  </div>
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Lojista / Empresa</p>
                    <p className="text-sm font-semibold">{dealerLabel}</p>
                    <p className="text-xs text-white/70">
                      Responsável:{" "}
                      {proposal.sellerId
                        ? sellerIndex[proposal.sellerId] ?? `Responsável #${proposal.sellerId}`
                        : "Não informado"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-white/80">
                  <Car className="size-4" /> Veículo & Valores
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Veículo</p>
                    <p className="text-sm font-semibold">
                      {proposal.vehicleBrand} {proposal.vehicleModel}
                    </p>
                    <p className="text-xs text-white/70">
                      Ano: {proposal.vehicleYear ?? "—"} • Placa: {proposal.vehiclePlate}
                    </p>
                    <p className="text-xs text-white/70">FIPE código: {proposal.fipeCode}</p>
                  </div>
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Valores</p>
                    <p className="text-sm font-semibold text-emerald-200">
                      Financiado: {formatCurrency(proposal.financedValue)}
                    </p>
                    <p className="text-xs text-white/70">FIPE: {formatCurrency(proposal.fipeValue)}</p>
                    <p className="text-xs text-white/70">Entrada: {formatCurrency(proposal.downPaymentValue)}</p>
                    <p className="text-xs text-white/70">Parcelas: {proposal.termMonths ?? "—"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 p-4 shadow-sm lg:col-span-2">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-white/80">
                  <Building2 className="size-4" /> Endereço & Renda
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="lg:col-span-2 rounded-lg bg-white/15 px-4 py-3 text-white">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Endereço</p>
                    <p className="text-sm">
                      {proposal.address ?? "—"}, {proposal.addressNumber ?? "—"} {proposal.addressComplement ?? ""}
                    </p>
                    <p className="text-xs text-white/70">
                      {proposal.neighborhood ?? "—"} • {proposal.city ?? "—"} / {proposal.uf ?? "—"} • CEP: {proposal.cep ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Renda e notas</p>
                    <p className="text-sm">
                      Renda: {proposal.income ? formatCurrency(proposal.income) : "—"}
                    </p>
                    <p className="text-xs text-white/70">
                      Outras rendas: {proposal.otherIncomes ? formatCurrency(proposal.otherIncomes) : "—"}
                    </p>
                    {proposal.notes ? (
                      <p className="mt-1 text-xs text-white/70">Observações: {proposal.notes}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 shadow-sm text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/70">Linha do tempo</p>
                  <p className="text-lg font-semibold text-white">Auditoria</p>
                </div>
                <span className="text-[11px] uppercase tracking-wide text-white/70">
                  Atualizações da ficha
                </span>
              </div>

              {isLoading ? (
                <div className="mt-3 space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              ) : error ? (
                <p className="mt-3 text-sm text-destructive">{error}</p>
              ) : timeline.length === 0 ? (
                <p className="mt-3 text-sm text-white/80">
                  Nenhum evento registrado para esta ficha.
                </p>
              ) : (
                <div className="mt-3 space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-hide pb-3 pt-2 bg-white/5 rounded-lg">
                  {timeline.map((event, index) => (
                    <div
                      key={event.id}
                      className="relative overflow-hidden rounded-lg border border-white/10 bg-white/10 p-3 shadow-sm"
                    >
                      <span className="absolute -left-[9px] top-4 h-3 w-3 rounded-full border-2 border-[#0F456A] bg-white" />
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-full border border-white/20 bg-white/10 p-2 text-white shadow-xs">
                          <Clock3 className="size-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-white/70">
                            <span>{formatDateTime(event.createdAt)}</span>
                            {event.actor ? (
                              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                                {event.actor}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm font-semibold text-white leading-snug">
                            {event.type === "STATUS_UPDATED"
                              ? `Status: ${event.statusFrom ? statusLabel[event.statusFrom] ?? event.statusFrom : "—"} → ${event.statusTo ? statusLabel[event.statusTo] ?? event.statusTo : "—"}`
                              : event.type === "CREATED"
                                ? "Ficha criada"
                                : event.type}
                          </p>
                          {event.note ? (
                            <p className="text-sm text-white/80 leading-relaxed">{event.note}</p>
                          ) : null}
                        </div>
                      </div>
                      {index < timeline.length - 1 ? <Separator className="mt-3" /> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/10 p-4 shadow-sm text-white">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/70">Chat</p>
                  <p className="text-lg font-semibold text-white">Admin ↔ Lojista</p>
                  <p className="text-xs text-white/70">
                    Canal dedicado desta ficha para comunicação em tempo real.
                  </p>
                </div>
              </div>
              <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/70">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[11px]">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      chatStatus === "connected"
                        ? "bg-emerald-300"
                        : chatStatus === "connecting"
                          ? "bg-amber-300"
                          : "bg-rose-300"
                    }`}
                  />
                  {chatStatus === "connected"
                    ? "Conectado"
                    : chatStatus === "connecting"
                      ? "Conectando..."
                      : "Offline"}
                </span>
                <span>{participants.length} conectado(s)</span>
              </div>

              <div className="flex h-[480px] flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-inner">
                <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
                  {sortedMessages.length === 0 ? (
                    <div className="flex h-48 items-center justify-center text-center text-sm text-white/70">
                      Nenhuma mensagem ainda. Envie a primeira atualização desta ficha.
                    </div>
                  ) : (
                    sortedMessages.map((msg) => {
                      const isSelf = msg.sender === chatIdentity;
                      const author =
                        (msg.meta?.fromName as string | undefined) ??
                        (isSelf ? "Você" : msg.sender);
                      return (
                        <div
                          key={msg.id}
                          className={`flex w-full ${isSelf ? "justify-end" : "justify-start"}`}
                        >
                          <div className="relative max-w-[78%] rounded-3xl border border-white/10 bg-white/12 px-4 py-2 text-sm text-white shadow-sm backdrop-blur">
                            <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-white/70">
                              <span className="text-white/80">{author}</span>
                              <span className="text-white/60">{formatTime(msg.timestamp)}</span>
                            </div>
                            {msg.meta?.audio ? (
                              <AudioBubble
                                id={msg.id}
                                src={(msg.meta?.dataUrl as string | undefined) ?? ""}
                                durationMs={
                                  typeof msg.meta?.durationMs === "number"
                                    ? (msg.meta.durationMs as number)
                                    : undefined
                                }
                                timestamp={msg.timestamp}
                                formatSeconds={formatSeconds}
                                formatTime={formatTime}
                                onPlayRequest={handlePlayRequest}
                                onStop={handleAudioStopPlayback}
                                isActive={playingId === msg.id}
                              />
                            ) : (
                              <p className="whitespace-pre-line break-words leading-relaxed text-white">
                                {msg.body}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2"
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={`h-10 w-10 rounded-full text-white hover:bg-white/20 ${isRecording ? "animate-pulse" : ""}`}
                    onClick={toggleRecording}
                  >
                    {isRecording ? <Square className="size-5" /> : <Mic className="size-5" />}
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={isRecording ? "Gravando..." : "Digite uma mensagem"}
                      className="h-10 w-full border-0 bg-transparent pr-16 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={chatStatus === "connecting" || isRecording}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          handleSend();
                          e.preventDefault();
                        }
                      }}
                    />
                    {isRecording ? (
                      <div className="pointer-events-none absolute right-3 top-1/2 flex h-4 -translate-y-1/2 items-end gap-[3px]">
                        {[0, 1, 2, 3, 4].map((idx) => (
                          <span
                            key={idx}
                            className="wave-bar h-4 w-[3px] rounded-full bg-rose-300"
                            style={{ animationDelay: `${idx * 0.12}s` }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-10 w-10 rounded-full border border-white/40 bg-white/20 text-white shadow-sm hover:bg-white/30"
                    disabled={(!chatInput.trim() && !isRecording) || chatStatus === "connecting"}
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
                <div className="text-[11px] text-white/70">
                  {isRecording
                    ? `Gravando áudio${recordingSeconds ? ` (${recordingSeconds}s)` : ""}`
                    : chatError ?? ""}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <style jsx global>{`
        @keyframes chat-wave {
          0% {
            transform: scaleY(0.6);
            opacity: 0.6;
          }
          50% {
            transform: scaleY(1.2);
            opacity: 1;
          }
          100% {
            transform: scaleY(0.6);
            opacity: 0.6;
          }
        }
        .wave-bar {
          animation: chat-wave 1s ease-in-out infinite;
        }
        @keyframes chat-play-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.35);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        .play-pulse {
          animation: chat-play-pulse 1.4s ease-out infinite;
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
