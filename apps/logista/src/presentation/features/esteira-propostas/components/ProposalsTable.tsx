import { ProposalQueueItem, ProposalQueueStatus } from "@/application/core/@types/Proposals/Proposal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/ui/table";
import { ScrollArea } from "@/presentation/ui/scroll-area";
import { Skeleton } from "@/presentation/ui/skeleton";
import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

type ProposalsTableProps = {
  proposals: ProposalQueueItem[];
  isLoading?: boolean;
};

const statusStyles: Record<
  ProposalQueueStatus,
  { wrapper: string; text: string }
> = {
  triage: {
    wrapper: "bg-sky-100 border-l-4 border-sky-500",
    text: "text-sky-700",
  },
  awaiting_input: {
    wrapper: "bg-slate-100 border-l-4 border-slate-500",
    text: "text-slate-700",
  },
  analysis: {
    wrapper: "bg-amber-100 border-l-4 border-amber-500",
    text: "text-amber-700",
  },
  filling: {
    wrapper: "bg-cyan-100 border-l-4 border-cyan-500",
    text: "text-cyan-700",
  },
  sent: {
    wrapper: "bg-violet-100 border-l-4 border-violet-500",
    text: "text-violet-700",
  },
  pre_approved: {
    wrapper: "bg-emerald-100 border-l-4 border-emerald-500",
    text: "text-emerald-700",
  },
  rejected: {
    wrapper: "bg-red-100 border-l-4 border-red-500",
    text: "text-red-700",
  },
  awaiting_payment: {
    wrapper: "bg-orange-100 border-l-4 border-orange-500",
    text: "text-orange-700",
  },
  paid: {
    wrapper: "bg-green-100 border-l-4 border-green-500",
    text: "text-green-700",
  },
};

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

export function ProposalsTable({ proposals, isLoading }: ProposalsTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <ScrollArea className="w-full">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10" />
              <TableHead className="font-semibold">
                Nome / CPF / Contrato
              </TableHead>
              <TableHead className="font-semibold">
                Bem / Valor / Prazo / Parcela
              </TableHead>
              <TableHead className="font-semibold">Lojista</TableHead>
              <TableHead className="font-semibold">Banco / Produto</TableHead>
              <TableHead className="font-semibold">
                Status atual / Analista
              </TableHead>
              <TableHead className="font-semibold">
                Enviado / Operador
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: 7 }).map((__, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : proposals.map((proposal) => {
                  const statusStyle = statusStyles[proposal.currentStatus.status];
                  return (
                    <TableRow key={proposal.id} className="align-top">
                      <TableCell className="pt-5">
                        <div className="flex items-start justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border text-muted-foreground">
                            <Clock3 className="size-4" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold uppercase tracking-tight">
                            {proposal.clientName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {proposal.clientDocument}
                          </p>
                          <p className="text-xs font-medium text-sky-600">
                            Contrato: {proposal.contract}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold uppercase">
                            {proposal.asset.brand}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {proposal.asset.model} ({proposal.asset.year})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Entrada {formatCurrency(proposal.asset.entryValue)}
                          </p>
                          <p
                            className={cn(
                              "text-xs font-semibold",
                              proposal.asset.financedValue > 0
                                ? "text-emerald-600"
                                : "text-muted-foreground",
                            )}
                          >
                            {formatCurrency(proposal.asset.financedValue)} em{" "}
                            {proposal.asset.termMonths}x de{" "}
                            {formatCurrency(proposal.asset.installmentValue)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="text-sm">
                          <p className="font-medium">{proposal.dealerName}</p>
                          {proposal.dealerCode ? (
                            <p className="text-xs text-muted-foreground">
                              Código {proposal.dealerCode}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold uppercase text-muted-foreground">
                            {proposal.productInfo.bank}
                          </p>
                          <p className="text-xs">{proposal.productInfo.product}</p>
                          <p className="text-xs">{proposal.productInfo.modality}</p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div
                          className={cn(
                            "space-y-1 rounded-md px-3 py-2 text-sm",
                            statusStyle.wrapper,
                            statusStyle.text,
                          )}
                        >
                          <p className="font-semibold">
                            {proposal.currentStatus.label}
                          </p>
                          <p className="text-xs">
                            {formatDateTime(proposal.currentStatus.updatedAt)}
                          </p>
                          <p className="text-xs font-semibold uppercase">
                            {proposal.currentStatus.analyst}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold">
                            {formatDateTime(proposal.operatorSentAt)}
                          </p>
                          <p className="text-xs font-medium uppercase text-muted-foreground">
                            {proposal.operatorName}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            {!isLoading && proposals.length === 0 ? (
              <TableRow>
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
