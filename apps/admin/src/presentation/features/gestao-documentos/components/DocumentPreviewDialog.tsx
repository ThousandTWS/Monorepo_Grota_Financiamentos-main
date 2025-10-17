"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/presentation/layout/components/ui/dialog";
import { Button } from "@/presentation/layout/components/ui/button";
import { Badge } from "@/presentation/layout/components/ui/badge";
import { Separator } from "@/presentation/layout/components/ui/separator";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import {
  Download,
  FileText,
  User,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { Document } from "@/application/core/@types/Documents/Document";
import { cn } from "@/lib/utils";

interface DocumentPreviewDialogProps {
  document: Document;
  open: boolean;
  onClose: () => void;
}

const documentTypeLabels: Record<string, string> = {
  rg: "RG",
  cpf: "CPF",
  cnh: "CNH",
  comprovante_residencia: "Comprovante de Residência",
  comprovante_renda: "Comprovante de Renda",
  crlv: "CRLV",
  contrato: "Contrato",
  outros: "Outros",
};

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

export function DocumentPreviewDialog({
  document,
  open,
  onClose,
}: DocumentPreviewDialogProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const StatusIcon = statusConfig[document.status].icon;

  return (
    <Dialog open={open} onOpenChange={onClose} data-oid="q05ngk0">
      <DialogContent className="max-w-7xl max-h-[95vh] p-0" data-oid="w3wex9y">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4" data-oid="tux3w63">
          <div
            className="flex items-start justify-between gap-4"
            data-oid="zgjxzrn"
          >
            <div className="space-y-2" data-oid="b3fjud_">
              <DialogTitle className="text-2xl font-bold" data-oid="t_wsc7a">
                Visualização de Documento
              </DialogTitle>
              <DialogDescription className="text-base" data-oid="x.zs7gz">
                {document.fileName}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2" data-oid="bqyhn.2">
              <Badge
                className={cn(
                  "font-medium",
                  statusConfig[document.status].className,
                )}
                data-oid=".2qp__c"
              >
                <StatusIcon className="h-3 w-3 mr-1" data-oid="hh:rw0y" />
                {statusConfig[document.status].label}
              </Badge>
              <Badge
                className={cn(
                  "font-medium",
                  priorityConfig[document.priority].className,
                )}
                data-oid="tu_vb8_"
              >
                Prioridade {priorityConfig[document.priority].label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Separator data-oid="qxmjdhw" />

        {/* Two Column Layout */}
        <div
          className="grid grid-cols-5 gap-6 p-6 max-h-[calc(95vh-180px)]"
          data-oid="cl2.g0g"
        >
          {/* Left Column - Document Info (2/5) */}
          <div className="col-span-2" data-oid="85zpi1i">
            <ScrollArea className="h-full pr-4" data-oid="j3fwog2">
              <div className="space-y-6" data-oid="bb1p8df">
                {/* Client Information */}
                <div className="space-y-4" data-oid="j:0_r8m">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                    data-oid="lyiqgjd"
                  >
                    <User className="h-4 w-4" data-oid="34s4:_:" />
                    <span data-oid="immvyf0">Informações do Cliente</span>
                  </div>
                  <div
                    className="bg-muted/50 rounded-lg p-4 space-y-3"
                    data-oid="sf7nwjq"
                  >
                    <div data-oid="aj1dx9i">
                      <p
                        className="text-xs text-muted-foreground mb-1"
                        data-oid="2lcb38i"
                      >
                        Nome Completo
                      </p>
                      <p className="font-semibold text-base" data-oid=":t9ldns">
                        {document.clientName}
                      </p>
                    </div>
                    <div data-oid="e4p0quh">
                      <p
                        className="text-xs text-muted-foreground mb-1"
                        data-oid="yp59uvj"
                      >
                        CPF
                      </p>
                      <p className="font-mono font-medium" data-oid="9jqkqwu">
                        {document.clientCpf}
                      </p>
                    </div>
                    <div data-oid="tbyp_kh">
                      <p
                        className="text-xs text-muted-foreground mb-1"
                        data-oid="yb7.9nh"
                      >
                        ID da Proposta
                      </p>
                      <p
                        className="font-mono font-medium text-primary"
                        data-oid="a47k4q7"
                      >
                        {document.proposalId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Details */}
                <div className="space-y-4" data-oid="3f1:4gg">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                    data-oid="0dox07t"
                  >
                    <FileText className="h-4 w-4" data-oid="4hvf9-z" />
                    <span data-oid="m95890-">Detalhes do Documento</span>
                  </div>
                  <div
                    className="bg-muted/50 rounded-lg p-4 space-y-3"
                    data-oid="lz4lphu"
                  >
                    <div className="grid grid-cols-2 gap-3" data-oid="9_l-gj1">
                      <div data-oid="e1i5_vj">
                        <p
                          className="text-xs text-muted-foreground mb-1"
                          data-oid="wyjm1sv"
                        >
                          Tipo
                        </p>
                        <Badge
                          variant="secondary"
                          className="font-medium"
                          data-oid="ppjokjr"
                        >
                          {documentTypeLabels[document.documentType]}
                        </Badge>
                      </div>
                      <div data-oid="xjsyhe8">
                        <p
                          className="text-xs text-muted-foreground mb-1"
                          data-oid="9an_0jz"
                        >
                          Tamanho
                        </p>
                        <p className="text-sm font-medium" data-oid="81taee4">
                          {formatFileSize(document.fileSize)}
                        </p>
                      </div>
                    </div>
                    <div data-oid="d3azmk1">
                      <p
                        className="text-xs text-muted-foreground mb-1"
                        data-oid="dv0jfu4"
                      >
                        Nome do Arquivo
                      </p>
                      <p
                        className="text-sm font-medium break-all"
                        data-oid="lxld9qu"
                      >
                        {document.fileName}
                      </p>
                    </div>
                    <div data-oid="7v:irq5">
                      <p
                        className="text-xs text-muted-foreground mb-1"
                        data-oid="2o4nsbb"
                      >
                        ID do Documento
                      </p>
                      <p className="text-sm font-mono" data-oid="b5v9wrw">
                        {document.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4" data-oid="lulc.dd">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                    data-oid="-gbfaaq"
                  >
                    <Calendar className="h-4 w-4" data-oid="kqb.1ad" />
                    <span data-oid="xvi5mcc">Timeline</span>
                  </div>
                  <div
                    className="bg-muted/50 rounded-lg p-4 space-y-3"
                    data-oid="q6nx.su"
                  >
                    <div className="flex items-start gap-3" data-oid="824s0fg">
                      <div
                        className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"
                        data-oid="zft8y_a"
                      />
                      <div className="flex-1" data-oid="en2bs7v">
                        <p
                          className="text-xs text-muted-foreground"
                          data-oid="4:.he9m"
                        >
                          Data de Upload
                        </p>
                        <p className="text-sm font-medium" data-oid="ah697_8">
                          {formatDate(document.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3" data-oid=".olwcak">
                      <div
                        className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0"
                        data-oid="yqufpfk"
                      />
                      <div className="flex-1" data-oid="k57dlbs">
                        <p
                          className="text-xs text-muted-foreground"
                          data-oid="gwoor7r"
                        >
                          Tempo de Espera
                        </p>
                        <div
                          className="flex items-center gap-2"
                          data-oid="7bjpnz."
                        >
                          <p className="text-sm font-medium" data-oid="4-0oa3x">
                            {document.daysWaiting}{" "}
                            {document.daysWaiting === 1 ? "dia" : "dias"}
                          </p>
                          {document.daysWaiting > 3 && (
                            <AlertCircle
                              className="h-4 w-4 text-amber-500"
                              data-oid="rllqg1q"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {document.reviewedAt && (
                      <div
                        className="flex items-start gap-3"
                        data-oid="db-cn0a"
                      >
                        <div
                          className={cn(
                            "mt-1 w-2 h-2 rounded-full shrink-0",
                            document.status === "approved"
                              ? "bg-green-500"
                              : "bg-red-500",
                          )}
                          data-oid="hzef1f4"
                        />
                        <div className="flex-1" data-oid="af7lst4">
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="9gux_d-"
                          >
                            Data da Análise
                          </p>
                          <p className="text-sm font-medium" data-oid="c9140_b">
                            {formatDate(document.reviewedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Information */}
                {document.reviewedBy && (
                  <div className="space-y-4" data-oid="a7w_3hd">
                    <div
                      className="flex items-center gap-2 text-sm font-semibold text-foreground"
                      data-oid="oufb6rc"
                    >
                      <CheckCircle className="h-4 w-4" data-oid="ktq1bpm" />
                      <span data-oid="mriwro-">Informações da Análise</span>
                    </div>
                    <div
                      className="bg-muted/50 rounded-lg p-4 space-y-3"
                      data-oid="gys-2pb"
                    >
                      <div data-oid="b74hch_">
                        <p
                          className="text-xs text-muted-foreground mb-1"
                          data-oid="yqd4lfy"
                        >
                          Analisado por
                        </p>
                        <p className="font-semibold" data-oid="hg0px94">
                          {document.reviewedBy}
                        </p>
                      </div>
                      {document.comments && (
                        <div data-oid="zy6l5ku">
                          <p
                            className="text-xs text-muted-foreground mb-2"
                            data-oid="tczydp."
                          >
                            Comentários
                          </p>
                          <div
                            className="bg-background border rounded-md p-3"
                            data-oid="pag_nn9"
                          >
                            <p
                              className="text-sm leading-relaxed"
                              data-oid="gowglve"
                            >
                              {document.comments}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Column - Document Preview (3/5) */}
          <div className="col-span-3" data-oid="a7nx-g3">
            <div className="h-full flex flex-col" data-oid="3zqvkl1">
              <div
                className="flex items-center justify-between mb-4"
                data-oid="7dws2o9"
              >
                <h3 className="font-semibold text-lg" data-oid="gtshu9p">
                  Preview do Documento
                </h3>
                <Button size="sm" variant="outline" data-oid="fjtj43g">
                  <Download className="h-4 w-4 mr-2" data-oid="ce93sy8" />
                  Baixar
                </Button>
              </div>

              {/* Preview Area */}
              <div
                className="flex-1 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
                data-oid="o4csi.r"
              >
                <div className="text-center space-y-4 p-8" data-oid="uky5ma4">
                  <div
                    className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"
                    data-oid="6:et-t0"
                  >
                    <FileText
                      className="h-10 w-10 text-primary"
                      data-oid="eor.r5n"
                    />
                  </div>
                  <div className="space-y-2" data-oid="756jm31">
                    <p className="text-lg font-semibold" data-oid="5e7me3j">
                      Preview do Documento
                    </p>
                    <p
                      className="text-sm text-muted-foreground max-w-md mx-auto"
                      data-oid="93jvuvq"
                    >
                      O documento seria visualizado aqui. Integração com
                      visualizador de PDF como PDF.js, React-PDF ou similar.
                    </p>
                  </div>
                  <div className="pt-2" data-oid="64acml9">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      data-oid="9jf_r78"
                    >
                      {documentTypeLabels[document.documentType]} •{" "}
                      {formatFileSize(document.fileSize)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator data-oid="qsyotv0" />

        {/* Footer Actions */}
        <div
          className="flex items-center justify-between px-6 py-4 bg-muted/30"
          data-oid="h0im3jp"
        >
          <div className="text-sm text-muted-foreground" data-oid="73nzk-k">
            Documento ID:{" "}
            <span className="font-mono font-medium" data-oid="a:-pfpf">
              {document.id}
            </span>
          </div>
          <div className="flex gap-3" data-oid="5jwpoo.">
            <Button variant="outline" onClick={onClose} data-oid="ojp7j2p">
              Fechar
            </Button>
            <Button data-oid="hw-6ai1">
              <Download className="h-4 w-4 mr-2" data-oid=".wdwihm" />
              Baixar Documento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
