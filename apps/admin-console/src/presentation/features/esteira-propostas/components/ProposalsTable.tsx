/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Proposal, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/layout/components/ui/table";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import { Skeleton } from "@/presentation/layout/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/layout/components/ui/select";
import { Button } from "@/presentation/layout/components/ui/button";
import { Clock3 } from "lucide-react";
import { StatusBadge } from "../../logista/components/status-badge";

type ProposalsTableProps = {
  proposals: Proposal[];
  isLoading?: boolean;
  updatingId: number | null;
  onStatusChange: (proposal: Proposal, status: ProposalStatus) => void;
  dealersById?: Record<number, { name: string; enterprise?: string }>;
  sellersById?: Record<number, string>;
};

const proposalStatusLabels: Record<ProposalStatus, string> = {
  SUBMITTED: "Enviada",
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Recusada",
};

const statusOptions: ProposalStatus[] = [
  "SUBMITTED",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const maskCpf = (cpf: string) => {
  const digits = cpf.replace(/\D/g, "").padStart(11, "0").slice(-11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export function ProposalsTable({
  proposals,
  isLoading,
  updatingId,
  onStatusChange,
  dealersById = {},
  sellersById = {},
}: ProposalsTableProps) {
  const router = useRouter();

  const data = useMemo(() => {
    return proposals.map((proposal) => {
      const dealerLabel = proposal.dealerId
        ? dealersById[proposal.dealerId]?.enterprise ??
          dealersById[proposal.dealerId]?.name ??
          `Lojista #${proposal.dealerId}`
        : "Lojista não informado";
      const sellerLabel = proposal.sellerId
        ? sellersById[proposal.sellerId] ?? `Responsável #${proposal.sellerId}`
        : "Responsável não informado";

      return {
        ...proposal,
        dealerLabel,
        sellerLabel,
      };
    });
  }, [dealersById, proposals, sellersById]);

  const columnHelper = createColumnHelper<typeof data[number]>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "icon",
        header: () => null,
        cell: () => (
          <div className="flex items-start justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500">
              <Clock3 className="size-4" />
            </div>
          </div>
        ),
        size: 48,
      }),
      columnHelper.accessor("customerName", {
        header: "Nome / CPF",
        cell: (ctx) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-tight text-[#134B73]">
              {ctx.getValue()}
            </p>
            <p className="text-xs text-muted-foreground">
              {maskCpf(ctx.row.original.customerCpf)}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("financedValue", {
        header: "Valor",
        cell: (ctx) => (
          <div className="space-y-1 text-sm">
            <p className="text-xs text-muted-foreground">Valor financiado</p>
            <p className="text-sm font-semibold text-emerald-600">
              {formatCurrency(ctx.getValue())}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("dealerLabel", {
        header: "Lojista",
        cell: (ctx) => (
          <div className="text-sm">
            <p className="font-medium">{ctx.getValue()}</p>
            <p className="text-xs text-muted-foreground">
              {ctx.row.original.sellerId
                ? sellersById[ctx.row.original.sellerId] ??
                  `Responsável #${ctx.row.original.sellerId}`
                : "Responsável não informado"}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("fipeValue", {
        header: "FIPE",
        cell: (ctx) => (
          <div className="text-sm">
            <p className="text-xs text-muted-foreground">FIPE</p>
            <p className="font-semibold">{formatCurrency(ctx.getValue())}</p>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (ctx) => (
          <div className="space-y-2">
            <div className="space-y-3 rounded-md border px-3 py-2 text-sm">
              <StatusBadge
                status={ctx.getValue()}
                className="shadow-none px-2.5 py-1 text-[11px]"
              >
                {proposalStatusLabels[ctx.getValue()]}
              </StatusBadge>
              <p className="text-xs text-muted-foreground">
                Atualizado em {formatDateTime(ctx.row.original.updatedAt)}
              </p>
              <p className="text-xs font-semibold uppercase">Operações Grota</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center gap-2 border-[#0F456A] bg-[#134B73] text-white hover:bg-[#0F456A] hover:text-white"
                onClick={() =>
                  router.push(`/esteira-de-propostas/${ctx.row.original.id}/historico`)
                }
              >
                Histórico
              </Button>
            </div>
            <Select
              value={ctx.getValue()}
              onValueChange={(value) =>
                onStatusChange(ctx.row.original, value as ProposalStatus)
              }
              disabled={updatingId === ctx.row.original.id}
            >
              <SelectTrigger className="w-full text-xs" data-oid="status-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {proposalStatusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ),
        size: 260,
      }),
      columnHelper.display({
        id: "meta",
        header: "Enviado / Operador",
        cell: (ctx) => (
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{formatDateTime(ctx.row.original.createdAt)}</p>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {ctx.row.original.sellerId
                ? sellersById[ctx.row.original.sellerId] ??
                  `Vendedor #${ctx.row.original.sellerId}`
                : "Vendedor não informado"}
            </p>
          </div>
        ),
      }),
    ],
    [columnHelper, onStatusChange, sellersById, updatingId],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border bg-card shadow-sm" data-oid="admin-table">
      <ScrollArea className="w-full" data-oid="scroll">
        <Table className="min-w-[1050px]" data-oid="table">
          <TableHeader data-oid="thead">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-slate-50 text-slate-600"
                data-oid="header-row"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() ?? undefined }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody data-oid="tbody">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} data-oid="skeleton-row">
                    {Array.from({ length: 7 }).map((__, colIndex) => (
                      <TableCell key={colIndex} data-oid="skeleton-cell">
                        <Skeleton className="h-12 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="align-top border-b hover:bg-slate-50/60 transition-colors"
                    data-oid="data-row"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="pt-5 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            {!isLoading && proposals.length === 0 ? (
              <TableRow data-oid="empty-row">
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Nenhuma proposta encontrada com os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
