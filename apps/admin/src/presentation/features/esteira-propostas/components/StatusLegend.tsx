import React from "react";
import { ProposalSummaryPayload, ProposalQueueStatus } from "@/application/core/@types/Proposals/Proposal";
import { cn } from "@/lib/utils";

interface StatusLegendProps {
  summary?: ProposalSummaryPayload | null;
}

const statusColors: Record<ProposalQueueStatus, string> = {
  triage: "from-blue-500/80 to-blue-400/80",
  awaiting_input: "from-slate-500/80 to-slate-400/80",
  analysis: "from-amber-500/80 to-yellow-400/80",
  filling: "from-sky-500/80 to-sky-400/80",
  sent: "from-violet-500/80 to-violet-400/80",
  pre_approved: "from-emerald-500/80 to-emerald-400/80",
  rejected: "from-red-600/80 to-red-500/80",
  awaiting_payment: "from-orange-500/80 to-orange-400/80",
  paid: "from-green-600/80 to-green-500/80",
};

export function StatusLegend({ summary }: StatusLegendProps) {
  const items = summary?.statusTotals ?? [];

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3" data-oid="3bpxush">
      <div className="flex items-center justify-between" data-oid="9nskd6.">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide" data-oid="-t.jk6t">
          Status geral
        </p>
        <span className="text-sm text-muted-foreground" data-oid="u9-e-b8">
          Total {summary?.overallTotal ?? 0}
        </span>
      </div>

      <div className="space-y-2" data-oid="0ck3i-c">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground" data-oid="ef3io9g">
            Nenhum status disponível.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.key} className="space-y-1" data-oid="m495o02">
              <div
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-1.5 text-white text-sm font-semibold",
                  "bg-gradient-to-r",
                  statusColors[item.key],
                )}
                data-oid="0izkzv3"
              >
                <span data-oid="y873rk7">{item.label}</span>
                <span data-oid="qpwcl6h">
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
