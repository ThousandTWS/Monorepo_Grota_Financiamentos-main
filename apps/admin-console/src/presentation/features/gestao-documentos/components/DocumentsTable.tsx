"use client";

import React, { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/layout/components/ui/dropdown-menu";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreVertical,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Document, DocumentStatus } from "@/application/core/@types/Documents/Document";
import { cn } from "@/lib/utils";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
import { DocumentReviewDialog } from "./DocumentReviewDialog";

interface DocumentsTableProps {
  documents: Document[];
  onStatusChange: (
    documentId: string,
    status: DocumentStatus,
    comments?: string,
  ) => void;
}

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  in_review: {
    label: "Em Análise",
    icon: Eye,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  approved: {
    label: "Aprovado",
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  },
  rejected: {
    label: "Reprovado",
    icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
};

const priorityConfig = {
  high: {
    label: "Alta",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
  medium: {
    label: "Média",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  low: {
    label: "Baixa",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
};

const documentTypeLabels: Record<string, string> = {
  rg: "RG",
  cpf: "CPF",
  cnh: "CNH",
  comprovante_residencia: "Comp. Residência",
  comprovante_renda: "Comp. Renda",
  crlv: "CRLV",
  contrato: "Contrato",
  outros: "Outros",
};

export function DocumentsTable({
  documents,
  onStatusChange,
}: DocumentsTableProps) {
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [reviewDoc, setReviewDoc] = useState<Document | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleApprove = (doc: Document) => {
    setReviewDoc(doc);
  };

  const handleReject = (doc: Document) => {
    setReviewDoc(doc);
  };

  const handleReview = (
    documentId: string,
    status: DocumentStatus,
    comments: string,
  ) => {
    onStatusChange(documentId, status, comments);
    setReviewDoc(null);
  };

  return (
    <>
      <div
        className="rounded-lg border bg-card overflow-hidden"
        data-oid="18p17wd"
      >
        <Table data-oid="_9hib4u">
          <TableHeader data-oid="qme:q3l">
            <TableRow className="bg-muted/50" data-oid="pafcxn_">
              <TableHead className="font-semibold" data-oid="kbx:qd0">
                Cliente
              </TableHead>
              <TableHead className="font-semibold" data-oid="9g:-8qn">
                Proposta
              </TableHead>
              <TableHead className="font-semibold" data-oid="l6wm.90">
                Tipo
              </TableHead>
              <TableHead className="font-semibold" data-oid="s4y-1cb">
                Arquivo
              </TableHead>
              <TableHead className="font-semibold" data-oid="21_0it:">
                Data Upload
              </TableHead>
              <TableHead className="font-semibold" data-oid="dojbibx">
                Prioridade
              </TableHead>
              <TableHead className="font-semibold" data-oid="y8ot8:u">
                Status
              </TableHead>
              <TableHead className="font-semibold" data-oid="gigp-vw">
                Tempo
              </TableHead>
              <TableHead
                className="text-center font-semibold"
                data-oid="ty-xh-u"
              >
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-oid="a8zavcm">
            {documents.map((doc) => {
              const StatusIcon = statusConfig[doc.status].icon;

              return (
                <TableRow
                  key={doc.id}
                  className="hover:bg-muted/30"
                  data-oid="s6re5-r"
                >
                  <TableCell data-oid="j:9k3h1">
                    <div className="space-y-1" data-oid="a-3q.a-">
                      <p className="font-medium text-sm" data-oid=":sh6bs6">
                        {doc.clientName}
                      </p>
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="b7u0diz"
                      >
                        {doc.clientCpf}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell data-oid="at8xlt7">
                    <span className="text-sm font-mono" data-oid="a97hvg2">
                      {doc.proposalId}
                    </span>
                  </TableCell>
                  <TableCell data-oid="q75j8y8">
                    <Badge
                      variant="outline"
                      className="font-medium"
                      data-oid="q5mpfl3"
                    >
                      {documentTypeLabels[doc.documentType]}
                    </Badge>
                  </TableCell>
                  <TableCell data-oid=".uy:.59">
                    <div className="flex items-center gap-2" data-oid="m73_15s">
                      <FileText
                        className="h-4 w-4 text-muted-foreground"
                        data-oid="g5_7z4-"
                      />

                      <div className="space-y-0.5" data-oid="mhs3qiy">
                        <p
                          className="text-sm font-medium truncate max-w-[150px]"
                          data-oid="7ui10r7"
                        >
                          {doc.fileName}
                        </p>
                        <p
                          className="text-xs text-muted-foreground"
                          data-oid="8hlmaji"
                        >
                          {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell data-oid="un69r3_">
                    <span className="text-sm" data-oid="jstyec-">
                      {formatDate(doc.uploadDate)}
                    </span>
                  </TableCell>
                  <TableCell data-oid="-r9n3po">
                    <Badge
                      className={cn(
                        "font-medium",
                        priorityConfig[doc.priority].className,
                      )}
                      data-oid="u-fv77c"
                    >
                      {priorityConfig[doc.priority].label}
                    </Badge>
                  </TableCell>
                  <TableCell data-oid="3j7cayc">
                    <Badge
                      className={cn(
                        "font-medium",
                        statusConfig[doc.status].className,
                      )}
                      data-oid="0dugx96"
                    >
                      <StatusIcon className="h-3 w-3 mr-1" data-oid="06p_-xm" />
                      {statusConfig[doc.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell data-oid=":jkc8u2">
                    <div className="flex items-center gap-1" data-oid="7mwom_k">
                      {doc.daysWaiting > 3 && (
                        <AlertCircle
                          className="h-4 w-4 text-amber-500"
                          data-oid="r8db61i"
                        />
                      )}
                      <span className="text-sm" data-oid="-hcep9v">
                        {doc.daysWaiting}{" "}
                        {doc.daysWaiting === 1 ? "dia" : "dias"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell data-oid="e28h-ek">
                    <div
                      className="flex items-center justify-center gap-2"
                      data-oid="7_.n-dy"
                    >
                      {doc.status === "pending" ||
                      doc.status === "in_review" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                            onClick={() => handleApprove(doc)}
                            data-oid="6k-s0re"
                          >
                            <CheckCircle
                              className="h-4 w-4 mr-1"
                              data-oid="n0odqhz"
                            />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => handleReject(doc)}
                            data-oid="7iwv.q7"
                          >
                            <XCircle
                              className="h-4 w-4 mr-1"
                              data-oid=":.cvrjo"
                            />
                            Reprovar
                          </Button>
                        </>
                      ) : (
                        <Badge
                          variant="outline"
                          className="h-8"
                          data-oid=":h595m_"
                        >
                          {doc.status === "approved"
                            ? "✓ Finalizado"
                            : "✗ Finalizado"}
                        </Badge>
                      )}

                      <DropdownMenu data-oid="zu-o74m">
                        <DropdownMenuTrigger asChild data-oid="epov.39">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            data-oid="400uhx3"
                          >
                            <MoreVertical
                              className="h-4 w-4"
                              data-oid="gj_ed.5"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" data-oid="y0i7iw5">
                          <DropdownMenuItem
                            onClick={() => setPreviewDoc(doc)}
                            data-oid="9bae8b-"
                          >
                            <Eye className="h-4 w-4 mr-2" data-oid="co197.." />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem data-oid="v8nmqbk">
                            <Download
                              className="h-4 w-4 mr-2"
                              data-oid="1.r-ro7"
                            />
                            Baixar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator data-oid="9g-s6k6" />
                          {doc.comments && (
                            <DropdownMenuItem data-oid="v5qaba9">
                              <FileText
                                className="h-4 w-4 mr-2"
                                data-oid="9mh-42u"
                              />
                              Ver Comentários
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {previewDoc && (
        <DocumentPreviewDialog
          document={previewDoc}
          open={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          data-oid="ys1p5af"
        />
      )}

      {reviewDoc && (
        <DocumentReviewDialog
          document={reviewDoc}
          open={!!reviewDoc}
          onClose={() => setReviewDoc(null)}
          onReview={handleReview}
          data-oid="v3sogrp"
        />
      )}
    </>
  );
}
