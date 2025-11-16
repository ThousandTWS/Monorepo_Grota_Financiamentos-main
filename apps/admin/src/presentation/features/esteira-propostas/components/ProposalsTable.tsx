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
import { cn } from "@/lib/utils";

type ProposalsTableProps = {
  proposals: Proposal[];
  isLoading?: boolean;
  updatingId: number | null;
  onStatusChange: (proposal: Proposal, status: ProposalStatus) => void;
};

const statusStyles: Record<
  ProposalStatus,
  { wrapper: string; text: string; label: string }
> = {
  SUBMITTED: {
    wrapper: "bg-sky-100 border-l-4 border-sky-500",
    text: "text-sky-700",
    label: "Enviada",
  },
  PENDING: {
    wrapper: "bg-amber-100 border-l-4 border-amber-500",
    text: "text-amber-700",
    label: "Pendente",
  },
  APPROVED: {
    wrapper: "bg-emerald-100 border-l-4 border-emerald-500",
    text: "text-emerald-700",
    label: "Aprovada",
  },
  REJECTED: {
    wrapper: "bg-red-100 border-l-4 border-red-500",
    text: "text-red-700",
    label: "Recusada",
  },
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
}: ProposalsTableProps) {
  return (
    <div className="rounded-lg border bg-card" data-oid="admin-table">
      <ScrollArea className="w-full" data-oid="scroll">
        <Table className="min-w-[950px]" data-oid="table">
          <TableHeader data-oid="thead">
            <TableRow className="bg-muted/50" data-oid="header-row">
              <TableHead className="w-10" />
              <TableHead>Nome / CPF / Proposta</TableHead>
              <TableHead>Bem / Valor / Prazo / Parcela</TableHead>
              <TableHead>Lojista</TableHead>
              <TableHead>Banco / Produto</TableHead>
              <TableHead>Status atual / Analista</TableHead>
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
                  const statusStyle = statusStyles[proposal.status];

                  return (
                    <TableRow key={proposal.id} className="align-top" data-oid="data-row">
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
                            {proposal.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {maskCpf(proposal.customerCpf)}
                          </p>
                          <p className="text-xs font-medium text-sky-600">
                            Proposta #{proposal.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold uppercase">
                            {proposal.vehicleBrand}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {proposal.vehicleModel} ({proposal.vehicleYear})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Entrada {formatCurrency(proposal.downPaymentValue)}
                          </p>
                          <p className="text-xs font-semibold text-emerald-600">
                            {formatCurrency(proposal.financedValue)} financiado
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="text-sm">
                          <p className="font-medium">
                            Dealer #{proposal.dealerId ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Seller #{proposal.sellerId ?? "—"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Banco parceiro</p>
                          <p>Produto personalizado</p>
                          <p className="text-xs">FIPE {proposal.fipeCode}</p>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5 space-y-2">
                        <div
                          className={cn(
                            "space-y-1 rounded-md px-3 py-2 text-sm",
                            statusStyle.wrapper,
                            statusStyle.text,
                          )}
                        >
                          <p className="font-semibold">
                            {statusStyle.label}
                          </p>
                          <p className="text-xs">
                            Atualizado em {formatDateTime(proposal.updatedAt)}
                          </p>
                          <p className="text-xs font-semibold uppercase">
                            Operações Grota
                          </p>
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
                                {statusStyles[status].label}
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
                            Seller #{proposal.sellerId ?? "—"}
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
