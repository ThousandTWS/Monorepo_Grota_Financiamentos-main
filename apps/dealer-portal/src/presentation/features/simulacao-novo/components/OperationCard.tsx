import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/ui/select";

type OperationCardProps = {
  personType: "PF" | "PJ" | null;
  operationType: "financiamento" | "autofin" | null;
  vehicleCategory: "leves" | "motos" | "pesados" | null;
  onPersonTypeChange: (value: "PF" | "PJ") => void;
  onOperationTypeChange: (value: "financiamento" | "autofin") => void;
  onVehicleCategoryChange: (value: "leves" | "motos" | "pesados") => void;
};

export function OperationCard({
  personType,
  operationType,
  vehicleCategory,
  onPersonTypeChange,
  onOperationTypeChange,
  onVehicleCategoryChange,
}: OperationCardProps) {
  return (
    <Card className="w-full h-full">
      <CardContent className="space-y-5 px-0">
        <CardHeader className="px-0">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-[#134B73]">Operação</h2>
          </div>
        </CardHeader>

        <div className="grid gap-4">
          <div className="space-y-2 -mt-2">
            <p className="text-sm font-medium text-[#134B73]">Pessoa</p>
            <Select value={personType ?? ""} onValueChange={(value: "PF" | "PJ") => onPersonTypeChange(value)}>
              <SelectTrigger className="text-[#134B73] w-[100%]">
                <SelectValue placeholder="Selecione PF ou PJ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PF">Pessoa Fisica</SelectItem>
                <SelectItem value="PJ">Pessoa Juridica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 -mt-2">
            <p className="text-sm font-medium text-[#134B73]">Tipo de operação</p>
            <Select
              value={operationType ?? ""}
              onValueChange={(value: "financiamento" | "autofin") => onOperationTypeChange(value)}
            >
              <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Selecione a operação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financiamento">Financiamento</SelectItem>
                <SelectItem value="autofin">AutoFin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 -mt-2">
            <p className="text-sm font-medium text-[#134B73]">Categoria do veículo</p>
            <Select
              value={vehicleCategory ?? ""}
              onValueChange={(value: "leves" | "motos" | "pesados") => onVehicleCategoryChange(value)}
            >
              <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leves">Leves</SelectItem>
                <SelectItem value="motos">Motos</SelectItem>
                <SelectItem value="pesados">Pesados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
