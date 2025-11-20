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

export function ActivityHeatmap() {
  const generateData = (count: number, range: { min: number; max: number }) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min,
      );
    }
    return data;
  };

  const series = [
    {
      name: "Segunda",
      data: generateData(24, { min: 10, max: 60 }),
    },
    {
      name: "Terça",
      data: generateData(24, { min: 15, max: 70 }),
    },
    {
      name: "Quarta",
      data: generateData(24, { min: 20, max: 80 }),
    },
    {
      name: "Quinta",
      data: generateData(24, { min: 15, max: 75 }),
    },
    {
      name: "Sexta",
      data: generateData(24, { min: 10, max: 65 }),
    },
    {
      name: "Sábado",
      data: generateData(24, { min: 5, max: 40 }),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "heatmap",
      height: 350,
      toolbar: {
        show: false,
      },
      fontFamily: "Inter, sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#10B981"],
    xaxis: {
      type: "category",
      categories: [
        "0h",
        "1h",
        "2h",
        "3h",
        "4h",
        "5h",
        "6h",
        "7h",
        "8h",
        "9h",
        "10h",
        "11h",
        "12h",
        "13h",
        "14h",
        "15h",
        "16h",
        "17h",
        "18h",
        "19h",
        "20h",
        "21h",
        "22h",
        "23h",
      ],

      labels: {
        style: {
          colors: "#64748B",
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    plotOptions: {
      heatmap: {
        radius: 4,
        enableShades: true,
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 20,
              color: "#ECFDF5",
              name: "Baixo",
            },
            {
              from: 21,
              to: 40,
              color: "#A7F3D0",
              name: "Médio-Baixo",
            },
            {
              from: 41,
              to: 60,
              color: "#34D399",
              name: "Médio",
            },
            {
              from: 61,
              to: 80,
              color: "#10B981",
              name: "Alto",
            },
          ],
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value} propostas`,
      },
    },
  };

  return (
    <Card data-oid="1k09zhw">
      <CardHeader data-oid="bwp-0z5">
        <CardTitle data-oid="udgmeht">
          Mapa de Calor - Atividades Semanais
        </CardTitle>
      </CardHeader>
      <CardContent data-oid="y:81c83">
        <ReactApexChart
          options={options}
          series={series}
          type="heatmap"
          height={350}
          data-oid="yztsxoo"
        />
      </CardContent>
    </Card>
  );
}
