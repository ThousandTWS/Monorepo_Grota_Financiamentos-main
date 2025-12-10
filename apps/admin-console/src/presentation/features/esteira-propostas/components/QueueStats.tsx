import { Card, CardContent, CardHeader } from "@/presentation/layout/components/ui/card";
import { Progress } from "@/presentation/layout/components/ui/progress";
import { Skeleton } from "@/presentation/layout/components/ui/skeleton";
import { ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { StatusBadge } from "../../logista/components/status-badge";

export type ProposalsDashboardSummary = {
  overallTotal: number;
  myTickets: {
    label: string;
    value: number;
    total?: number;
    color?: string;
    status?: ProposalStatus;
  }[];
  statusTotals: {
    key: ProposalStatus;
    label: string;
    value: number;
    total?: number;
    color?: string;
  }[];
};

type QueueStatsProps = {
  summary: ProposalsDashboardSummary;
  isLoading?: boolean;
};

export function QueueStats({ summary, isLoading }: QueueStatsProps) {
  const tickets = summary.myTickets;
  const total = summary.overallTotal;

  if (isLoading && total === 0) {
    return (
      <Card className="h-full" data-oid="queue-stats">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden" data-oid="queue-stats">
      <div className="bg-gradient-to-br from-[#0f3c5a] to-[#134b73] px-5 py-6 text-white">
        <p className="text-sm font-medium uppercase tracking-[0.4em] text-white/80">
          Pipeline Admin
        </p>
        <p className="text-4xl font-semibold">{total}</p>
        <p className="text-sm text-white/80">Ficha(s) monitoradas em tempo real</p>
      </div>
      <CardContent className="space-y-3 border-t border-slate-200/60 p-4">
        {tickets.map((ticket) => (
          <div key={ticket.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <StatusBadge
                status={ticket.status ?? ticket.label}
                className="px-3 py-1 text-xs shadow-none"
              >
                {ticket.label}
              </StatusBadge>
              <span className="text-sm font-semibold text-slate-700">
                {ticket.value} / {ticket.total ?? total}
              </span>
            </div>
            <Progress
              value={total ? Math.round((ticket.value / total) * 100) : 0}
              className="h-2 bg-slate-100"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
