import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/layout/components/ui/avatar";
import { Badge } from "@/presentation/layout/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface Performer {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  role: string;
  deals: number;
  volume: string;
  growth: number;
  rank: number;
}

const performers: Performer[] = [
  {
    id: "1",
    name: "Roberto Mendes",
    initials: "RM",
    role: "Gerente Comercial",
    deals: 142,
    volume: "R$ 8,5M",
    growth: 23.5,
    rank: 1,
  },
  {
    id: "2",
    name: "Fernanda Lima",
    initials: "FL",
    role: "Consultora Senior",
    deals: 128,
    volume: "R$ 7,2M",
    growth: 18.2,
    rank: 2,
  },
  {
    id: "3",
    name: "Thiago Andrade",
    initials: "TA",
    role: "Gerente de Vendas",
    deals: 115,
    volume: "R$ 6,8M",
    growth: 15.8,
    rank: 3,
  },
  {
    id: "4",
    name: "Patricia Rocha",
    initials: "PR",
    role: "Consultora Pleno",
    deals: 98,
    volume: "R$ 5,9M",
    growth: 12.3,
    rank: 4,
  },
  {
    id: "5",
    name: "Marcos Vieira",
    initials: "MV",
    role: "Consultor Junior",
    deals: 87,
    volume: "R$ 4,5M",
    growth: 9.7,
    rank: 5,
  },
];

const rankColors = {
  1: "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white",
  2: "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900",
  3: "bg-gradient-to-br from-orange-400 to-orange-500 text-white",
};

export function TopPerformers() {
  return (
    <Card data-oid="pmy1b8l">
      <CardHeader data-oid="73mljh6">
        <CardTitle data-oid="jd:p7hf">Top 5 Consultores</CardTitle>
      </CardHeader>
      <CardContent data-oid="y0tyso.">
        <div className="space-y-4" data-oid="152a92o">
          {performers.map((performer) => (
            <div
              key={performer.id}
              className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              data-oid="4khhg4h"
            >
              <div className="relative" data-oid="y.i.g.n">
                <Avatar className="h-12 w-12" data-oid="h83-4k1">
                  <AvatarImage src={performer.avatar} data-oid="06coy0r" />
                  <AvatarFallback
                    className="text-sm font-semibold"
                    data-oid="pc6.hlx"
                  >
                    {performer.initials}
                  </AvatarFallback>
                </Avatar>
                {performer.rank <= 3 && (
                  <div
                    className={`absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                      rankColors[performer.rank as keyof typeof rankColors]
                    }`}
                    data-oid="det2tkh"
                  >
                    {performer.rank}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0" data-oid="gz8xx--">
                <div
                  className="flex items-start justify-between gap-2"
                  data-oid="n4e-nhf"
                >
                  <div className="min-w-0 flex-1" data-oid="r:h1eq1">
                    <p
                      className="font-semibold text-sm truncate"
                      data-oid="f-276go"
                    >
                      {performer.name}
                    </p>
                    <p
                      className="text-xs text-muted-foreground"
                      data-oid="0_:ql:l"
                    >
                      {performer.role}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950 shrink-0"
                    data-oid="05nv5gn"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" data-oid="fn4-3u." />
                    {performer.growth}%
                  </Badge>
                </div>

                <div
                  className="flex items-center gap-4 mt-2 text-xs"
                  data-oid="mxc-4zj"
                >
                  <div className="flex items-center gap-1" data-oid="34uhms6">
                    <span className="text-muted-foreground" data-oid=":ongp_u">
                      Contratos:
                    </span>
                    <span className="font-semibold" data-oid="wutel18">
                      {performer.deals}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" data-oid=".wn0rl.">
                    <span className="text-muted-foreground" data-oid="n1:e2rr">
                      Volume:
                    </span>
                    <span className="font-semibold" data-oid="jv66r2:">
                      {performer.volume}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
