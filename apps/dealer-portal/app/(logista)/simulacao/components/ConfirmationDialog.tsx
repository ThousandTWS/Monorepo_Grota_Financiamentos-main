"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/presentation/ui/dialog"
import { Separator } from "@/presentation/ui/separator"
import { ExtraProps, SimulateProposalFormData } from "../page";
import { Button } from "@/presentation/ui/button";
import { CreateProposalPayload } from "@/application/core/@types/Proposals/Proposal";
import { unmaskCPF } from "@/lib/masks";
import { formatDateISO, parseBRL } from "@/lib/formatters";
import { createProposal } from "@/application/services/Proposals/proposalService";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  dispatchBridgeEvent,
  useRealtimeChannel,
} from "@grota/realtime-client";
import { Loader2, Send } from "lucide-react";
import { UseFormReset } from "react-hook-form";

type ConfirmationDialogProps = {
    isOpen: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    resumeProposal: SimulateProposalFormData | null;
    setResumeProposal: Dispatch<SetStateAction<SimulateProposalFormData | null>>;
    resetForm: UseFormReset<SimulateProposalFormData>;
    resetExtra: Dispatch<SetStateAction<ExtraProps[]>>;
}

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_WS_URL;
const LOGISTA_SIMULATOR_ID = "logista-simulador";

const ConfirmationDialog = ({ isOpen, onOpenChange, resumeProposal, setResumeProposal, resetForm, resetExtra }: ConfirmationDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { sendMessage } = useRealtimeChannel({
        channel: REALTIME_CHANNELS.PROPOSALS,
        identity: LOGISTA_SIMULATOR_ID,
        url: REALTIME_URL,
    });

    const emitRealtimeEvent = useCallback(
        (event: string, payload?: Record<string, unknown>) => {
        dispatchBridgeEvent(sendMessage, event, {
            source: LOGISTA_SIMULATOR_ID,
            ...(payload ?? {}),
        });
        },
        [sendMessage],
    );

    const handleFinishProposal = async () => {
        if (!resumeProposal) return;

        try {
            const payload: CreateProposalPayload = {
                customerCpf: unmaskCPF(resumeProposal.cpf),
                customerName: resumeProposal.fullname,
                customerBirthDate: formatDateISO(resumeProposal.birthday),
                customerEmail: resumeProposal.email,
                customerPhone: resumeProposal.phone,
                hasCnh: resumeProposal.haveCNH,
                cnhCategory: resumeProposal.categoryCNH || "",
                vehiclePlate: resumeProposal.vehiclePlate,
                vehicleBrand: resumeProposal.vehicleBrand,
                vehicleModel: resumeProposal.vehicleModel,
                vehicleYear: Number(resumeProposal.vehicleYear),
                fipeCode: resumeProposal.codeFIPE,
                fipeValue: parseBRL(resumeProposal.priceFIPE),
                downPaymentValue: parseBRL(resumeProposal.entryPrice),
                financedValue: parseBRL(resumeProposal.financedPrice),
                notes: resumeProposal.details
            };

            const proposal = await createProposal(payload);
            emitRealtimeEvent(REALTIME_EVENT_TYPES.PROPOSAL_CREATED, {
                proposal,
            });
            emitRealtimeEvent(REALTIME_EVENT_TYPES.PROPOSALS_REFRESH_REQUEST, {
                reason: "logista-simulator-created",
            });

            onOpenChange(false);
            setResumeProposal(null);
            resetExtra([]);
            resetForm();
        } catch (error) {
            console.error("[Simulacao] Falha ao enviar proposta", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCloseDialog = () => {
        onOpenChange(false);
        setResumeProposal(null);
        resetExtra([]);
        resetForm();
    }

    return (
        <Dialog open={isOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] space-y-2 overflow-y-auto" showCloseButton={false}>
            <DialogHeader>
                <DialogTitle>Resumo da simulação</DialogTitle>
                <DialogDescription>
                    Validamos automaticamente se o valor solicitado cabe na FIPE.
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cliente</p>
                <p className="font-semibold text-gray-900 dark:text-gray-50">
                    {resumeProposal?.fullname}
                </p>
                <p className="text-xs text-muted-foreground">
                    {resumeProposal?.cpf}
                </p>
            </div>
            <Separator />
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Veículo</p>
                <p className="font-semibold">
                    {resumeProposal?.vehicleBrand} - {resumeProposal?.vehicleModel}
                </p>
                <p className="text-xs text-muted-foreground">
                    Ano {resumeProposal?.vehicleYear} • Placa{" "}
                    {resumeProposal?.vehiclePlate}
                </p>
            </div>
            <Separator />
            <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                <span>Valor FIPE</span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {resumeProposal?.priceFIPE}
                </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                <span>Entrada</span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {resumeProposal?.entryPrice}
                </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                <span>Valor financiado</span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {resumeProposal?.financedPrice}
                </span>
                </div>
            </div>
            <div className="w-full flex justify-end gap-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                    Fechar
                </Button>
                <Button onClick={handleFinishProposal} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            Enviar Proposta
                            <Send size={20} />
                        </>
                    )}
                </Button>
            </div>
        </DialogContent>
        </Dialog>
    )
}

export { ConfirmationDialog }