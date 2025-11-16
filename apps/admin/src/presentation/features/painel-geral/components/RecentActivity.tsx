/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useMemo, useState } from "react";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  parseBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { getAllSellers, Seller } from "@/application/services/Seller/sellerService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/layout/components/ui/avatar";
import { cn } from "@/lib/utils";

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
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    dotColor: "bg-green-500",
  },
  submission: {
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    dotColor: "bg-blue-500",
  },
  rejection: {
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    dotColor: "bg-red-500",
  },
  update: {
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
};

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_WS_URL;
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

  const { messages } = useRealtimeChannel({
    channel: SALES_CHANNEL,
    identity: SALES_IDENTITY,
    url: REALTIME_URL,
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
    return activities.map((activity) => {
      const seller = sellersIndex[activity.sellerId];
      return {
        ...activity,
        sellerName: seller?.fullName ?? activity.sellerName,
        sellerInitials: seller?.fullName
          ? deriveInitials(seller.fullName)
          : deriveInitials(activity.sellerName),
      };
    });
  }, [activities, sellersIndex]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Atividades recentes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Eventos disparados pelos vendedores em tempo real.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {displayedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="relative" data-oid="gw2lcdv">
                  <Avatar className="h-10 w-10" data-oid="sltmbg6">
                    <AvatarImage
                      src={undefined}
                      data-oid="x_qi9g6"
                    />

                    <AvatarFallback
                      className="text-xs font-semibold"
                      data-oid="2vgmd4:"
                    >
                      {activity.sellerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-950",
                      typeConfig[activity.status]?.dotColor ??
                        typeConfig.update.dotColor,
                    )}
                    data-oid="dssn6nd"
                  />
                </div>
                <div className="flex-1 space-y-1 min-w-0" data-oid="n4.e553">
                  <p className="text-sm leading-none" data-oid="dhvzc23">
                    <span className="font-semibold" data-oid="y4pvo__">
                      {activity.sellerName}
                    </span>{" "}
                    <span className="text-muted-foreground" data-oid="d9hse.-">
                      {activity.action}
                    </span>
                  </p>
                  <p
                    className="text-sm font-medium text-foreground truncate"
                    data-oid="lejhwou"
                  >
                    {activity.target}
                  </p>
                  <p
                    className="text-xs text-muted-foreground"
                    data-oid="y3.doak"
                  >
                    {formatTimeDistance(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {displayedActivities.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-sm text-muted-foreground">
                Nenhuma atividade registrada até o momento.
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
