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

export function ConversionFunnel() {
  const series = [
    {
      name: "Funil de Conversão",
      data: [12450, 8920, 6780, 5240, 4150],
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
        borderRadius: 8,
        horizontal: true,
        distributed: true,
        barHeight: "75%",
        isFunnel: true,
      },
    },
    colors: ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"],
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex];
      },
      dropShadow: {
        enabled: false,
      },
      style: {
        fontSize: "13px",
        fontWeight: 600,
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: [
        "Propostas Recebidas",
        "Em Análise",
        "Pré-Aprovadas",
        "Aprovadas",
        "Finalizadas",
      ],

      labels: {
        formatter: (value) => `${Number(value).toLocaleString("pt-BR")}`,
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value.toLocaleString("pt-BR")} propostas`,
        title: {
          formatter: () => "",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
  };

  return (
    <Card data-oid="0e8v85r">
      <CardHeader data-oid="3cg2bmp">
        <CardTitle data-oid="hl6necw">Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent data-oid="tbodz2t">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
          data-oid="9m3c661"
        />
      </CardContent>
    </Card>
  );
}
