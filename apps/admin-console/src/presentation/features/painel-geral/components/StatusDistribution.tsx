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

export function StatusDistribution() {
  const series = [4150, 1090, 780, 520, 340];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 350,
      fontFamily: "Inter, sans-serif",
    },
    labels: [
      "Finalizados",
      "Em Análise",
      "Pré-Aprovados",
      "Pendentes",
      "Rejeitados",
    ],

    colors: ["#10B981", "#3B82F6", "#F59E0B", "#6B7280", "#EF4444"],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${Number(val).toFixed(1)}%`;
      },
      style: {
        fontSize: "12px",
        fontWeight: 600,
        
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: 700,
              color: "#0F172A",
              formatter: (val) => `${Number(val).toLocaleString("pt-BR")}`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0,
                );
                return total.toLocaleString("pt-BR");
              },
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      markers: {
        size: 5,
        shape: "circle" as const,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value.toLocaleString("pt-BR")} contratos`,
      },
    },
    stroke: {
      width: 0,
    },
  };

  return (
    <Card data-oid="rkgt_qu">
      <CardHeader data-oid="vz56b_s">
        <CardTitle data-oid="hlng_ff">Distribuição por Status</CardTitle>
      </CardHeader>
      <CardContent data-oid="vhjivja">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={350}
          data-oid="ereaf31"
        />
      </CardContent>
    </Card>
  );
}
