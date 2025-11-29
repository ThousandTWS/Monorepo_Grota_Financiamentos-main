"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from
  "@/presentation/layout/components/ui/dialog";
import { Input } from "@/presentation/layout/components/ui/input";
import { Label } from "@/presentation/layout/components/ui/label";
import { Button } from "@/presentation/layout/components/ui/button";
import { Logista } from "./columns";
import { CreateDealerPayload } from "@/application/services/Logista/logisticService";
import { StatusBadge } from "./status-badge";

interface LogistaDialogProps {
  logista: Logista | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CreateDealerPayload) => Promise<void>;
  mode: "view" | "create";
  isSubmitting?: boolean;
}

export function LogistaDialog({
  logista,
  open,
  onOpenChange,
  onSave,
  mode,
  isSubmitting = false,
}: LogistaDialogProps) {
  const [formData, setFormData] = useState<CreateDealerPayload>({
    fullName: "",
    email: "",
    phone: "",
    enterprise: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (logista) {
      setFormData({
        fullName: logista.fullName ?? "",
        email: logista.email ?? "",
        phone: logista.phone ?? "",
        enterprise: logista.enterprise ?? "",
        password: "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        enterprise: "",
        password: "",
      });
    }
    setFormError(null);
  }, [logista, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") {
      onOpenChange(false);
      return;
    }

    const passwordLength = formData.password?.trim().length ?? 0;
    if (passwordLength < 6 || passwordLength > 8) {
      setFormError("Defina uma senha de 6 a 8 caracteres.");
      return;
    }

    setFormError(null);
    const normalizedPayload: CreateDealerPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      enterprise: formData.enterprise.trim(),
      password: formData.password.trim(),
    };
    try {
      await onSave(normalizedPayload);
      onOpenChange(false);
    } catch (err) {
      console.error("[logista-dialog] Falha ao salvar logista", err);
    }
  };

  const isReadOnly = mode === "view";

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Visualizar Logista";
      case "create":
        return "Novo Logista";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "view":
        return "Informações detalhadas do logista";
      case "create":
        return "Preencha os dados para criar um novo logista";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} data-oid=".0zrq2c">
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-oid=":atedp.">

        <form onSubmit={handleSubmit} data-oid="mt:b5u-">
          <DialogHeader data-oid="m47lj:e">
            <DialogTitle data-oid="4b1w_.y">{getTitle()}</DialogTitle>
            <DialogDescription data-oid="dyehaxg">
              {getDescription()}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4" data-oid="j2804_h">
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-oid="fqhl2pm">

              <div className="space-y-2" data-oid="swtwq4f">
                <Label htmlFor="nome" data-oid="j0-mncq">
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="João Silva Santos"
                  disabled={isReadOnly}
                  required
                  data-oid="::3dzxy" />

              </div>

              <div className="space-y-2" data-oid="c3hhoay">
                <Label htmlFor="enterprise" data-oid="srk9ani">
                  Empresa
                </Label>
                <Input
                  id="enterprise"
                  value={formData.enterprise}
                  onChange={(e) =>
                    setFormData({ ...formData, enterprise: e.target.value })
                  }
                  placeholder="Auto Center XPTO"
                  disabled={isReadOnly}
                  required
                  data-oid="ft0hh.o" />

              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-oid="nz_vxdf">

              <div className="space-y-2" data-oid="4xla:p:">
                <Label htmlFor="email" data-oid="0qjx6tp">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="joao@email.com"
                  disabled={isReadOnly}
                  required
                  data-oid="rs6yg8g" />

              </div>

              <div className="space-y-2" data-oid="6f71yr:">
                <Label htmlFor="telefone" data-oid="005bchm">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(11) 98765-4321"
                  disabled={isReadOnly}
                  required
                  data-oid="3yqnd-h" />

              </div>
            </div>

            {mode === "create" && (
              <div className="space-y-2" data-oid="c3lkwui">
                <Label htmlFor="password" data-oid="wsc_nal">
                  Senha inicial
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Defina uma senha (6 a 8 caracteres)"
                  disabled={isSubmitting}
                  required
                  minLength={6}
                  maxLength={8}
                  data-oid="9ffpl6v" />

                <p className="text-xs text-muted-foreground">
                  Essa senha será utilizada pelo lojista ao acessar o painel do logista.
                </p>
              </div>
            )}

            {mode === "view" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="v7qo9cd">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <StatusBadge status={logista?.status} />
                </div>
                <div className="space-y-2">
                  <Label>Data de registro</Label>
                  <div className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                    {logista?.createdAt
                      ? new Date(logista.createdAt).toLocaleDateString("pt-BR")
                      : "--"}
                  </div>
                </div>
              </div>
            )}

            {formError && (
              <p className="text-sm text-red-500" data-oid="errMsg">
                {formError}
              </p>
            )}
          </div>

          <DialogFooter data-oid="gwrq6il">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-oid="ybh:lpy">

              {mode === "view" ? "Fechar" : "Cancelar"}
            </Button>
            {mode !== "view" && (
              <Button type="submit" disabled={isSubmitting} data-oid="fnyk5_2">
                {isSubmitting ? "Salvando..." : "Criar"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}
