"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
"@/presentation/layout/components/ui/alert-dialog";
import { Logista } from "./columns";

interface DeleteDialogProps {
  logista: Logista | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteDialog({
  logista,
  open,
  onOpenChange,
  onConfirm
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} data-oid="eedkofo">
      <AlertDialogContent data-oid="2hcpy6o">
        <AlertDialogHeader data-oid="uf4tw20">
          <AlertDialogTitle data-oid="j3_xr8k">
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription data-oid="eure4p7">
            Tem certeza que deseja excluir o logista{" "}
            <span className="font-semibold text-foreground" data-oid="k3-m1c7">
              {logista?.fullName}
            </span>
            ? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter data-oid="eq_bls1">
          <AlertDialogCancel data-oid="7adp:su">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
            data-oid="3f1bv2f">

            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>);

}