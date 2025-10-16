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

export function PerformanceMetrics() {
  const series = [
    {
      name: "Meta",
      data: [40, 50, 60, 70, 80, 90, 100],
    },
    {
      name: "Realizado",
      data: [35, 48, 65, 72, 85, 92, 105],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "radar",
      height: 350,
      toolbar: {
        show: false,
      },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#94A3B8", "#10B981"],
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.2,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: [
        "Volume",
        "Conversão",
        "Velocidade",
        "Satisfação",
        "Retenção",
        "Qualidade",
        "Produtividade",
      ],

      labels: {
        style: {
          colors: [
            "#64748B",
            "#64748B",
            "#64748B",
            "#64748B",
            "#64748B",
            "#64748B",
            "#64748B",
          ],

          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: false,
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
        horizontal: 16,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value}%`,
      },
    },
  };

  return (
    <Card data-oid="pdsiczf">
      <CardHeader data-oid="d3cr_jw">
        <CardTitle data-oid="9c987aw">Performance vs Meta</CardTitle>
      </CardHeader>
      <CardContent data-oid="cf-9gqi">
        <ReactApexChart
          options={options}
          series={series}
          type="radar"
          height={350}
          data-oid="5hodiww"
        />
      </CardContent>
    </Card>
  );
}
