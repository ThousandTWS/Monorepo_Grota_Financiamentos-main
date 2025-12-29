"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, User, Car, Building2, Mic, Square, Send } from "lucide-react";
import { Proposal, ProposalEvent, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { fetchProposalTimeline, fetchProposals } from "@/application/services/Proposals/proposalService";
import { Badge, Button, Card, Divider, Input, Skeleton, Tag, Typography } from "antd";
import { REALTIME_CHANNELS, useRealtimeChannel } from "@grota/realtime-client";
import { getRealtimeUrl } from "@/application/config/realtime";

type Params = Promise<{
  proposalId: string;
}>;

const { Paragraph, Text, Title } = Typography;
const cardBodyStyle = { background: "rgba(255,255,255,0.08)", color: "#fff" };
const cardStyle = { background: "transparent", borderColor: "rgba(255,255,255,0.1)" };

const statusLabel: Record<ProposalStatus, string> = {
  SUBMITTED: "Enviada",
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Recusada",
  PAID: "Paga",
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
    : "--";

const maskCpf = (cpf?: string) => {
  if (!cpf) return "--";
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
      else reject(new Error("Erro ao ler audio"));
    };
    reader.onerror = () => reject(new Error("Erro ao converter audio"));
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

  const dealerLabel = useMemo(() => {
    if (!proposal?.dealerId) return "Lojista nao informado";
    return proposal.dealerId ? `Lojista #${proposal.dealerId}` : "Lojista nao informado";
  }, [proposal]);

  const chatIdentity = useMemo(
    () => (isValidId ? `admin-ficha-${proposalId}` : "admin-ficha"),
    [isValidId, proposalId],
  );

  const { messages, sendMessage, status: chatStatus, participants } = useRealtimeChannel({
    channel: REALTIME_CHANNELS.CHAT,
    identity: chatIdentity,
    url: getRealtimeUrl(),
    metadata: { proposalId },
    historyLimit: 100,
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
    isSelf: boolean;
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
      <div className="flex w-[260px] flex-col rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow ${
              isPlaying ? "play-pulse" : ""
            }`}
            aria-label={isPlaying ? "Pausar audio" : "Reproduzir audio"}
          >
            {isPlaying ? (
              <Square className="size-4" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px] fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex flex-1 flex-col gap-1">
            <div className="relative h-[3px] overflow-hidden rounded-full bg-white/20">
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
        fromName: "Admin",
      });
      if (!ok) {
        setChatError("Nao foi possivel enviar. Verifique a conexao.");
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
      const ok = sendMessage("audio", {
        proposalId,
        fromName: "Admin",
        audio: true,
        mimeType: blob.type,
        durationMs,
        dataUrl,
      });
      if (!ok) {
        setChatError("Nao foi possivel enviar o audio.");
      }
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Erro ao enviar audio.");
    }
  }, [proposalId, sendMessage]);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
      return;
    }
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setChatError("Audio nao suportado neste dispositivo.");
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
        setChatError("Erro na gravacao de audio.");
        setIsRecording(false);
      };
      recorder.onstop = () => {
        handleAudioStop();
      };
      recorder.start();
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Permissao de audio negada.");
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

  useEffect(() => {
    if (!isValidId) return;
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [events, proposals] = await Promise.all([
          fetchProposalTimeline(proposalId),
          fetchProposals(),
        ]);
        if (!mounted) return;
        setTimeline(events);
        const found = proposals.find((p) => p.id === proposalId) ?? null;
        setProposal(found);
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error ? err.message : "Nao foi possivel carregar o historico.",
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

  const chatStatusLabel =
    chatStatus === "connected"
      ? "Conectado"
      : chatStatus === "connecting"
        ? "Conectando..."
        : "Offline";

  const chatStatusBadge =
    chatStatus === "connected"
      ? "success"
      : chatStatus === "connecting"
        ? "processing"
        : "error";

  return (
    <>
      <main className="min-h-screen bg-[#0F456A] px-4 py-6 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/esteira-de-propostas">
                <Button
                  size="small"
                  className="border border-white/40 bg-white text-[#0F456A] shadow-sm hover:bg-white/90 hover:text-[#0F456A]"
                >
                  <ArrowLeft className="size-4" />
                  Voltar
                </Button>
              </Link>
              <div>
                <Text className="text-xs uppercase tracking-wide !text-white/70">
                  Ficha #{isValidId ? proposalId : "--"}
                </Text>
                <Title level={2} className="!m-0 text-2xl font-semibold !text-white">
                  Historico e dados da ficha
                </Title>
                <Paragraph className="!m-0 text-sm !text-white/80">
                  Visao completa dos dados preenchidos e auditoria da ficha.
                </Paragraph>
              </div>
            </div>
          </div>

          {proposal ? (
            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="rounded-xl shadow-sm" styles={{ body: cardBodyStyle }} style={cardStyle}>
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-white/80">
                  <User className="size-4" /> Cliente & Contato
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <Text className="text-[11px] uppercase tracking-wide !text-white/70">Cliente</Text>
                    <Text className="block text-sm font-semibold !text-white">{proposal.customerName}</Text>
                    <Text className="block text-xs !text-white/70">{maskCpf(proposal.customerCpf)}</Text>
                    <Text className="block text-xs !text-white/70">{proposal.customerPhone}</Text>
                    <Text className="block text-xs !text-white/70">{proposal.customerEmail}</Text>
                  </div>
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <Text className="text-[11px] uppercase tracking-wide !text-white/70">Lojista / Empresa</Text>
                    <Text className="block text-sm font-semibold !text-white">{dealerLabel}</Text>
                    <Text className="block text-xs !text-white/70">
                      Responsavel: {proposal.sellerId ? `Responsavel #${proposal.sellerId}` : "Nao informado"}
                    </Text>
                  </div>
                </div>
              </Card>

              <Card className="rounded-xl shadow-sm" styles={{ body: cardBodyStyle }} style={cardStyle}>
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-white/80">
                  <Car className="size-4" /> Veiculo & Valores
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <Text className="text-[11px] uppercase tracking-wide !text-white/70">Veiculo</Text>
                    <Text className="block text-sm font-semibold !text-white">
                      {proposal.vehicleBrand} {proposal.vehicleModel}
                    </Text>
                    <Text className="block text-xs !text-white/70">
                      Ano: {proposal.vehicleYear ?? "--"} | Placa: {proposal.vehiclePlate}
                    </Text>
                    <Text className="block text-xs !text-white/70">FIPE codigo: {proposal.fipeCode}</Text>
                  </div>
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <Text className="text-[11px] uppercase tracking-wide !text-white/70">Valores</Text>
                    <Text className="block text-sm font-semibold !text-white">
                      Financiado: {formatCurrency(proposal.financedValue)}
                    </Text>
                    <Text className="block text-xs !text-white/70">FIPE: {formatCurrency(proposal.fipeValue)}</Text>
                    <Text className="block text-xs !text-white/70">Parcelas: {proposal.termMonths ?? "--"}</Text>
                  </div>
                </div>
              </Card>

              <Card className="rounded-xl shadow-sm lg:col-span-2" styles={{ body: cardBodyStyle }} style={cardStyle}>
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-white/80">
                  <Building2 className="size-4" /> Endereco & Renda
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white lg:col-span-2">
                    <Text className="text-[11px] uppercase tracking-wide !text-white/70">Endereco</Text>
                    <Text className="block text-sm !text-white">
                      {proposal.address ?? "--"}, {proposal.addressNumber ?? "--"} {proposal.addressComplement ?? ""}
                    </Text>
                    <Text className="block text-xs !text-white/70">
                      {proposal.neighborhood ?? "--"} | {proposal.city ?? "--"} / {proposal.uf ?? "--"} | CEP: {proposal.cep ?? "--"}
                    </Text>
                  </div>
                  <div className="rounded-lg bg-white/15 px-4 py-3 text-white">
                    <Text className="text-[11px] uppercase tracking-wide !text-white/70">Renda e notas</Text>
                    <Text className="block text-sm !text-white">
                      Renda: {proposal.income ? formatCurrency(proposal.income) : "--"}
                    </Text>
                    <Text className="block text-xs !text-white/70">
                      Outras rendas: {proposal.otherIncomes ? formatCurrency(proposal.otherIncomes) : "--"}
                    </Text>
                    {proposal.notes ? (
                      <Text className="mt-1 block text-xs !text-white/70">Observacoes: {proposal.notes}</Text>
                    ) : null}
                  </div>
                </div>
              </Card>
            </section>
          ) : null}

          <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-xl shadow-sm text-white" styles={{ body: cardBodyStyle }} style={cardStyle}>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-xs uppercase tracking-wide !text-white/70">Linha do tempo</Text>
                  <Text className="block text-lg font-semibold !text-white">Auditoria</Text>
                </div>
                <Text className="text-[11px] uppercase tracking-wide !text-white/70">
                  Atualizacoes da ficha
                </Text>
              </div>

              {isLoading ? (
                <div className="mt-3 space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              ) : error ? (
                <Paragraph className="mt-3 text-sm text-destructive">{error}</Paragraph>
              ) : timeline.length === 0 ? (
                <Paragraph className="mt-3 text-sm !text-white/80">
                  Nenhum evento registrado para esta ficha.
                </Paragraph>
              ) : (
                <div className="mt-3 max-h-[420px] space-y-3 overflow-y-auto pr-1 scrollbar-hide">
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
                            {event.actor ? <Tag>{event.actor}</Tag> : null}
                          </div>
                          <Text className="block text-sm font-semibold !text-white leading-snug">
                            {event.type === "STATUS_UPDATED"
                              ? `Status: ${event.statusFrom ? statusLabel[event.statusFrom] ?? event.statusFrom : "--"} -> ${event.statusTo ? statusLabel[event.statusTo] ?? event.statusTo : "--"}`
                              : event.type === "CREATED"
                                ? "Ficha criada"
                                : event.type}
                          </Text>
                          {event.note ? (
                            <Text className="block text-sm !text-white/80 leading-relaxed">{event.note}</Text>
                          ) : null}
                        </div>
                      </div>
                      {index < timeline.length - 1 ? <Divider className="mt-3" /> : null}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="rounded-xl shadow-sm text-white" styles={{ body: cardBodyStyle }} style={cardStyle}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <Text className="text-xs uppercase tracking-wide !text-white/70">Chat</Text>
                  <Text className="block text-lg font-semibold !text-white">Admin e Lojista</Text>
                  <Paragraph className="!m-0 text-xs !text-white/70">
                    Canal dedicado desta ficha para comunicacao em tempo real.
                  </Paragraph>
                </div>
              </div>
              <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/70">
                <Badge status={chatStatusBadge} text={chatStatusLabel} />
                <Text className="text-[11px] uppercase tracking-wide !text-white/70">
                  {participants.length} conectado(s)
                </Text>
              </div>

              <div className="flex h-[480px] flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-inner">
                <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
                  {sortedMessages.length === 0 ? (
                    <div className="flex h-48 items-center justify-center text-center text-sm text-white/70">
                      Nenhuma mensagem ainda. Envie a primeira atualizacao desta ficha.
                    </div>
                  ) : (
                    sortedMessages.map((msg) => {
                      const isSelf = msg.sender === chatIdentity;
                      const author =
                        (msg.meta?.fromName as string | undefined) ??
                        (isSelf ? "Voce" : msg.sender);
                      return (
                        <div
                          key={msg.id}
                          className={`flex w-full ${isSelf ? "justify-end" : "justify-start"}`}
                        >
                          <Card
                            className={`max-w-[78%] ${isSelf ? "bg-white/15" : "bg-white/10"}`}
                            styles={{ body: { padding: 12 } }}
                            style={{ borderColor: "rgba(255,255,255,0.15)", background: isSelf ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)" }}
                          >
                            <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-white/70">
                              <Text className="!text-white/80">{author}</Text>
                              <Text className="!text-white/60">{formatTime(msg.timestamp)}</Text>
                            </div>
                            {msg.meta?.audio ? (
                              <AudioBubble
                                id={msg.id}
                                isSelf={isSelf}
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
                              <Text className="block whitespace-pre-line break-words leading-relaxed !text-white">
                                {msg.body}
                              </Text>
                            )}
                          </Card>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-3 py-2"
                >
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    className={`h-10 w-10 rounded-full text-white hover:bg-white/20 ${
                      isRecording ? "animate-pulse" : ""
                    }`}
                    onClick={toggleRecording}
                    icon={isRecording ? <Square className="size-5" /> : <Mic className="size-5" />}
                  />
                  <div className="relative flex-1">
                    <Input.TextArea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={isRecording ? "Gravando..." : "Digite uma mensagem"}
                      className="w-full"
                      variant="borderless"
                      styles={{
                        textarea: {
                          background: "rgba(255,255,255,0.15)",
                          color: "#fff",
                          borderRadius: 12,
                          padding: "8px 12px",
                        },
                      }}
                      disabled={chatStatus === "connecting" || isRecording}
                      autoSize={{ minRows: 1, maxRows: 3 }}
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
                    htmlType="submit"
                    shape="circle"
                    size="small"
                    className="h-10 w-10 rounded-full border border-white/40 bg-white/20 text-white shadow-sm hover:bg-white/30"
                    disabled={(!chatInput.trim() && !isRecording) || chatStatus === "connecting"}
                    icon={<Send className="size-4" />}
                  />
                </form>
                <div className="text-[11px] text-white/70">
                  {isRecording
                    ? `Gravando audio${recordingSeconds ? ` (${recordingSeconds}s)` : ""}`
                    : chatError ?? ""}
                </div>
              </div>
            </Card>
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
      `}</style>
    </>
  );
}
