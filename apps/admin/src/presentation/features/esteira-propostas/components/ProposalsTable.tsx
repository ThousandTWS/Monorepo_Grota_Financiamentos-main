import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/layout/components/ui/table";
import { ProposalQueueItem, ProposalQueueStatus } from "@/application/core/@types/Proposals/Proposal";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import { Skeleton } from "@/presentation/layout/components/ui/skeleton";
import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalsTableProps {
  proposals: ProposalQueueItem[];
  isLoading?: boolean;
}

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
    <div className="rounded-lg border bg-card" data-oid="8sfz6vm">
      <ScrollArea className="w-full" data-oid="hw3kivm">
        <Table className="min-w-[900px]" data-oid="3z1ykp_">
          <TableHeader data-oid="d35mw-6">
            <TableRow className="bg-muted/50" data-oid="6ijh_fe">
              <TableHead className="w-10" data-oid="jj9:.t4"></TableHead>
              <TableHead className="font-semibold" data-oid="8d1r-8c">
                Nome / CPF / Contrato
              </TableHead>
              <TableHead className="font-semibold" data-oid="2uqn9yp">
                Bem / Valor / Prazo / Parcela
              </TableHead>
              <TableHead className="font-semibold" data-oid="rdlwdis">
                Lojista
              </TableHead>
              <TableHead className="font-semibold" data-oid="dael1md">
                Banco / Produto
              </TableHead>
              <TableHead className="font-semibold" data-oid="32fajua">
                Status atual / Analista
              </TableHead>
              <TableHead className="font-semibold" data-oid="dgb6mzs">
                Enviado / Operador
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-oid="9nsnp5i">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} data-oid="aj9z6sr">
                    {Array.from({ length: 7 }).map((__, colIndex) => (
                      <TableCell key={colIndex} data-oid="yd:gdgg">
                        <Skeleton className="h-10 w-full" data-oid="2qhkcje" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : proposals.map((proposal) => {
                  const statusStyle = statusStyles[proposal.currentStatus.status];
                  return (
                    <TableRow key={proposal.id} className="align-top" data-oid="3ct3stm">
                      <TableCell className="pt-5" data-oid="9ozwobu">
                        <div className="flex items-start justify-center" data-oid="8r1laxp">
                          <div className="h-10 w-10 rounded-full border flex items-center justify-center text-muted-foreground" data-oid="6jpg7uv">
                            <Clock3 className="size-4" data-oid="7r9qr6f" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5" data-oid="53t:xqs">
                        <div className="space-y-1" data-oid="k56t1kz">
                          <p className="text-sm font-semibold uppercase tracking-tight" data-oid="8enb8ko">
                            {proposal.clientName}
                          </p>
                          <p className="text-xs text-muted-foreground" data-oid="24uhcky">
                            {proposal.clientDocument}
                          </p>
                          <p className="text-xs text-sky-600 font-medium" data-oid="oej459b">
                            Contrato: {proposal.contract}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5" data-oid="27ojbne">
                        <div className="space-y-1 text-sm" data-oid="5b7ic1f">
                          <p className="font-semibold uppercase" data-oid="t2sv70n">
                            {proposal.asset.brand}
                          </p>
                          <p className="text-xs text-muted-foreground" data-oid="g0l7p45">
                            {proposal.asset.model} ({proposal.asset.year})
                          </p>
                          <p className="text-xs text-muted-foreground" data-oid="p9t5o9-">
                            Entrada {formatCurrency(proposal.asset.entryValue)}
                          </p>
                          <p
                            className={cn(
                              "text-xs font-semibold",
                              proposal.asset.financedValue > 0
                                ? "text-emerald-600"
                                : "text-muted-foreground",
                            )}
                            data-oid="gsu687c"
                          >
                            {formatCurrency(proposal.asset.financedValue)} em{" "}
                            {proposal.asset.termMonths}x de{" "}
                            {formatCurrency(proposal.asset.installmentValue)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5" data-oid="j97vlmq">
                        <div className="text-sm" data-oid="57hep3s">
                          <p className="font-medium" data-oid="p-bmcoe">
                            {proposal.dealerName}
                          </p>
                          {proposal.dealerCode ? (
                            <p className="text-xs text-muted-foreground" data-oid="k9l7fzi">
                              Código {proposal.dealerCode}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="pt-5" data-oid="se2uotu">
                        <div className="text-sm space-y-1" data-oid="yp2y9z7">
                          <p className="font-semibold uppercase text-muted-foreground" data-oid="l7ptazy">
                            {proposal.productInfo.bank}
                          </p>
                          <p className="text-xs" data-oid="7w0mwey">
                            {proposal.productInfo.product}
                          </p>
                          <p className="text-xs" data-oid="4htebxh">
                            {proposal.productInfo.modality}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5" data-oid="nrd782b">
                        <div
                          className={cn(
                            "rounded-md px-3 py-2 text-sm space-y-1",
                            statusStyle.wrapper,
                            statusStyle.text,
                          )}
                          data-oid="1wv4z4y"
                        >
                          <p className="font-semibold" data-oid="ic2hqze">
                            {proposal.currentStatus.label}
                          </p>
                          <p className="text-xs" data-oid="jml9kzs">
                            {formatDateTime(proposal.currentStatus.updatedAt)}
                          </p>
                          <p className="text-xs font-semibold uppercase" data-oid="8matwn9">
                            {proposal.currentStatus.analyst}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5" data-oid="lqspzvr">
                        <div className="text-sm space-y-1" data-oid="phckpx9">
                          <p className="font-semibold" data-oid="ymnyudh">
                            {formatDateTime(proposal.operatorSentAt)}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase font-medium" data-oid="bo1y-rg">
                            {proposal.operatorName}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            {!isLoading && proposals.length === 0 ? (
              <TableRow data-oid="bo8m8cm">
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground" data-oid="f7roskd">
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
