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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from
  "@/presentation/layout/components/ui/select";
import { Logista } from "./columns";

interface LogistaDialogProps {
  logista: Logista | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (logista: Logista) => void;
  mode: "view" | "edit" | "create";
}

export function LogistaDialog({
  logista,
  open,
  onOpenChange,
  onSave,
  mode
}: LogistaDialogProps) {
  const [formData, setFormData] = useState<Logista>({
    id: "",
    fullName: "",
    cpf: "",
    cnpj: "",
    email: "",
    phone: "",
    status: "ativo",
    createdAt: new Date().toISOString().split("T")[0],
    comissaoTotal: 0
  });

  useEffect(() => {
    if (logista) {
      setFormData(logista);
    } else {
      setFormData({
        id: "",
        fullName: "",
        cpf: "",
        cnpj: "",
        email: "",
        phone: "",
        status: "ativo",
        createdAt: new Date().toISOString().split("T")[0],
        comissaoTotal: 0
      });
    }
  }, [logista, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== "view") {
      onSave(formData);
      onOpenChange(false);
    }
  };

  const isReadOnly = mode === "view";

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Visualizar Logista";
      case "edit":
        return "Editar Logista";
      case "create":
        return "Novo Logista";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "view":
        return "Informações detalhadas do logista";
      case "edit":
        return "Edite as informações do logista";
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
                <Label htmlFor="cnpj" data-oid="srk9ani">
                  CNPJ
                </Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) =>
                    setFormData({ ...formData, cnpj: e.target.value })
                  }
                  placeholder="12.345.678/0001-99"
                  disabled={isReadOnly}
                  required
                  data-oid="ft0hh.o"
                />
              </div>


              <div className="space-y-2" data-oid="c3hhoay">
                <Label htmlFor="cpf" data-oid="srk9ani">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({ ...formData, cpf: e.target.value })
                  }
                  placeholder="123.456.789-00"
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

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-oid="v7qo9cd">

              <div className="space-y-2" data-oid="6uh39qe">
                <Label htmlFor="status" data-oid="7:omj4e">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "ativo" | "inativo" | "pendente") =>
                    setFormData({ ...formData, status: value })
                  }
                  disabled={isReadOnly}
                  data-oid="ynrrpeu">

                  <SelectTrigger data-oid="ymfnfva">
                    <SelectValue data-oid="m8n2pk3" />
                  </SelectTrigger>
                  <SelectContent data-oid="8bdysh_">
                    <SelectItem value="ativo" data-oid="jwsp2-y">
                      Ativo
                    </SelectItem>
                    <SelectItem value="inativo" data-oid="4g26hv_">
                      Inativo
                    </SelectItem>
                    <SelectItem value="pendente" data-oid="3j1umk:">
                      Pendente
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" data-oid=":cvuhlv">
                <Label htmlFor="dataRegistro" data-oid="460_8hu">
                  Data de Registro
                </Label>
                <Input
                  id="dataRegistro"
                  type="date"
                  value={formData.createdAt}
                  onChange={(e) =>
                    setFormData({ ...formData, createdAt: e.target.value })
                  }
                  disabled={isReadOnly}
                  required
                  data-oid="2wtu.qb" />

              </div>
            </div>

            {mode === "view" &&
              <div className="space-y-2" data-oid="c3lkwui">
                <Label htmlFor="comissaoTotal" data-oid="wsc_nal">
                  Comissão Total
                </Label>
                <Input
                  id="comissaoTotal"
                  value={new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  }).format(formData.comissaoTotal)}
                  disabled
                  data-oid="9ffpl6v" />

              </div>
            }
          </div>

          <DialogFooter data-oid="gwrq6il">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-oid="ybh:lpy">

              {mode === "view" ? "Fechar" : "Cancelar"}
            </Button>
            {mode !== "view" &&
              <Button type="submit" data-oid="fnyk5_2">
                {mode === "create" ? "Criar" : "Salvar"}
              </Button>
            }
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}