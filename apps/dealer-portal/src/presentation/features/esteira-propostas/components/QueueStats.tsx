import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/ui/card";
import { Skeleton } from "@/presentation/ui/skeleton";
import { ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { StatusBadge } from "./status-badge";

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

  if (isLoading && summary.overallTotal === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Minhas fichas
            </p>
            <CardTitle className="text-3xl font-semibold">
              {tickets[0]?.value ?? 0}
            </CardTitle>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase">
              Enviadas
            </p>
            <p className="text-lg font-semibold">
              {summary.overallTotal ?? tickets[0]?.total ?? 0}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {tickets.map((ticket, index) => (
          <div
            key={`${ticket.label}-${index}`}
            className="flex items-center justify-between rounded-md border px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <StatusBadge
                status={ticket.status ?? ticket.label}
                className="shadow-none px-3 py-1 text-xs"
              >
                {ticket.label}
              </StatusBadge>
            </div>
            <div className="text-sm font-semibold">
              {ticket.value}
              {ticket.total ? (
                <span className="ml-1 text-xs font-medium text-muted-foreground">
                  / {ticket.total}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
