"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, Card, Empty, Input, Select, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  listBillingContracts,
} from "@/application/services/Billing/billingService";
import type {
  BillingContractSummary,
  BillingStatus,
} from "@/application/core/@types/Billing/Billing";

const statusColor: Record<BillingStatus, string> = {
  PAGO: "green",
  EM_ABERTO: "blue",
  EM_ATRASO: "red",
};

const statusLabel: Record<BillingStatus, string> = {
  PAGO: "Pago",
  EM_ABERTO: "Em aberto",
  EM_ATRASO: "Em atraso",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T00:00:00`));

export default function CobrancasPage() {
  const [nameFilter, setNameFilter] = useState("");
  const [documentFilter, setDocumentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<BillingStatus | undefined>(
    undefined,
  );
  const [contracts, setContracts] = useState<BillingContractSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listBillingContracts({
          name: nameFilter.trim() || undefined,
          document: digitsOnly(documentFilter.trim()) || undefined,
          status: statusFilter,
        });
        setContracts(data);
      } catch (err) {
        setContracts([]);
        setError(
          err instanceof Error ? err.message : "Falha ao carregar cobrancas.",
        );
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [documentFilter, nameFilter, statusFilter]);

  const columns: ColumnsType<BillingContractSummary> = [
    {
      title: "Cliente",
      dataIndex: ["customer", "name"],
      key: "customerName",
      render: (_value: string, record) => (
        <div className="space-y-1">
          <div className="font-semibold">{record.customer.name}</div>
          <div className="text-xs text-slate-500">{record.customer.document}</div>
        </div>
      ),
    },
    {
      title: "Operacao",
      dataIndex: "contractNumber",
      key: "contractNumber",
      render: (value: string) => (
        <Link href={`/cobrancas/${value}`} className="font-semibold text-blue-600">
          {value}
        </Link>
      ),
    },
    {
      title: "Data base",
      dataIndex: "startDate",
      key: "startDate",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Parcela",
      dataIndex: "installmentValue",
      key: "installmentValue",
      render: (value: number, record) =>
        `${formatCurrency(value)} (${record.installmentsTotal}x)`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: BillingStatus) => (
        <Tag color={statusColor[value]}>{statusLabel[value]}</Tag>
      ),
    },
    {
      title: "Acoes",
      key: "actions",
      render: (_, record) => (
        <Link href={`/cobrancas/${record.contractNumber}`}>
          <Button type="primary" size="small">
            Ver contrato
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <Typography.Text className="text-xs uppercase tracking-wide text-slate-500">
            Modulo de cobranca
          </Typography.Text>
          <Typography.Title level={2} className="!m-0">
            Pesquisa de contratos pagos
          </Typography.Title>
          <Typography.Paragraph className="!mt-2 max-w-2xl text-sm text-slate-600">
            Pesquise pelo nome do cliente, CPF ou CNPJ para localizar contratos
            que ja foram pagos no CRM e agora precisam de acompanhamento.
          </Typography.Paragraph>
        </div>

        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="w-full space-y-2 md:flex-[1.2]">
              <Typography.Text>Nome do cliente</Typography.Text>
              <Input
                placeholder="Digite o nome"
                value={nameFilter}
                onChange={(event) => setNameFilter(event.target.value)}
              />
            </div>
            <div className="w-full space-y-2 md:flex-1">
              <Typography.Text>CPF / CNPJ</Typography.Text>
              <Input
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                value={documentFilter}
                onChange={(event) => setDocumentFilter(event.target.value)}
              />
            </div>
            <div className="w-full space-y-2 md:flex-[0.7]">
              <Typography.Text>Status</Typography.Text>
              <Select
                allowClear
                placeholder="Todos"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                className="w-full"
                options={[
                  { value: "PAGO", label: "Pago" },
                  { value: "EM_ABERTO", label: "Em aberto" },
                  { value: "EM_ATRASO", label: "Em atraso" },
                ]}
              />
            </div>
            <div className="flex w-full justify-end md:w-auto">
              <Button onClick={() => {
                setNameFilter("");
                setDocumentFilter("");
                setStatusFilter(undefined);
              }}>
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        <Card
          title={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>Resultados de cobranca</span>
              <span className="text-xs text-slate-500">
                {contracts.length} contrato(s) encontrado(s)
              </span>
            </div>
          }
        >
          {error ? (
            <Empty description={error} />
          ) : contracts.length === 0 ? (
            <Empty description="Nenhum contrato encontrado com esses filtros." />
          ) : (
            <Table
              columns={columns}
              dataSource={contracts}
              rowKey="contractNumber"
              pagination={{ pageSize: 6 }}
              loading={isLoading}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
