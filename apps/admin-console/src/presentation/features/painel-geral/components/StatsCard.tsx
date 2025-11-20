import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor,
  iconBg,
}: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-lg"
      data-oid="rug8eav"
    >
      <CardHeader className="pb-3" data-oid="9:5gj4y">
        <div className="flex items-center justify-between" data-oid="6odc4qd">
          <CardTitle
            className="text-sm font-medium text-muted-foreground"
            data-oid="6_3y8xn"
          >
            {title}
          </CardTitle>
          <div className={cn("p-2.5 rounded-lg", iconBg)} data-oid="zh139ak">
            <Icon className={cn("h-5 w-5", iconColor)} data-oid="77y6ka2" />
          </div>
        </div>
      </CardHeader>
      <CardContent data-oid="i.czimp">
        <div className="space-y-2" data-oid="ubwr63r">
          <div className="text-3xl font-bold tracking-tight" data-oid="z4ivjoh">
            {value}
          </div>
          <div className="flex items-center gap-2 text-sm" data-oid="weh4sf9">
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full",
                isPositive
                  ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950"
                  : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950",
              )}
              data-oid="mg0w42q"
            >
              {isPositive ? "↑" : "↓"} {Math.abs(change)}%
            </span>
            <span className="text-muted-foreground" data-oid="93bz5:f">
              {changeLabel}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
