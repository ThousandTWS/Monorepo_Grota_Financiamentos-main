"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Empty,
  Input,
  List,
  message,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type {
  BillingContractDetails,
  BillingInstallment,
  BillingOccurrence,
  BillingStatus,
} from "@/application/core/@types/Billing/Billing";
import {
  createBillingOccurrence,
  getBillingContractDetails,
  updateBillingInstallment,
} from "@/application/services/Billing/billingService";


type Params = Promise<{
  contractId: string;
}>;

const { TextArea } = Input;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T00:00:00`));

const statusColor: Record<BillingStatus, string> = {
  PAGO: "green",
  EM_ABERTO: "blue",
  EM_ATRASO: "red",
};

const getDaysLate = (dueDate: string, paid: boolean) => {
  if (paid) return 0;
  const today = new Date();
  const due = new Date(`${dueDate}T00:00:00`);
  const diffMs = today.getTime() - due.getTime();
  return diffMs > 0 ? Math.floor(diffMs / 86400000) : 0;
};

export default function ContractDetailsPage({ params }: { params: Params }) {
  const resolvedParams = use(params);
  const contractId = resolvedParams.contractId;

  const [contract, setContract] = useState<BillingContractDetails | null>(null);
  const [installments, setInstallments] = useState<BillingInstallment[]>([]);
  const [occurrences, setOccurrences] = useState<BillingOccurrence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingInstallment, setIsUpdatingInstallment] = useState<number | null>(null);
  const [isAddingOccurrence, setIsAddingOccurrence] = useState(false);
  const [occurrenceDate, setOccurrenceDate] = useState<string>("");
  const [occurrenceContact, setOccurrenceContact] = useState("");
  const [occurrenceNote, setOccurrenceNote] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getBillingContractDetails(contractId);
        if (!active) return;
        setContract(data);
        setInstallments(data.installments);
        setOccurrences(data.occurrences);
      } catch (err) {
        if (!active) return;
        setContract(null);
        setInstallments([]);
        setOccurrences([]);
        setError(err instanceof Error ? err.message : "Falha ao carregar contrato.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [contractId]);

  useEffect(() => {
    setOccurrenceDate("");
    setOccurrenceContact("");
    setOccurrenceNote("");
  }, [contract?.contractNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">
        <Card className="mx-auto max-w-3xl">
          <Typography.Paragraph>Carregando contrato...</Typography.Paragraph>
        </Card>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">
        <Card className="mx-auto max-w-3xl">
          <Empty description={error ?? "Contrato nao encontrado."} />
          <div className="mt-4 flex justify-center">
            <Link href="/cobrancas">
              <Button type="primary">Voltar para cobrancas</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const installmentsColumns: ColumnsType<BillingInstallment> = [
    {
      title: "Parcela",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Vencimento",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Status",
      dataIndex: "paid",
      key: "paid",
      render: (_value, record) => {
        const daysLate = getDaysLate(record.dueDate, record.paid);
        if (record.paid) return <Tag color="green">Pago</Tag>;
        if (daysLate > 0) return <Tag color="red">Em atraso</Tag>;
        return <Tag color="blue">Em aberto</Tag>;
      },
    },
    {
      title: "Dias em atraso",
      key: "daysLate",
      render: (_value, record) => {
        const daysLate = getDaysLate(record.dueDate, record.paid);
        return daysLate ? `${daysLate} dia(s)` : "-";
      },
    },
    {
      title: "Valor",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Pago",
      key: "toggle",
      render: (_value, record) => (
        <Switch
          checked={record.paid}
          loading={isUpdatingInstallment === record.number}
          onChange={async (checked) => {
            setIsUpdatingInstallment(record.number);
            try {
              const updated = await updateBillingInstallment(
                contract.contractNumber,
                record.number,
                { paid: checked },
              );
              setInstallments((prev) =>
                prev.map((item) =>
                  item.number === record.number ? updated : item,
                ),
              );
            } catch (err) {
              message.error(
                err instanceof Error
                  ? err.message
                  : "Nao foi possivel atualizar a parcela.",
              );
            } finally {
              setIsUpdatingInstallment(null);
            }
          }}
        />
      ),
    },
  ];

  const handleAddOccurrence = async () => {
    if (!occurrenceDate || !occurrenceContact.trim() || !occurrenceNote.trim()) {
      message.error("Preencha data, contato e ocorrencia.");
      return;
    }
    setIsAddingOccurrence(true);
    try {
      const created = await createBillingOccurrence(contract.contractNumber, {
        date: dayjs(occurrenceDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
        contact: occurrenceContact.trim(),
        note: occurrenceNote.trim(),
      });
      setOccurrences((prev) => [created, ...prev]);
      setOccurrenceDate("");
      setOccurrenceContact("");
      setOccurrenceNote("");
      message.success("Ocorrencia registrada.");
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : "Nao foi possivel registrar a ocorrencia.",
      );
    } finally {
      setIsAddingOccurrence(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Typography.Text className="text-xs uppercase tracking-wide text-slate-500">
              Cobrança / Contrato {contract.contractNumber}
            </Typography.Text>
            <Typography.Title level={2} className="!m-0">
              {contract.customer.name}
            </Typography.Title>
            <Typography.Paragraph className="!mt-2 text-sm text-slate-600">
              Acompanhe as parcelas, status de pagamento e ocorrencias de contato.
            </Typography.Paragraph>
          </div>
          <Link href="/cobrancas">
            <Button>Voltar para cobrancas</Button>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <Descriptions title="Dados do cliente" column={2}>
              <Descriptions.Item label="Nome">{contract.customer.name}</Descriptions.Item>
              <Descriptions.Item label="CPF/CNPJ">{contract.customer.document}</Descriptions.Item>
              <Descriptions.Item label="Nascimento">
                {contract.customer.birthDate
                  ? formatDate(contract.customer.birthDate)
                  : "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Contato">
                {contract.customer.phone ?? "--"}
              </Descriptions.Item>
              <Descriptions.Item label="E-mail">{contract.customer.email ?? "--"}</Descriptions.Item>
              <Descriptions.Item label="Endereco">
                {contract.customer.address ?? "--"}, {contract.customer.city ?? "--"}{" "}
                / {contract.customer.state ?? "--"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card>
            <Descriptions title="Resumo do contrato" column={1}>
              <Descriptions.Item label="Status">
                <Tag color={statusColor[contract.status]}>
                  {contract.status === "PAGO"
                    ? "Pago"
                    : contract.status === "EM_ABERTO"
                      ? "Em aberto"
                      : "Em atraso"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Numero da operacao">
                {contract.contractNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Data do pagamento">
                {formatDate(contract.paidAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Data base">
                {formatDate(contract.startDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Valor financiado">
                {formatCurrency(contract.financedValue)}
              </Descriptions.Item>
              <Descriptions.Item label="Parcela">
                {formatCurrency(contract.installmentValue)} ({contract.installmentsTotal}x)
              </Descriptions.Item>
            </Descriptions>
            {contract.otherContracts.length ? (
              <div className="mt-4">
                <Typography.Text className="text-xs uppercase tracking-wide text-slate-500">
                  Outras operacoes
                </Typography.Text>
                <div className="mt-2 flex flex-wrap gap-2">
                  {contract.otherContracts.map((item) => (
                    <Link key={item.contractNumber} href={`/cobrancas/${item.contractNumber}`}>
                      <Tag color="blue">{item.contractNumber}</Tag>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        <Tabs
          tabPosition="left"
          items={[
            {
              key: "dados",
              label: "Dados basicos",
              children: (
                <Card>
                  <Descriptions column={2}>
                    <Descriptions.Item label="Cliente">
                      {contract.customer.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Documento">
                      {contract.customer.document}
                    </Descriptions.Item>
                    <Descriptions.Item label="Data base">
                      {formatDate(contract.startDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Data de pagamento">
                      {formatDate(contract.paidAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Contato principal">
                      {contract.customer.phone ?? "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={statusColor[contract.status]}>
                        {contract.status === "PAGO"
                          ? "Pago"
                          : contract.status === "EM_ABERTO"
                            ? "Em aberto"
                            : "Em atraso"}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ),
            },
            {
              key: "operacao",
              label: "Operacao",
              children: (
                <Card>
                  <Descriptions column={2}>
                    <Descriptions.Item label="Numero do contrato">
                      {contract.contractNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Inicio do contrato">
                      {formatDate(contract.startDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Valor financiado">
                      {formatCurrency(contract.financedValue)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Parcelas">
                      {contract.installmentsTotal}x de {formatCurrency(contract.installmentValue)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Veiculo">
                      {contract.vehicle.brand ?? "--"} {contract.vehicle.model ?? ""}{" "}
                      {contract.vehicle.year ? `(${contract.vehicle.year})` : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Placa">
                      {contract.vehicle.plate ?? "--"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ),
            },
            {
              key: "parcelas",
              label: "Parcelas",
              children: (
                <Card>
                  <Typography.Paragraph className="text-sm text-slate-600">
                    Consulte as parcelas previstas e marque quando o cliente efetuar o pagamento.
                  </Typography.Paragraph>
                  <Table
                    columns={installmentsColumns}
                    dataSource={installments.map((item) => ({
                      ...item,
                      key: `${item.number}`,
                    }))}
                    pagination={false}
                  />
                </Card>
              ),
            },
            {
              key: "cliente",
              label: "Cliente",
              children: (
                <Card>
                  <Descriptions column={2}>
                    <Descriptions.Item label="Nome">
                      {contract.customer.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Documento">
                      {contract.customer.document}
                    </Descriptions.Item>
                    <Descriptions.Item label="Telefones">
                      {contract.customer.phone ?? "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label="E-mail">
                      {contract.customer.email ?? "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Endereco">
                      {contract.customer.address ?? "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Cidade">
                      {contract.customer.city ?? "--"} / {contract.customer.state ?? "--"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ),
            },
            {
              key: "ocorrencias",
              label: "Ocorrencias",
              children: (
                <Card>
                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <Typography.Text className="text-xs uppercase tracking-wide text-slate-500">
                        Historico de contato
                      </Typography.Text>
                      <List
                        className="mt-3"
                        dataSource={occurrences}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <div className="flex flex-wrap items-center gap-2">
                                  <Tag color="blue">
                                    {dayjs(item.date).format("DD/MM/YYYY")}
                                  </Tag>
                                  <span className="font-semibold">{item.contact}</span>
                                </div>
                              }
                              description={<span>{item.note}</span>}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                    <div>
                      <Typography.Text className="text-xs uppercase tracking-wide text-slate-500">
                        Nova ocorrencia
                      </Typography.Text>
                      <div className="mt-3 space-y-3">
                        <div>
                          <Typography.Text className="text-sm">Data do contato</Typography.Text>
                          <DatePicker
                            className="mt-1 w-full"
                            format="DD/MM/YYYY"
                            value={
                              occurrenceDate
                                ? dayjs(occurrenceDate, "DD/MM/YYYY")
                                : null
                            }
                            onChange={(value) =>
                              setOccurrenceDate(value ? value.format("DD/MM/YYYY") : "")
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text className="text-sm">Contato</Typography.Text>
                          <Input
                            className="mt-1"
                            placeholder="Nome de quem fez o contato"
                            value={occurrenceContact}
                            onChange={(event) => setOccurrenceContact(event.target.value)}
                          />
                        </div>
                        <div>
                          <Typography.Text className="text-sm">Ocorrencia</Typography.Text>
                          <TextArea
                            className="mt-1"
                            placeholder="Descricao do contato e combinados"
                            value={occurrenceNote}
                            onChange={(event) => setOccurrenceNote(event.target.value)}
                            rows={4}
                          />
                        </div>
                        <Button
                          type="primary"
                          onClick={handleAddOccurrence}
                          loading={isAddingOccurrence}
                        >
                          Registrar ocorrencia
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
