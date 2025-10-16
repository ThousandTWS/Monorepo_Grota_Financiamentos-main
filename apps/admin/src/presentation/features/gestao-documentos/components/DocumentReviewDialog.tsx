"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/presentation/layout/components/ui/dialog";
import { Button } from "@/presentation/layout/components/ui/button";
import { Textarea } from "@/presentation/layout/components/ui/textarea";
import { Label } from "@/presentation/layout/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/presentation/layout/components/ui/radio-group";
import { Badge } from "@/presentation/layout/components/ui/badge";
import { ScrollArea } from "@/presentation/layout/components/ui/scroll-area";
import { Separator } from "@/presentation/layout/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { Document, DocumentStatus } from "@/application/core/@types/Documents/Document";
import { cn } from "@/lib/utils";

interface DocumentReviewDialogProps {
  document: Document;
  open: boolean;
  onClose: () => void;
  onReview: (
    documentId: string,
    status: DocumentStatus,
    comments: string,
  ) => void;
}

const reviewOptions = [
  {
    value: "approved" as DocumentStatus,
    label: "Aprovar Documento",
    description: "O documento está válido e pode ser aprovado",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    borderColor: "border-green-600",
    hoverBg: "hover:bg-green-50/50 dark:hover:bg-green-950/30",
  },
  {
    value: "rejected" as DocumentStatus,
    label: "Reprovar Documento",
    description: "O documento possui problemas e precisa ser reenviado",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/50",
    borderColor: "border-red-600",
    hoverBg: "hover:bg-red-50/50 dark:hover:bg-red-950/30",
  },
];

const quickComments = {
  approved: [
    "Documento válido e legível",
    "Aprovado conforme análise",
    "Documento autenticado e aprovado",
  ],

  rejected: [
    "Documento ilegível - solicitar nova foto",
    "Documento vencido - solicitar atualizado",
    "Documento incompleto - faltam informações",
    "Assinatura não confere",
    "Documento com rasuras",
  ],
};

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

