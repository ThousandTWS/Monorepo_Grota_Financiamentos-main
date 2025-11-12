import { ProposalSummaryPayload, ProposalQueueStatus } from "@/application/core/@types/Proposals/Proposal";
import { cn } from "@/lib/utils";

type StatusLegendProps = {
  summary?: ProposalSummaryPayload | null;
};

const statusColors: Record<ProposalQueueStatus, string> = {
  triage: "bg-blue-300",
  awaiting_input: "bg-purple-500",
  analysis: "from-amber-500/80 to-yellow-400/80",
  filling: "bg-slate-300",
  sent: "from-violet-500/80 to-violet-400/80",
  pre_approved: "bg-lime-500",
  rejected: "from-red-600/80 to-red-500/80",
  awaiting_payment: "bg-green-700",
  paid: "bg-cyan-300",
};

export function StatusLegend({ summary }: StatusLegendProps) {
  const items = summary?.statusTotals ?? [];

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Status geral
        </p>
        <span className="text-sm text-muted-foreground">
          Total {summary?.overallTotal ?? 0}
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
              <div
                className={cn(
                  "flex items-center justify-between rounded-md bg-gradient-to-r px-3 py-1.5 text-sm font-semibold text-white",
                  statusColors[item.key],
                )}
              >
                <span>{item.label}</span>
                <span>
                  {item.value}
                  {item.total ? ` / ${item.total}` : ""}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
