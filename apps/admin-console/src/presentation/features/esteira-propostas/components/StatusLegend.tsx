import { ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { ProposalsDashboardSummary } from "./QueueStats";

const statusProgressClasses: Record<ProposalStatus, string> = {
  SUBMITTED: "from-sky-500 to-sky-600",
  PENDING: "from-amber-400 to-amber-500",
  APPROVED: "from-emerald-500 to-emerald-600",
  REJECTED: "from-red-500 to-red-600",
};

const statusDotColors: Record<ProposalStatus, string> = {
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
    <div
      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm p-5"
      data-oid="status-legend"
    >
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
        Radar de status
      </h3>
      <div className="space-y-4 text-sm">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma ficha recebida no momento.
          </p>
        ) : (
          items.map((item) => {
            const percentage =
              summary.overallTotal > 0
                ? Math.round((item.value / summary.overallTotal) * 100)
                : 0;
            return (
              <div key={item.key}>
                <div className="flex items-center justify-between font-semibold text-slate-600">
                  <span className="flex items-center gap-2">
                    <span className={`inline-flex h-2 w-2 rounded-full ${statusDotColors[item.key]}`}></span>
                    {item.label}
                  </span>
                  <span>
                    {item.value} · {percentage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${statusProgressClasses[item.key]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
