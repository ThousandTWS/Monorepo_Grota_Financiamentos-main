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
import { Clock3 } from "lucide-react";
import { StatusBadge } from "../../logista/components/status-badge";
import { ProposalTimelineSheet } from "./ProposalTimelineSheet";

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
  return (
    <div className="rounded-lg border bg-card shadow-sm" data-oid="admin-table">
      <ScrollArea className="w-full" data-oid="scroll">
        <Table className="min-w-[1050px]" data-oid="table">
          <TableHeader data-oid="thead">
            <TableRow className="bg-slate-50 text-slate-600" data-oid="header-row">
              <TableHead className="w-12" />
              <TableHead>Nome / CPF</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Lojista</TableHead>
              <TableHead>FIPE</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enviado / Operador</TableHead>
            </TableRow>
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
              : proposals.map((proposal) => {
                  return (
                    <TableRow
                      key={proposal.id}
                      className="align-top border-b hover:bg-slate-50/60 transition-colors"
                      data-oid="data-row"
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
                              ? dealersById[proposal.dealerId]?.enterprise ??
                                dealersById[proposal.dealerId]?.name ??
                                `Lojista #${proposal.dealerId}`
                              : "Lojista não informado"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {proposal.sellerId
                              ? sellersById[proposal.sellerId] ??
                                `Responsável #${proposal.sellerId}`
                              : "Responsável não informado"}
                          </p>
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
                      <TableCell className="pt-5 space-y-2">
                        <div className="space-y-2 rounded-md border px-3 py-2 text-sm">
                          <StatusBadge
                            status={proposal.status}
                            className="shadow-none px-2.5 py-1 text-[11px]"
                          >
                            {proposalStatusLabels[proposal.status]}
                          </StatusBadge>
                          <p className="text-xs text-muted-foreground">
                            Atualizado em {formatDateTime(proposal.updatedAt)}
                          </p>
                          <p className="text-xs font-semibold uppercase">
                            Operações Grota
                          </p>
                          <ProposalTimelineSheet proposalId={proposal.id} />
                        </div>
                        <Select
                          value={proposal.status}
                          onValueChange={(value) =>
                            onStatusChange(proposal, value as ProposalStatus)
                          }
                          disabled={updatingId === proposal.id}
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
                      </TableCell>
                      <TableCell className="pt-5 text-sm">
                        <div className="space-y-1">
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
