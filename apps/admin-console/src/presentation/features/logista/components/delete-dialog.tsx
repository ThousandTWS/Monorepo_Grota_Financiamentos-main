"use client";

import { Button, Modal, Typography } from "antd";
import { Logista } from "./columns";

interface DeleteDialogProps {
  logista: Logista | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteDialog({
  logista,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteDialogProps) {
  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={null}
      title="Confirmar Exclusao"
      data-oid="eedkofo"
    >
      <Typography.Paragraph className="text-sm text-muted-foreground" data-oid="eure4p7">
        Tem certeza que deseja excluir o logista{" "}
        <span className="font-semibold text-foreground" data-oid="k3-m1c7">
          {logista?.fullName}
        </span>
        ? Esta acao nao pode ser desfeita.
      </Typography.Paragraph>
      <div className="flex justify-end gap-2" data-oid="eq_bls1">
        <Button onClick={() => onOpenChange(false)} disabled={isLoading} data-oid="7adp:su">
          Cancelar
        </Button>
        <Button
          danger
          type="primary"
          onClick={onConfirm}
          loading={isLoading}
          data-oid="3f1bv2f"
        >
          {isLoading ? "Excluindo..." : "Excluir"}
        </Button>
      </div>
    </Modal>
  );
}
