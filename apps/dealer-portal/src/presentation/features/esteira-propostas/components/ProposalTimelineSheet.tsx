"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { Button } from "@/presentation/ui/button";

type ProposalTimelineSheetProps = {
  proposalId: number;
};

export function ProposalTimelineSheet({ proposalId }: ProposalTimelineSheetProps) {
  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="w-full justify-center gap-2 border-[#0F456A] bg-[#134B73] text-white hover:bg-[#0F456A] hover:text-white"
    >
      <Link href={`/esteira-propostas/${proposalId}/historico`}>
        <History className="size-4" />
        Histórico
      </Link>
    </Button>
  );
}
