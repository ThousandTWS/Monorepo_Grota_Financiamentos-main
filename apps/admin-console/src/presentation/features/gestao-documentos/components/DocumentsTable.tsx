"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/layout/components/ui/table";
import { Button } from "@/presentation/layout/components/ui/button";
import { Badge } from "@/presentation/layout/components/ui/badge";
import {
  ArrowDownToLine,
  CheckCircle,
  Clock,
  FileWarning,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  DocumentRecord,
  ReviewStatus,
} from "@/application/core/@types/Documents/Document";
import { DOCUMENT_TYPE_LABELS } from "@/presentation/features/gestao-documentos/data/documentLabels";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ReviewStatus,
  { label: string; tone: string; bg: string; Icon: React.ElementType }
> = {
  PENDENTE: {
    label: "Pendente",
    tone: "text-amber-700",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    Icon: Clock,
  },
  APROVADO: {
    label: "Aprovado",
    tone: "text-emerald-700",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    Icon: CheckCircle,
  },
  REPROVADO: {
    label: "Reprovado",
    tone: "text-rose-700",
    bg: "bg-rose-100 dark:bg-rose-900/40",
    Icon: XCircle,
  },
};

interface DocumentsTableProps {
  documents: DocumentRecord[];
  isLoading: boolean;
  onDownload: (document: DocumentRecord) => void;
  onRequestReview: (document: DocumentRecord, status: ReviewStatus) => void;
  onForceRefresh?: () => void;
}

export function DocumentsTable({
  documents,
  isLoading,
  onDownload,
  onRequestReview,
  onForceRefresh,
}: DocumentsTableProps) {
  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSize = (size: number) => {
    if (!size) return "—";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border py-16 text-muted-foreground">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        Carregando documentos...
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <FileWarning className="h-8 w-8" />
        <div className="space-y-1">
          <p className="font-medium text-foreground">Nenhum documento encontrado</p>
          <p className="text-sm text-muted-foreground">
            Assim que um lojista enviar algum arquivo ele aparecerá aqui instantaneamente.
          </p>
        </div>
        {onForceRefresh && (
          <Button variant="outline" onClick={onForceRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Enviado em</TableHead>
            <TableHead>Atualizado em</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Observações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => {
            const status = statusConfig[document.reviewStatus];
            return (
              <TableRow key={document.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {DOCUMENT_TYPE_LABELS[document.documentType]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {document.contentType ?? "—"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("gap-1", status.bg, status.tone, "font-medium")}>
                    <status.Icon className="h-3.5 w-3.5" />
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(document.createdAt)}</TableCell>
                <TableCell>{formatDate(document.updatedAt)}</TableCell>
                <TableCell>{formatSize(document.sizeBytes)}</TableCell>
                <TableCell className="max-w-xs text-sm text-muted-foreground">
                  {document.reviewComment ?? "Sem observações"}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownload(document)}
                  >
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Abrir
                  </Button>
                  {document.reviewStatus !== "APROVADO" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onRequestReview(document, "APROVADO")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprovar
                    </Button>
                  )}
                  {document.reviewStatus !== "REPROVADO" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-600 hover:text-rose-600"
                      onClick={() => onRequestReview(document, "REPROVADO")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reprovar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
