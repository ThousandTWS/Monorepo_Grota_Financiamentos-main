"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function ForecastChart() {
  const series = [
    {
      name: "Realizado",
      type: "line",
      data: [
        4800, 5200, 6100, 5800, 6900, 7200, 8100, 7800, 8500, 9200, 10100,
        11500,
      ],
    },
    {
      name: "Previsão",
      type: "line",
      data: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        9200,
        10300,
        11800,
        12400,
        13100,
        13800,
      ],
    },
    {
      name: "Meta",
      type: "line",
      data: [
        5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000,
        11000, 12000, 13000, 14000,
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: "Inter, sans-serif",
    },
    stroke: {
      width: [3, 3, 2],
      curve: "smooth",
      dashArray: [0, 5, 8],
    },
    colors: ["#10B981", "#3B82F6", "#F59E0B"],
    markers: {
      size: [4, 0, 0],
      strokeWidth: 2,
      strokeColors: "#fff",
      hover: {
        size: 6,
      },
    },
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
        "Jan 25",
        "Fev 25",
        "Mar 25",
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
        formatter: (value) => `R$ ${(value / 1000).toFixed(0)}k`,
      },
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
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (value === null) return "";
          return `R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
    },
    annotations: {
      xaxis: [
        {
          x: "Out",
          x2: "Mar 25",
          fillColor: "#F1F5F9",
          opacity: 0.3,
          label: {
            text: "Previsão",
            style: {
              color: "#64748B",
              fontSize: "11px",
              background: "transparent",
            },
          },
        },
      ],
    },
  };

  return (
    <Card data-oid=".y57_wa">
      <CardHeader data-oid="jrms4u-">
        <CardTitle data-oid=":f8fujf">Previsão de Crescimento</CardTitle>
      </CardHeader>
      <CardContent data-oid="i48enu4">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
          data-oid="dfdrl40"
        />
      </CardContent>
    </Card>
  );
}
