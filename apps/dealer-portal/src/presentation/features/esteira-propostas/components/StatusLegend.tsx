import { cn } from "@/lib/utils";
import { ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
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
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Status geral
        </p>
        <span className="text-sm text-muted-foreground">
          Total {summary.overallTotal}
        </span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum status disponível.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm font-semibold">
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
