import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { ProposalSummaryPayload } from "@/application/core/@types/Proposals/Proposal";
import { Skeleton } from "@/presentation/layout/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QueueStatsProps {
  summary?: ProposalSummaryPayload | null;
  isLoading?: boolean;
}

const fallbackColors = [
  "bg-slate-400",
  "bg-sky-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-rose-400",
];

export function QueueStats({ summary, isLoading }: QueueStatsProps) {
  if (isLoading && !summary) {
    return (
      <Card className="h-full" data-oid="t7o6ruw">
        <CardHeader data-oid="25uwdbn">
          <Skeleton className="h-5 w-32" data-oid="2zr8c5f" />
        </CardHeader>
        <CardContent className="space-y-3" data-oid="0l1r20l">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" data-oid="tpnllwh" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const tickets = summary?.myTickets ?? [];

  return (
    <Card className="h-full" data-oid="0iu_zs2">
      <CardHeader className="pb-2" data-oid="njv60us">
        <div className="flex items-center justify-between" data-oid="hzrq310">
          <div data-oid="3q_1ad4">
            <p className="text-sm font-medium text-muted-foreground" data-oid="qd5u5z9">
              Minhas fichas
            </p>
            <CardTitle className="text-3xl font-semibold" data-oid="3hix1su">
              {tickets[0]?.value ?? 0}
            </CardTitle>
          </div>
          <div className="text-right" data-oid="azykvks">
            <p className="text-xs text-muted-foreground uppercase" data-oid="1p8a-71">
              Enviadas
            </p>
            <p className="text-lg font-semibold" data-oid="2oyvmqx">
              {summary?.overallTotal ?? tickets[0]?.total ?? 0}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-2" data-oid="6m58wqb">
        {tickets.map((ticket, index) => (
          <div
            key={`${ticket.label}-${index}`}
            className="flex items-center justify-between rounded-md border px-3 py-2"
            data-oid="pa5a3ci"
          >
            <div className="flex items-center gap-3" data-oid="mzqxu_x">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  ticket.color ?? fallbackColors[index % fallbackColors.length],
                )}
                data-oid="bfu2g4-"
              />
              <p className="text-sm font-medium" data-oid="lghhq6m">
                {ticket.label}
              </p>
            </div>
            <div className="text-sm font-semibold" data-oid="zvrgfpc">
              {ticket.value}
              {ticket.total ? (
                <span className="text-xs text-muted-foreground ml-1 font-medium" data-oid="xdwphjl">
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
