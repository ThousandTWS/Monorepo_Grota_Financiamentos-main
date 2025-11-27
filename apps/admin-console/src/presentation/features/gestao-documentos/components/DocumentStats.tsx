"use client";
import React from "react";
import { Card, CardContent } from "@/presentation/layout/components/ui/card";
import { Badge } from "@/presentation/layout/components/ui/badge";
import { CheckCircle, Clock, Download, FileText, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatEntry {
  title: string;
  value: number | string;
  icon: React.ElementType;
  pill?: string;
  tone: {
    text: string;
    bg: string;
  };
}

interface DocumentStatsProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  lastSyncLabel?: string;
}

export function DocumentStats({
  total,
  pending,
  approved,
  rejected,
  lastSyncLabel,
}: DocumentStatsProps) {
  const stats: StatEntry[] = [
    {
      title: "Total recebidos",
      value: total,
      icon: FileText,
      tone: { text: "text-blue-700", bg: "bg-blue-100 dark:bg-blue-900/40" },
    },
    {
      title: "Pendentes",
      value: pending,
      icon: Clock,
      pill: "aguardando análise",
      tone: {
        text: "text-amber-700",
        bg: "bg-amber-100 dark:bg-amber-900/40",
      },
    },
    {
      title: "Aprovados",
      value: approved,
      icon: CheckCircle,
      tone: {
        text: "text-emerald-700",
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
      },
    },
    {
      title: "Reprovados",
      value: rejected,
      icon: XCircle,
      tone: { text: "text-rose-700", bg: "bg-rose-100 dark:bg-rose-900/40" },
    },
    {
      title: "Última sincronização",
      value: lastSyncLabel ?? "—",
      icon: Download,
      tone: { text: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800" },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((item) => (
        <Card
          key={item.title}
          className="border border-border/60 shadow-sm transition-all hover:shadow-md"
        >
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <p className="text-2xl font-semibold mt-1">{item.value}</p>
              {item.pill && (
                <Badge variant="secondary" className="mt-2">
                  {item.pill}
                </Badge>
              )}
            </div>
            <div
              className={cn(
                "rounded-2xl p-3 text-lg",
                item.tone.bg,
                item.tone.text,
              )}
            >
              <item.icon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
