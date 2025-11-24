import { ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { cn } from "@/lib/utils";
import { ProposalsDashboardSummary } from "./QueueStats";

const statusColors: Record<ProposalStatus, string> = {
  SUBMITTED: "bg-sky-500",
  PENDING: "bg-amber-400",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-red-500",
};

type StatusLegendProps = {
  summary: ProposalsDashboardSummary;
};

export function StatusLegend({ summary }: StatusLegendProps) {
  const items = summary.statusTotals;

  return (
    <div className="rounded-lg border bg-card p-5" data-oid="status-legend">
      <h3 className="mb-4 text-base font-semibold" data-oid="legend-title">
        Status geral
      </h3>
      <div className="space-y-3" data-oid="legend-list">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma ficha recebida até o momento.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.key}
              className="space-y-1 text-sm"
              data-oid={`legend-item-${item.key}`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>{item.label}</span>
                <span>
                  {item.value}
                  {item.total ? ` / ${item.total}` : ""}
                </span>
              </div>
              <div
                className={cn(
                  "h-3 rounded-full bg-gradient-to-r",
                  statusColors[item.key],
                )}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
