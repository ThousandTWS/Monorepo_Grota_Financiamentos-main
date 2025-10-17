"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/presentation/layout/components/ui/card";
import { Button } from "@/presentation/layout/components/ui/button";
import { Download } from "lucide-react";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function MonthlyComparison() {
  const series = [
    {
      name: "2024",
      data: [
        4800, 5200, 6100, 5800, 6900, 7200, 8100, 7800, 8500, 9200, 10100,
        11500,
      ],
    },
    {
      name: "2023",
      data: [
        4200, 4600, 5300, 5100, 6200, 6500, 7300, 7000, 7600, 8100, 8900, 9800,
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    colors: ["#10B981", "#94A3B8"],
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],

      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
        formatter: (value) => `${(value / 1000).toFixed(0)}k`,
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      markers: {
        size: 5,
        shape: "circle" as const,
      },
      itemMargin: {
        horizontal: 16,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) =>
          `R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
  };

  return (
    <Card data-oid="r5rwmto">
      <CardHeader data-oid="vzlg90g">
        <CardTitle data-oid="s-v04tb">Comparativo Anual</CardTitle>
        <CardAction data-oid="bl8mh78">
          <Button variant="outline" size="sm" data-oid="s_b3ngs">
            <Download className="h-4 w-4 mr-2" data-oid="t7t7qir" />
            Exportar
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent data-oid="c75ja6:">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
          data-oid="77-rmdc"
        />
      </CardContent>
    </Card>
  );
}
