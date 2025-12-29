import { Card, Progress, Skeleton, Typography } from "antd";
import { ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { StatusBadge } from "../../logista/components/status-badge";

const { Text } = Typography;

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
        <Skeleton active title paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden" data-oid="queue-stats" bodyStyle={{ padding: 0 }}>
      <div className="bg-gradient-to-br from-[#0f3c5a] to-[#134b73] px-5 py-6 text-white">
        <Text className="text-xs font-medium uppercase tracking-[0.4em] !text-white/80">
          Pipeline Admin
        </Text>
        <p className="text-4xl font-semibold text-white">{total}</p>
        <Text className="text-sm !text-white/80">Ficha(s) monitoradas em tempo real</Text>
      </div>
      <div className="space-y-3 border-t border-slate-200/60 p-4">
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
              percent={total ? Math.round((ticket.value / total) * 100) : 0}
              showInfo={false}
              strokeColor="#0ea5e9"
              railColor="#e5e7eb"
              size="small"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
