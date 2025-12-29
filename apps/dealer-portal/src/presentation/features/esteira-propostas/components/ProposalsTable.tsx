import { Proposal, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
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
import { StatusBadge } from "./status-badge";
import { ProposalTimelineSheet } from "./ProposalTimelineSheet";

type ProposalsTableProps = {
  proposals: Proposal[];
  isLoading?: boolean;
  dealersById?: Record<number, { name: string; enterprise?: string }>;
  sellersById?: Record<number, string>;
};

const statusLabels: Record<ProposalStatus, string> = {
  SUBMITTED: "Enviada",
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Recusada",
  PAID: "Paga",
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

const maskCpf = (cpf: string) => {
  const digits = cpf.replace(/\D/g, "").padStart(11, "0").slice(-11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export function ProposalsTable({
  proposals,
  isLoading,
  dealersById = {},
  sellersById = {},
}: ProposalsTableProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <ScrollArea className="w-full">
        <Table className="min-w-[1050px]">
          <TableHeader>
            <TableRow className="bg-slate-50 text-slate-600">
              <TableHead className="w-12" />
              <TableHead className="font-semibold">Nome / CPF</TableHead>
              <TableHead className="font-semibold">Valor</TableHead>
              <TableHead className="font-semibold">Lojista</TableHead>
              <TableHead className="font-semibold">FIPE</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Enviado / Operador</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: 7 }).map((__, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-12 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : proposals.map((proposal) => {
                  const hasNote = Boolean(proposal.notes?.trim());
                  return (
                    <TableRow
                      key={proposal.id}
                      className="align-top border-b hover:bg-slate-50/60 transition-colors"
                    >
                      <TableCell className="pt-5">
                        <div className="flex items-start justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 bg-slate-100">
                            <Clock3 className="size-4" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold uppercase tracking-tight text-[#134B73]">
                            {proposal.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {maskCpf(proposal.customerCpf)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-1 text-sm">
                          <p className="text-xs text-muted-foreground">
                            Valor financiado
                          </p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {formatCurrency(proposal.financedValue)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="text-sm">
                          <p className="font-medium">
                            {proposal.dealerId
                              ? dealersById[proposal.dealerId]?.name ??
                                `Lojista #${proposal.dealerId}`
                              : "Lojista não informado"}
                          </p>
                          {proposal.dealerId && dealersById[proposal.dealerId]?.enterprise ? (
                            <p className="text-xs text-muted-foreground">
                              {dealersById[proposal.dealerId]?.enterprise}
                            </p>
                          ) : null}
                          {proposal.vehiclePlate ? (
                            <p className="text-xs text-muted-foreground">
                              Placa {proposal.vehiclePlate}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="text-sm">
                          <p className="text-xs text-muted-foreground">FIPE</p>
                          <p className="font-semibold">
                            {formatCurrency(proposal.fipeValue)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-2 rounded-md border px-3 py-2 text-sm">
                          <StatusBadge
                            status={proposal.status}
                            className="shadow-none px-2.5 py-1 text-[11px]"
                          >
                            {statusLabels[proposal.status]}
                          </StatusBadge>
                          <p className="text-xs">
                            Atualizado em {formatDateTime(proposal.updatedAt)}
                          </p>
                          <p className="text-xs font-semibold uppercase">
                            Equipe Grota
                          </p>
                          <ProposalTimelineSheet proposalId={proposal.id} />
                          {proposal.status === "PENDING" || hasNote ? (
                            <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
                              <p className="mb-1 text-[10px] font-semibold uppercase text-slate-500">
                                Mensagem da analise
                              </p>
                              <p>
                                {hasNote
                                  ? proposal.notes
                                  : "Nenhuma mensagem registrada ainda."}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold">
                            {formatDateTime(proposal.createdAt)}
                          </p>
                          <p className="text-xs font-medium uppercase text-muted-foreground">
                            {proposal.sellerId
                              ? sellersById[proposal.sellerId] ??
                                `Vendedor #${proposal.sellerId}`
                              : "Vendedor não informado"}
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
