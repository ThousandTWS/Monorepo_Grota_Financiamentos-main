import React from "react";
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

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  target: string;
  time: string;
  type: "approval" | "submission" | "rejection" | "update";
}

const activities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Carlos Silva",
      initials: "CS",
    },
    action: "aprovou",
    target: "Financiamento #12453",
    time: "há 5 minutos",
    type: "approval",
  },
  {
    id: "2",
    user: {
      name: "Maria Santos",
      initials: "MS",
    },
    action: "enviou",
    target: "Nova proposta #12454",
    time: "há 12 minutos",
    type: "submission",
  },
  {
    id: "3",
    user: {
      name: "João Oliveira",
      initials: "JO",
    },
    action: "atualizou",
    target: "Análise #12451",
    time: "há 23 minutos",
    type: "update",
  },
  {
    id: "4",
    user: {
      name: "Ana Costa",
      initials: "AC",
    },
    action: "rejeitou",
    target: "Proposta #12449",
    time: "há 1 hora",
    type: "rejection",
  },
  {
    id: "5",
    user: {
      name: "Pedro Souza",
      initials: "PS",
    },
    action: "aprovou",
    target: "Financiamento #12450",
    time: "há 2 horas",
    type: "approval",
  },
  {
    id: "6",
    user: {
      name: "Lucia Alves",
      initials: "LA",
    },
    action: "enviou",
    target: "Nova proposta #12448",
    time: "há 3 horas",
    type: "submission",
  },
];

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

export function RecentActivity() {
  return (
    <Card className="h-full" data-oid="jq-9z_2">
      <CardHeader data-oid="8r80wr4">
        <CardTitle data-oid="pkun54x">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent data-oid="n.5p0_1">
        <ScrollArea className="h-[400px] pr-4" data-oid="qs_rlh8">
          <div className="space-y-4" data-oid="01nr5a5">
            {activities.map((activity,) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                data-oid="s-_mbhz"
              >
                <div className="relative" data-oid="gw2lcdv">
                  <Avatar className="h-10 w-10" data-oid="sltmbg6">
                    <AvatarImage
                      src={activity.user.avatar}
                      data-oid="x_qi9g6"
                    />

                    <AvatarFallback
                      className="text-xs font-semibold"
                      data-oid="2vgmd4:"
                    >
                      {activity.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-950",
                      typeConfig[activity.type].dotColor,
                    )}
                    data-oid="dssn6nd"
                  />
                </div>
                <div className="flex-1 space-y-1 min-w-0" data-oid="n4.e553">
                  <p className="text-sm leading-none" data-oid="dhvzc23">
                    <span className="font-semibold" data-oid="y4pvo__">
                      {activity.user.name}
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
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