export function DocumentReviewDialog({
  document,
  open,
  onClose,
  onReview,
}: DocumentReviewDialogProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<DocumentStatus>("approved");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comments.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onReview(document.id, selectedStatus, comments);
    setIsSubmitting(false);

    // Reset form
    setComments("");
    setSelectedStatus("approved");
  };

  const addQuickComment = (comment: string) => {
    setComments((prev) => (prev ? `${prev}\n${comment}` : comment));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onClose} data-oid="z:hsciw">
      <DialogContent className="max-w-4xl max-h-[90vh] p-0" data-oid="_ejs830">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4" data-oid="lsjb3az">
          <DialogTitle className="text-2xl font-bold" data-oid="29nh4s:">
            Análise de Documento
          </DialogTitle>
          <DialogDescription className="text-base" data-oid="5_xsaev">
            Revise cuidadosamente e tome uma decisão sobre o documento enviado
          </DialogDescription>
        </DialogHeader>

        <Separator data-oid="ual6v6." />

        {/* Content - Two Column Layout */}
        <div
          className="grid grid-cols-5 gap-6 p-6 max-h-[calc(90vh-240px)]"
          data-oid="vowu_1g"
        >
          {/* Left Column - Document Info (2/5) */}
          <div className="col-span-2" data-oid="uz00j-m">
            <ScrollArea className="h-full pr-4" data-oid="xz-0_e3">
              <div className="space-y-5" data-oid="v19ip0g">
                {/* Document Summary */}
                <div
                  className="bg-muted/50 rounded-lg p-4 space-y-3"
                  data-oid="vtq38z-"
                >
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    data-oid="6wh6j4m"
                  >
                    <FileText className="h-4 w-4" data-oid=":enk4kv" />
                    <span data-oid="h.0c:.j">Documento</span>
                  </div>
                  <div className="space-y-2" data-oid="bvxk1u:">
                    <Badge
                      variant="secondary"
                      className="font-medium"
                      data-oid="qpwj-j5"
                    >
                      {documentTypeLabels[document.documentType]}
                    </Badge>
                    <p
                      className="text-sm font-medium break-all text-muted-foreground"
                      data-oid=".kp27:c"
                    >
                      {document.fileName}
                    </p>
                  </div>
                </div>

                {/* Client Info */}
                <div
                  className="bg-muted/50 rounded-lg p-4 space-y-3"
                  data-oid="nracz2w"
                >
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    data-oid="8e_ed:f"
                  >
                    <User className="h-4 w-4" data-oid="1r_zzty" />
                    <span data-oid="smfmtqf">Cliente</span>
                  </div>
                  <div className="space-y-2" data-oid="1q3adx8">
                    <div data-oid="8.vclo-">
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="yimc9oe"
                      >
                        Nome
                      </p>
                      <p className="font-semibold" data-oid="4.vxwcq">
                        {document.clientName}
                      </p>
                    </div>
                    <div data-oid="y3q:_np">
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="n.kq_8j"
                      >
                        CPF
                      </p>
                      <p className="font-mono text-sm" data-oid="c.w1t28">
                        {document.clientCpf}
                      </p>
                    </div>
                    <div data-oid="6:jx._z">
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="0v486xg"
                      >
                        Proposta
                      </p>
                      <p
                        className="font-mono text-sm text-primary"
                        data-oid="y.gu4:n"
                      >
                        {document.proposalId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div
                  className="bg-muted/50 rounded-lg p-4 space-y-3"
                  data-oid="x1a:5hh"
                >
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    data-oid="7okuyw_"
                  >
                    <Calendar className="h-4 w-4" data-oid="aoekbb_" />
                    <span data-oid="ysa1oe4">Informações</span>
                  </div>
                  <div className="space-y-2" data-oid="jzo:yr3">
                    <div
                      className="flex items-center justify-between text-sm"
                      data-oid="opykv8s"
                    >
                      <span
                        className="text-muted-foreground"
                        data-oid="z_x9wsd"
                      >
                        Upload
                      </span>
                      <span className="font-medium" data-oid="z9vt-f_">
                        {formatDate(document.uploadDate)}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between text-sm"
                      data-oid="i_hp-z2"
                    >
                      <span
                        className="text-muted-foreground"
                        data-oid="pkrq-d:"
                      >
                        Aguardando
                      </span>
                      <div
                        className="flex items-center gap-1"
                        data-oid="9:ivqgm"
                      >
                        <span className="font-medium" data-oid="80znri_">
                          {document.daysWaiting}{" "}
                          {document.daysWaiting === 1 ? "dia" : "dias"}
                        </span>
                        {document.daysWaiting > 3 && (
                          <AlertCircle
                            className="h-4 w-4 text-amber-500"
                            data-oid="1uhdftu"
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="flex items-center justify-between text-sm"
                      data-oid="110gh:n"
                    >
                      <span
                        className="text-muted-foreground"
                        data-oid="ak879kn"
                      >
                        ID
                      </span>
                      <span className="font-mono text-xs" data-oid="-x3en4u">
                        {document.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alert if waiting too long */}
                {document.daysWaiting > 3 && (
                  <div
                    className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg"
                    data-oid="s-lywrn"
                  >
                    <AlertCircle
                      className="h-5 w-5 text-amber-600 shrink-0 mt-0.5"
                      data-oid="t8_zvtd"
                    />
                    <div className="flex-1 space-y-1" data-oid="cr1wjiv">
                      <p
                        className="text-sm font-medium text-amber-900 dark:text-amber-100"
                        data-oid="xg0b7vh"
                      >
                        Atenção: Documento aguardando há mais de 3 dias
                      </p>
                      <p
                        className="text-xs text-amber-700 dark:text-amber-300"
                        data-oid="wn2r614"
                      >
                        Priorize a análise deste documento para manter o SLA.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Column - Review Form (3/5) */}
          <div className="col-span-3" data-oid="8wsiadl">
            <ScrollArea className="h-full pr-4" data-oid="ah8ziko">
              <div className="space-y-6" data-oid="f8ze89c">
                {/* Decision Options */}
                <div className="space-y-3" data-oid="p70eki1">
                  <Label className="text-base font-semibold" data-oid="9ci3d-u">
                    Decisão de Análise
                  </Label>
                  <RadioGroup
                    value={selectedStatus}
                    onValueChange={(value) =>
                      setSelectedStatus(value as DocumentStatus)
                    }
                    className="space-y-3"
                    data-oid="f7p8dfv"
                  >
                    {reviewOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = selectedStatus === option.value;

                      return (
                        <label
                          key={option.value}
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            isSelected
                              ? `${option.borderColor} ${option.bgColor} shadow-sm`
                              : `border-border ${option.hoverBg}`,
                          )}
                          data-oid="w9h_zg8"
                        >
                          <RadioGroupItem
                            value={option.value}
                            className="mt-1"
                            data-oid="5rb3hc7"
                          />
                          <div className="flex-1" data-oid="59.h9h8">
                            <div
                              className="flex items-center gap-2 mb-1"
                              data-oid="19lt9y0"
                            >
                              <Icon
                                className={cn(
                                  "h-5 w-5",
                                  isSelected
                                    ? option.color
                                    : "text-muted-foreground",
                                )}
                                data-oid="rn61l6h"
                              />
                              <span
                                className="font-semibold text-base"
                                data-oid="b7ytbua"
                              >
                                {option.label}
                              </span>
                            </div>
                            <p
                              className="text-sm text-muted-foreground"
                              data-oid="s8gqsb9"
                            >
                              {option.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Comments Section */}
                <div className="space-y-3" data-oid="ovkbv:_">
                  <Label
                    htmlFor="comments"
                    className="text-base font-semibold flex items-center gap-2"
                    data-oid="o52ybwt"
                  >
                    Comentários e Justificativa
                    {selectedStatus === "rejected" && (
                      <Badge
                        variant="destructive"
                        className="text-xs"
                        data-oid="t5.odlr"
                      >
                        Obrigatório
                      </Badge>
                    )}
                  </Label>
                  <Textarea
                    id="comments"
                    placeholder={
                      selectedStatus === "approved"
                        ? "Adicione observações sobre a aprovação (opcional)..."
                        : "Descreva detalhadamente os motivos da reprovação (obrigatório)..."
                    }
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={5}
                    className="resize-none"
                    data-oid="ysw4acv"
                  />

                  <p
                    className="text-xs text-muted-foreground"
                    data-oid="d-e0lzj"
                  >
                    {comments.length} caracteres
                  </p>
                </div>

                {/* Quick Comments */}
                <div className="space-y-3" data-oid="xn04qi0">
                  <Label className="text-sm font-medium" data-oid="2lnuyxh">
                    Comentários Rápidos
                  </Label>
                  <div className="flex flex-wrap gap-2" data-oid="1_ypt_5">
                    {(selectedStatus === "approved" ||
                      selectedStatus === "rejected") &&
                      quickComments[selectedStatus].map(
                        (comment: string, index: number) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addQuickComment(comment)}
                            className="text-xs h-8"
                            data-oid="p_gwiai"
                          >
                            {comment}
                          </Button>
                        ),
                      )}
                  </div>
                </div>

                {/* Warning for rejection without comments */}
                {selectedStatus === "rejected" && !comments.trim() && (
                  <div
                    className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg"
                    data-oid="rsn_.02"
                  >
                    <AlertCircle
                      className="h-5 w-5 text-red-600 shrink-0 mt-0.5"
                      data-oid=".my9ilj"
                    />
                    <div className="flex-1 space-y-1" data-oid="m1z--vp">
                      <p
                        className="text-sm font-medium text-red-900 dark:text-red-100"
                        data-oid="qnkdwsm"
                      >
                        Comentário obrigatório para reprovação
                      </p>
                      <p
                        className="text-xs text-red-700 dark:text-red-300"
                        data-oid="af:6oq:"
                      >
                        Para reprovar um documento, é necessário adicionar um
                        comentário explicando o motivo. Use os comentários
                        rápidos ou escreva uma justificativa personalizada.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <Separator data-oid="s_invyl" />

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-muted/30" data-oid="rg659xa">
          <div
            className="flex items-center justify-between w-full"
            data-oid="_ax_cls"
          >
            <p className="text-sm text-muted-foreground" data-oid="ehk4scu">
              Documento será marcado como{" "}
              <span className="font-semibold" data-oid="gi7_9b.">
                {selectedStatus === "approved" ? "Aprovado" : "Reprovado"}
              </span>
            </p>
            <div className="flex gap-3" data-oid="r01a323">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                data-oid="3ytvt14"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  (selectedStatus === "rejected" && !comments.trim())
                }
                className={cn(
                  "min-w-[160px]",
                  selectedStatus === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700",
                )}
                data-oid="e.g7xwt"
              >
                {isSubmitting ? (
                  <>
                    <div
                      className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"
                      data-oid="jln9mb-"
                    />
                    Processando...
                  </>
                ) : selectedStatus === "approved" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" data-oid="vy3x1cm" />
                    Aprovar Documento
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" data-oid="5_9:tje" />
                    Reprovar Documento
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
