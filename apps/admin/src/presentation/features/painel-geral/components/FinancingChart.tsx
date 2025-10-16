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

export function FinancingChart() {
  const series = [
    {
      name: "Financiamentos Aprovados",
      data: [
        4800, 5200, 6100, 5800, 6900, 7200, 8100, 7800, 8500, 9200, 10100,
        11500,
      ],
    },
    {
      name: "Financiamentos Pendentes",
      data: [
        2100, 1900, 2300, 2000, 2400, 2100, 2600, 2300, 2700, 2900, 3100, 3300,
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: "Inter, sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: ["#10B981", "#F59E0B"],
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
    <Card data-oid="189d-0k">
      <CardHeader data-oid="6a3.h_r">
        <CardTitle data-oid="dne3nk2">Volume de Financiamentos</CardTitle>
      </CardHeader>
      <CardContent data-oid="km-v1cx">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
          data-oid="16zn695"
        />
      </CardContent>
    </Card>
  );
}
