import { Proposal, ProposalStatus } from "@/application/core/@types/Proposals/Proposal";
import { Button } from "@/presentation/layout/components/ui/button";
import { Card, CardContent, CardHeader } from "@/presentation/layout/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/layout/components/ui/select";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import { Skeleton } from "@/presentation/layout/components/ui/skeleton";
import { Textarea } from "@/presentation/layout/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/presentation/layout/components/ui/alert-dialog";
import { StatusBadge } from "../../logista/components/status-badge";
import { Clock3, Eye, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ProposalsTableProps = {
  proposals: Proposal[];
  isLoading?: boolean;
  updatingId: number | null;
  deletingId?: number | null;
  noteDrafts: Record<number, string>;
  savingNoteId?: number | null;
  onStatusChange: (proposal: Proposal, status: ProposalStatus) => void;
  onDelete: (proposal: Proposal) => Promise<void> | void;
  onNoteChange: (proposalId: number, value: string) => void;
  onNoteSave: (proposal: Proposal) => Promise<void> | void;
  dealersById?: Record<number, { name: string; enterprise?: string }>;
  sellersById?: Record<number, string>;
};

const proposalStatusLabels: Record<ProposalStatus, string> = {
  SUBMITTED: "Enviada",
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Recusada",
};

const statusOptions: ProposalStatus[] = ["SUBMITTED", "PENDING", "APPROVED", "REJECTED"];

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
  deletingId = null,
  noteDrafts,
  savingNoteId = null,
  onStatusChange,
  onDelete,
  onNoteChange,
  onNoteSave,
  dealersById = {},
  sellersById = {},
}: ProposalsTableProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Proposal | null>(null);

  const handleOpenDelete = (proposal: Proposal) => {
    setDeleteTarget(proposal);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await Promise.resolve(onDelete(deleteTarget));
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const cards = useMemo(() => {
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={`skeleton-${index}`}>
            <CardHeader className="space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent className="grid gap-2">
              {Array.from({ length: 4 }).map((__, cellIndex) => (
                <Skeleton key={cellIndex} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="text-center text-sm text-muted-foreground">
          Nenhuma proposta encontrada com os filtros selecionados.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((proposal) => (
        <Card key={proposal.id} className="bg-gradient-to-br from-white via-slate-50 to-white shadow-sm">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {proposal.customerCpf ? maskCpf(proposal.customerCpf) : "CPF não informado"}
              </p>
              <h3 className="text-lg font-semibold text-[#134B73]">{proposal.customerName}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                <Clock3 className="size-4" />
                {formatDateTime(proposal.createdAt)}
              </div>
              <StatusBadge status={proposal.status} className="px-3 py-1 text-xs shadow-none" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Lojista</p>
                  <p className="font-semibold text-slate-700">{proposal.dealerLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Operador</p>
                  <p className="font-semibold text-slate-700">{proposal.sellerLabel}</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="space-y-1 rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm">
                  <p className="text-xs text-muted-foreground">Valor financiado</p>
                  <p className="font-semibold text-emerald-600">{formatCurrency(proposal.financedValue)}</p>
                </div>
                <div className="space-y-1 rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm">
                  <p className="text-xs text-muted-foreground">Valor FIPE</p>
                  <p className="font-semibold text-slate-700">{formatCurrency(proposal.fipeValue)}</p>
                </div>
                <div className="space-y-1 rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm">
                  <p className="text-xs text-muted-foreground">Status atualizado</p>
                  <p className="font-semibold text-slate-700">{formatDateTime(proposal.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Select
                value={proposal.status}
                onValueChange={(value) =>
                  onStatusChange(proposal, value as ProposalStatus)
                }
                disabled={updatingId === proposal.id}
              >
                <SelectTrigger className="w-full text-xs">
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
              {proposal.status === "PENDING" ? (
                <div className="space-y-2 rounded-lg border border-slate-200 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Mensagem para a loja
                  </p>
                  <Textarea
                    value={noteDrafts[proposal.id] ?? proposal.notes ?? ""}
                    onChange={(event) =>
                      onNoteChange(proposal.id, event.target.value)
                    }
                    placeholder="Ex.: Santander recusou, BV recusou, Banco do Brasil em análise."
                    className="min-h-20 text-sm"
                    disabled={savingNoteId === proposal.id}
                  />
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onNoteSave(proposal)}
                    disabled={savingNoteId === proposal.id}
                  >
                    {savingNoteId === proposal.id ? "Salvando..." : "Salvar mensagem"}
                  </Button>
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    router.push(`/esteira-de-propostas/${proposal.id}/historico`)
                  }
                >
                  <Eye className="size-4" />
                  Ver histórico
                </Button>
                <Button
                  variant="ghost"
                  className="gap-2 border border-dashed border-slate-300"
                  onClick={() => {
                    router.push(`/esteira-de-propostas/${proposal.id}`);
                  }}
                >
                  <RefreshCw className="size-4" />
                  Sincronizar
                </Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => handleOpenDelete(proposal)}
                  disabled={deletingId === proposal.id}
                >
                  <Trash2 className="size-4" />
                  Excluir proposta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a proposta de{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.customerName ?? "--"}
              </span>
              ? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId === deleteTarget?.id}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deletingId === deleteTarget?.id}
            >
              {deletingId === deleteTarget?.id ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
