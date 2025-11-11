"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/layout/components/ui/dialog";
import { Input } from "@/presentation/layout/components/ui/input";
import { Textarea } from "@/presentation/layout/components/ui/textarea";
import { Button } from "@/presentation/layout/components/ui/button";
import { Label } from "@/presentation/layout/components/ui/label";
import { Badge } from "@/presentation/layout/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CreateProposalPayload {
  clientName: string;
  clientDocument: string;
  dealerCode: string;
  operatorNote?: string;
}

interface CreateProposalDialogProps {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  onSubmit: (payload: CreateProposalPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  redirectTo?: string;
  onRedirect?: () => void;
}

const emptyPayload: CreateProposalPayload = {
  clientName: "",
  clientDocument: "",
  dealerCode: "",
  operatorNote: "",
};

export function CreateProposalDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  redirectTo,
  onRedirect,
}: CreateProposalDialogProps) {
  const [formState, setFormState] =
    useState<CreateProposalPayload>(emptyPayload);

  useEffect(() => {
    if (!open) {
      setFormState(emptyPayload);
    }
  }, [open]);

  const handleChange =
    (field: keyof CreateProposalPayload) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formState);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova ficha</DialogTitle>
          <DialogDescription>
            Inicie uma nova análise preenchendo os dados básicos abaixo. Quando
            a API estiver disponível, esta etapa já estará pronta para disparar
            o fluxo de criação.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              placeholder="Fulano de Tal"
              value={formState.clientName}
              onChange={handleChange("clientName")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientDocument">CPF</Label>
            <Input
              id="clientDocument"
              placeholder="000.000.000-00"
              value={formState.clientDocument}
              onChange={handleChange("clientDocument")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dealerCode">Código do Lojista</Label>
            <Input
              id="dealerCode"
              placeholder="0000"
              value={formState.dealerCode}
              onChange={handleChange("dealerCode")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operatorNote">Observações</Label>
            <Textarea
              id="operatorNote"
              placeholder="Comentários relevantes para o analista..."
              value={formState.operatorNote}
              onChange={handleChange("operatorNote")}
              rows={3}
            />
          </div>

          <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm leading-relaxed">
            <p>
              <Badge variant="secondary" className="mr-2">
                Roadmap
              </Badge>
              Assim que o backend publicar o endpoint de criação, conecte este
              formulário chamando o serviço correspondente ou redirecione para o
              fluxo completo.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              className={cn({
                "cursor-not-allowed opacity-60": !redirectTo,
              })}
              disabled={!redirectTo}
              onClick={redirectTo ? onRedirect : undefined}
            >
              Abrir fluxo completo
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Preparando..." : "Salvar rascunho"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
