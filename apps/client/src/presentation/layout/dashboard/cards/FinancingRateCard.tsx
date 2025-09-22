import { Card } from "@/src/presentation/components/ui/card";

interface FinancingRateCardProps {
  rate: string;
  description?: string;
}

export function FinancingRateCard({ rate, description = "Baseado nas últimas 30 operações" }: FinancingRateCardProps) {
  return (
    <Card className="p-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Taxa Média de Financiamento</p>
        <p className="text-3xl font-bold text-primary">{rate}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </Card>
  );
}