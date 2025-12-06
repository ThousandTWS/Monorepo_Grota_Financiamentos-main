import { useCallback, useEffect, useState } from "react";
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
  parseBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { getRealtimeUrl } from "@/application/config/realtime";

type ProposalTimelineSheetProps = {
  proposalId: number;
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
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<ProposalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { messages } = useRealtimeChannel({
    channel: REALTIME_CHANNELS.PROPOSALS,
    identity: `admin-timeline-${proposalId}`,
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
    const parsed = parseBridgeEvent(latest);
    if (parsed?.event === REALTIME_EVENT_TYPES.PROPOSAL_EVENT_APPENDED) {
      const payload = parsed.payload as { proposalId?: number };
      if (payload?.proposalId === proposalId) {
        void loadTimeline();
      }
    }
  }, [messages, open, proposalId, loadTimeline]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-center gap-2">
          <History className="size-4" />
          Histórico
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Histórico da ficha #{proposalId}</SheetTitle>
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
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={event.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-full border p-2 text-muted-foreground">
                        <Clock3 className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                          <span>{formatDateTime(event.createdAt)}</span>
                          {event.actor ? <span>• {event.actor}</span> : null}
                        </div>
                        <p className="text-sm font-semibold">
                          {event.type === "STATUS_UPDATED"
                            ? `Status: ${event.statusFrom ? statusLabel[event.statusFrom] ?? event.statusFrom : "—"} → ${event.statusTo ? statusLabel[event.statusTo] ?? event.statusTo : "—"}`
                            : event.type === "CREATED"
                              ? "Ficha criada"
                              : event.type}
                        </p>
                        {event.note ? (
                          <p className="text-sm text-muted-foreground">{event.note}</p>
                        ) : null}
                      </div>
                    </div>
                    {index < events.length - 1 ? <Separator /> : null}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
