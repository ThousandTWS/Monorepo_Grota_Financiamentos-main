"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./relatorios-print.css";
// ...existing code...
import { Download, Printer } from "lucide-react";
import * as XLSX from "xlsx";
import { useRelatoriosBreadcrumb } from "@/src/application/core/hooks/useBreadcrumb";

function RelatoriosPage() {
  useRelatoriosBreadcrumb();

  // Dados fictícios do relatório
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroAno, setFiltroAno] = useState("");
  const relatorio = [
    {
      cliente: "João Silva",
      veiculo: "Fiat Uno 2020",
      ano: 2020,
      valor: 35000,
      parcelas: 36,
      status: "Aprovado",
      data: "2024-01-10",
      vendedor: "Lucas",
    },
    {
      cliente: "Maria Souza",
      veiculo: "VW Gol 2018",
      ano: 2018,
      valor: 28000,
      parcelas: 24,
      status: "Pendente",
      data: "2024-02-15",
      vendedor: "Lucas",
    },
    {
      cliente: "Carlos Lima",
      veiculo: "Chevrolet Onix 2022",
      ano: 2022,
      valor: 52000,
      parcelas: 48,
      status: "Aprovado",
      data: "2024-03-20",
      vendedor: "Fernanda",
    },
    {
      cliente: "Ana Paula",
      veiculo: "Hyundai HB20 2019",
      ano: 2019,
      valor: 41000,
      parcelas: 36,
      status: "Reprovado",
      data: "2024-04-05",
      vendedor: "Fernanda",
    },
    {
      cliente: "Pedro Gomes",
      veiculo: "Toyota Corolla 2021",
      ano: 2021,
      valor: 85000,
      parcelas: 60,
      status: "Aprovado",
      data: "2024-05-12",
      vendedor: "Lucas",
    },
    {
      cliente: "Juliana Alves",
      veiculo: "Honda Civic 2020",
      ano: 2020,
      valor: 90000,
      parcelas: 48,
      status: "Pendente",
      data: "2024-06-18",
      vendedor: "Fernanda",
    },
  ];

  // Filtros
  const dadosFiltrados = relatorio.filter((item) => {
    const statusOk = filtroStatus ? item.status === filtroStatus : true;
    const clienteOk = filtroCliente
      ? item.cliente.toLowerCase().includes(filtroCliente.toLowerCase())
      : true;
    const anoOk = filtroAno ? String(item.ano) === filtroAno : true;
    return statusOk && clienteOk && anoOk;
  });

  // Exportar para Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dadosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio");
    XLSX.writeFile(wb, "relatorio-financiamentos.xlsx");
  };

  // Exportar para PDF (simples, usando print)
  const handlePrint = () => {
    const printArea = document.getElementById("relatorio-print-area");
    if (!printArea) return;
    // SVG da logo igual ao componente do dashboard/site
    const logoSVG = `<div style="display:flex;align-items:center;justify-content:center;margin-bottom:24px;gap:12px;">
      <span style="display:inline-flex;align-items:center;justify-content:center;background:#F97316;border-radius:6px;padding:6px;">
        <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='display:block;'>
          <rect x='3' y='11' width='18' height='4' rx='2'/>
          <path d='M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4'/>
          <circle cx='7.5' cy='17.5' r='2.5'/>
          <circle cx='16.5' cy='17.5' r='2.5'/>
        </svg>
      </span>
      <span style="font-size:1.5rem;font-weight:bold;color:#000;font-family:Arial,Helvetica,sans-serif;">
        Logo<span style="color:#F97316;">Marca</span>
      </span>
    </div>`;
    // Remove a div da logo-print-only (caso exista) para evitar duplicidade
    const html = printArea.innerHTML.replace(
      /<div class="logo-print-only">[\s\S]*?<\/div>/,
      logoSVG
    );
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.title = "Relatório - Grota Financiamentos";
    const style = printWindow.document.createElement("style");
    style.textContent = `body { font-family: Arial, sans-serif; margin: 40px; } table { width: 100%; border-collapse: collapse; margin-top: 24px; } th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } th { background: #f3f3f3; } h2 { margin-bottom: 0; }`;
    printWindow.document.head.appendChild(style);
    printWindow.document.body.innerHTML = html;
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Anos únicos para filtro
  const anos = Array.from(new Set(relatorio.map((item) => item.ano)));
  const statusList = ["Aprovado", "Pendente", "Reprovado"];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Relatórios de Financiamentos
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition"
          >
            <Printer size={18} /> Exportar/Imprimir
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
          >
            <Download size={18} /> Exportar Excel
          </button>
        </div>
      </div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 bg-card p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Filtrar por cliente..."
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="border border-border rounded px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary min-w-[200px]"
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="border border-border rounded px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Todos os status</option>
          {statusList.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          value={filtroAno}
          onChange={(e) => setFiltroAno(e.target.value)}
          className="border border-border rounded px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Todos os anos</option>
          {anos.map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>
      <div id="relatorio-print-area" className="bg-card p-6 rounded-lg shadow">
        {/* Logo só aparece na impressão/exportação */}
        <div className="logo-print-only">
          {/* A logo só aparece na impressão/exportação, mas para evitar warning, usamos <Image> na visualização normal */}
          <span className="hidden print:inline">
            <Image src="/logo-marca.svg" alt="Logo Marca" width={100} height={100} />
          </span>
          <span className="print:hidden">
            <Image src="/logo-marca.svg" alt="Logo Marca" width={48} height={48} priority />
          </span>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-foreground text-center">
          Resumo de Financiamentos
        </h2>
        <span className="text-xs text-muted-foreground block text-center mb-4 print:mb-8">
          Emitido em: {new Date().toLocaleDateString("pt-BR")}
        </span>
        <table className="w-full border border-border rounded overflow-hidden">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left text-xs font-bold text-muted-foreground">
                Cliente
              </th>
              <th className="p-2 text-left text-xs font-bold text-muted-foreground">
                Veículo
              </th>
              <th className="p-2 text-left text-xs font-bold text-muted-foreground">
                Ano
              </th>
              <th className="p-2 text-left text-xs font-bold text-muted-foreground">
                Valor
              </th>
              <th className="p-2 text-left text-xs font-bold text-muted-foreground">
                Parcelas
              </th>
              <th className="p-2 text-left text-xs font-bold text-muted-foreground">
                Status
              </th>
              <th className="p-2 text-left text-xs font-bold text-muted-foreground">
                Data
              </th>
              <th className="p-2 text-left text-xs font-bold text-muted-foreground">
                Vendedor
              </th>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center text-muted-foreground py-6"
                >
                  Nenhum resultado encontrado.
                </td>
              </tr>
            ) : (
              dadosFiltrados.map((item) => (
                <tr key={`${item.data}-${item.cliente}`} className="even:bg-muted/50">
                  <td className="p-2 text-foreground">{item.cliente}</td>
                  <td className="p-2 text-foreground">{item.veiculo}</td>
                  <td className="p-2 text-foreground">{item.ano}</td>
                  <td className="p-2 text-foreground">
                    R$ {item.valor.toLocaleString("pt-BR")}
                  </td>
                  <td className="p-2 text-foreground">{item.parcelas}</td>
                  <td className="p-2 text-foreground">{item.status}</td>
                  <td className="p-2 text-foreground">{item.data}</td>
                  <td className="p-2 text-foreground">{item.vendedor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RelatoriosPage;
