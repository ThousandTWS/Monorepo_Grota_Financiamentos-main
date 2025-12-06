/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useMemo, useState } from "react";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  parseBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { getAllSellers, Seller } from "@/application/services/Seller/sellerService";
import { getRealtimeUrl } from "@/application/config/realtime";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import { Button } from "@/presentation/layout/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/layout/components/ui/avatar";
import { cn } from "@/lib/utils";
import { StatusBadge } from "../../logista/components/status-badge";
import { Clock3, Filter } from "lucide-react";

interface SellerActivity {
  id: string;
  sellerId: number;
  sellerName: string;
  action: string;
  target: string;
  status: "approval" | "submission" | "rejection" | "update";
  timestamp: string;
}

const typeConfig = {
  approval: {
    label: "Aprovação",
    badgeClass:
      "bg-green-500/10 text-green-700 border-green-500/30 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/40",
    dotClass: "bg-green-500",
  },
  submission: {
    label: "Envio",
    badgeClass:
      "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/40",
    dotClass: "bg-blue-500",
  },
  rejection: {
    label: "Rejeição",
    badgeClass:
      "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/40",
    dotClass: "bg-red-500",
  },
  update: {
    label: "Atualização",
    badgeClass:
      "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/40",
    dotClass: "bg-amber-500",
  },
} as const;

type ActivityStatus = keyof typeof typeConfig;

const SALES_CHANNEL = REALTIME_CHANNELS.NOTIFICATIONS;
const SALES_IDENTITY = "admin-sellers-activity";

const formatTimeDistance = (value: string) => {
  const timestamp = new Date(value).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - timestamp);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    const seconds = Math.floor(diff / 1000);
    return `há ${seconds || 1} segundo${seconds === 1 ? "" : "s"}`;
  }
  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `há ${minutes} minuto${minutes === 1 ? "" : "s"}`;
  }
  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `há ${hours} hora${hours === 1 ? "" : "s"}`;
  }
  const days = Math.floor(diff / day);
  return `há ${days} dia${days === 1 ? "" : "s"}`;
};

const deriveInitials = (name: string) => {
  return name
    .split(" ")
    .map((piece) => piece.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function RecentActivity() {
  const [activities, setActivities] = useState<SellerActivity[]>([]);
  const [sellersIndex, setSellersIndex] = useState<Record<number, Seller>>({});
  const [statusFilter, setStatusFilter] = useState<keyof typeof typeConfig | "all">("all");

  const { messages } = useRealtimeChannel({
    channel: SALES_CHANNEL,
    identity: SALES_IDENTITY,
    url: getRealtimeUrl(),
  });

  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    const syncSellers = async () => {
      try {
        const sellers = await getAllSellers();
        const map = sellers.reduce<Record<number, Seller>>((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        setSellersIndex(map);

        const bootstrapActivities: SellerActivity[] = sellers.map((seller) => ({
          id: `seller-${seller.id}`,
          sellerId: seller.id,
          sellerName: seller.fullName ?? `Vendedor ${seller.id}`,
          action: "está ativo",
          target: seller.email ?? seller.phone ?? "sem contato",
          status: "update",
          timestamp: seller.createdAt ?? new Date().toISOString(),
        }));
        setActivities(bootstrapActivities.slice(0, 10));
      } catch (error) {
        console.error("[RecentActivity] Falha ao carregar vendedores", error);
      }
    };

    syncSellers();
  }, []);

  useEffect(() => {
    if (!lastMessage) return;
    const parsed = parseBridgeEvent(lastMessage);
    if (
      //@ts-ignore
      parsed?.event !== REALTIME_EVENT_TYPES.SELLER_ACTIVITY_SENT ||
      //@ts-ignore
      !parsed.payload
    ) {
      return;
    }

    //@ts-ignore
    const payload = parsed.payload as SellerActivity;
    setActivities((current) => {
      const next = [payload, ...current];
      return next.slice(0, 20);
    });
  }, [lastMessage]);

  const displayedActivities = useMemo(() => {
    const withSeller = activities.map((activity) => {
      const seller = sellersIndex[activity.sellerId];
      return {
        ...activity,
        sellerName: seller?.fullName ?? activity.sellerName,
        sellerInitials: seller?.fullName
          ? deriveInitials(seller.fullName)
          : deriveInitials(activity.sellerName),
      };
    });

    if (statusFilter === "all") return withSeller;
    return withSeller.filter((item) => item.status === statusFilter);
  }, [activities, sellersIndex, statusFilter]);

  const filterOptions = useMemo(() => ["all"] as const, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Atividades recentes
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Eventos disparados pelos vendedores em tempo real.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Em tempo real
              </span>
              <span>·</span>
              <span>{activities.length} eventos</span>
              <span>·</span>
              <span>
                {new Set(activities.map((a) => a.sellerId)).size} vendedores
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            <span>
              Atualizado{" "}
              {activities[0]
                ? formatTimeDistance(activities[0].timestamp)
                : "agora"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((key) => {
            const isActive = statusFilter === key;
            const label =
              key === "all" ? "Todos" : typeConfig[key as ActivityStatus]?.label;
            const count =
              key === "all"
                ? activities.length
                : activities.filter((a) => a.status === key).length;

            return (
              <Button
                key={key}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="h-9 px-3 text-xs"
                onClick={() =>
                  setStatusFilter(key === "all" ? "all" : (key as ActivityStatus))
                }
              >
                <StatusBadge
                  className={cn(
                    "shadow-none px-2 py-0.5 text-[10px]",
                    key !== "all" ? typeConfig[key as ActivityStatus]?.badgeClass : "",
                  )}
                >
                  {label}
                </StatusBadge>
                <span className="ml-2">{count}</span>
              </Button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {displayedActivities.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-sm text-muted-foreground">
                Nenhuma atividade registrada até o momento.
              </div>
            ) : (
              displayedActivities.map((activity) => {
                const dot =
                  typeConfig[activity.status]?.dotClass ??
                  typeConfig.update.dotClass;

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/70 px-3 py-3 shadow-sm transition-colors hover:border-border hover:bg-card"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-border/60">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="text-xs font-semibold">
                          {activity.sellerInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-background",
                          dot,
                        )}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm leading-none">
                          <span className="font-semibold">{activity.sellerName}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                          {formatTimeDistance(activity.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          className={cn(
                            "inline-flex text-[11px] font-semibold px-2.5 py-1 border shadow-none",
                            typeConfig[activity.status]?.badgeClass,
                          )}
                        >
                          {typeConfig[activity.status]?.label}
                        </StatusBadge>
                        <span className="text-xs text-muted-foreground truncate">
                          {activity.target}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
