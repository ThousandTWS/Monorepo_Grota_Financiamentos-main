"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Send, SignalHigh, WifiOff } from "lucide-react";

import { useRealtimeChannel } from "@grota/realtime-client";

import { cn } from "@/lib/utils";
import { Badge } from "@/presentation/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import { Input } from "@/presentation/ui/input";
import { Button } from "@/presentation/ui/button";

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_WS_URL;
const CHANNEL = "admin-logista";
const IDENTITY = "logista";

const presenceLabels: Record<string, string> = {
  admin: "Backoffice",
  logista: "Você",
};

const statusCopy = {
  connected: {
    label: "Conectado",
    tone: "text-emerald-600 dark:text-emerald-200",
    bg: "bg-emerald-100 dark:bg-emerald-500/15",
    Icon: SignalHigh,
  },
  connecting: {
    label: "Reconectando",
    tone: "text-amber-700 dark:text-amber-200",
    bg: "bg-amber-100 dark:bg-amber-500/20",
    Icon: SignalHigh,
  },
  disconnected: {
    label: "Offline",
    tone: "text-slate-700 dark:text-slate-200",
    bg: "bg-slate-200/80 dark:bg-slate-600/40",
    Icon: WifiOff,
  },
  idle: {
    label: "Aguardando",
    tone: "text-muted-foreground",
    bg: "bg-muted",
    Icon: SignalHigh,
  },
  error: {
    label: "Instável",
    tone: "text-rose-700 dark:text-rose-200",
    bg: "bg-rose-100 dark:bg-rose-500/20",
    Icon: WifiOff,
  },
} as const;

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function RealtimeBridgePanel() {
  const [draft, setDraft] = useState("");

  const { messages, participants, sendMessage, status } = useRealtimeChannel({
    channel: CHANNEL,
    identity: IDENTITY,
    url: REALTIME_URL,
    metadata: { displayName: "Área do logista" },
  });

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [messages]);

  const peopleOnline = useMemo(() => {
    return [...participants].sort((a, b) =>
      a.sender.localeCompare(b.sender, "pt-BR")
    );
  }, [participants]);

  const statusData =
    statusCopy[status as keyof typeof statusCopy] ?? statusCopy.idle;

  const canSend = status === "connected" && draft.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    const sent = sendMessage(value);
    if (sent) {
      setDraft("");
    }
  };

  return (
    <Card className="border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-white/10 p-2">
            <MessageCircle className="size-5" />
          </span>
          <div>
            <CardTitle className="text-lg">
              Linha direta Grota ↔ Backoffice
            </CardTitle>
            <CardDescription className="text-sm text-white/70">
              Atualize o time interno sobre propostas críticas sem sair do
              dashboard.
            </CardDescription>
          </div>
        </div>
        <div
          className={cn(
            "mt-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
            statusData.bg,
            statusData.tone
          )}
        >
          <statusData.Icon className="size-3.5" />
          {statusData.label}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap gap-2 text-xs text-white/70">
          <span className="font-semibold text-white">
            {peopleOnline.length} conectado{peopleOnline.length === 1 ? "" : "s"}
          </span>
          <div className="flex flex-wrap gap-2">
            {peopleOnline.map((participant) => {
              const isSelf = participant.sender === IDENTITY;
              return (
                <Badge
                  key={participant.clientId}
                  variant={isSelf ? "default" : "secondary"}
                  className={cn(
                    "border border-white/20 bg-white/10 text-white",
                    isSelf && "bg-emerald-500/80"
                  )}
                >
                  {presenceLabels[participant.sender] ?? participant.sender}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
          <div className="flex max-h-[280px] flex-col gap-3 overflow-y-auto pr-1">
            {sortedMessages.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-sm text-white/70">
                Nenhuma mensagem por aqui ainda.
              </div>
            ) : (
              sortedMessages.map((item) => {
                const isSelf = item.sender === IDENTITY;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex w-full text-sm",
                      isSelf ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                        isSelf
                          ? "bg-emerald-500/80 text-white"
                          : "bg-white/10 text-white"
                      )}
                    >
                      <p className="whitespace-pre-line leading-relaxed">
                        {item.body}
                      </p>
                      <span className="mt-1 block text-[11px] text-white/70">
                        {presenceLabels[item.sender] ?? item.sender} ·{" "}
                        {formatTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-white/10 pt-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-3">
          <Input
            placeholder="Descreva o status da proposta em andamento..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={status !== "connected"}
            className="border-white/20 bg-white/5 text-white placeholder:text-white/70"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            className="bg-white/90 text-slate-900 hover:bg-white"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
