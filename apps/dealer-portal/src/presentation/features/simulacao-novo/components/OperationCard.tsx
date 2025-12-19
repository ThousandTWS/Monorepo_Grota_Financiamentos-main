import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/ui/select";
import { Separator } from "@/presentation/ui/separator";
import { useFormContext } from "react-hook-form";

type OperationCardProps = {
  personType: "PF" | "PJ" | null;
  operationType: "financiamento" | "autofin" | null;
  vehicleCategory: "leves" | "motos" | "pesados" | null;
  onPersonTypeChange: (value: "PF" | "PJ") => void;
  onOperationTypeChange: (value: "financiamento" | "autofin") => void;
  onVehicleCategoryChange: (value: "leves" | "motos" | "pesados") => void;
  installmentValue?: string;
  totalPaymentValue?: string;
  interestRateLabel?: string;
};

export function OperationCard({
  personType,
  operationType,
  vehicleCategory,
  onPersonTypeChange,
  onOperationTypeChange,
  onVehicleCategoryChange,
  installmentValue,
  totalPaymentValue,
  interestRateLabel,
}: OperationCardProps) {
  const { watch, setValue } = useFormContext();

  const name = watch("name");
  const cpf_cnpj = watch("cpf_cnpj");
  const email = watch("email");
  const phone = watch("phone");
  const vehicleModelMasked = watch("vehicleModel");
  const vehicleModel = vehicleModelMasked?.split("+")[1]?.trim();
  const vehiclePlate = watch("vehiclePlate");
  const priceFIPE = watch("priceFIPE");
  const amountFinanced = watch("amountFinanced");
  const termMonths = watch("termMonths");
  const address = watch("address");

  return (
    <Card className="w-full md:min-w-96 h-full bg-gradient-to-b from-[#134B73] via-[#134B73] to-[#134B73]">
      <div className="pointer-events-none absolute inset-0 opacity-40 blur-3xl">
        <div className="mx-auto h-full w-full max-w-2xl bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_65%)]" />
      </div>
      <CardContent className="space-y-5 px-0">
        <CardHeader className="px-0">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-white">Operação</h2>
          </div>
        </CardHeader>

        <div className="grid gap-4">
          <div className="space-y-2 -mt-2">
            <p className="text-sm font-medium text-white">Pessoa</p>
            <Select value={personType ?? ""} onValueChange={(value: "PF" | "PJ") => {
              onPersonTypeChange(value);
              setValue("cpf_cnpj", "");
            }}>
              <SelectTrigger className="w-[100%] bg-white">
                <SelectValue placeholder="Selecione PF ou PJ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PF" className="text-black">Pessoa Fisica</SelectItem>
                <SelectItem value="PJ" className="text-black">Pessoa Juridica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 -mt-2">
            <p className="text-sm font-medium text-white">Tipo de operação</p>
            <Select
              value={operationType ?? ""}
              onValueChange={(value: "financiamento" | "autofin") => onOperationTypeChange(value)}
            >
              <SelectTrigger className="w-[100%] bg-white">
                <SelectValue placeholder="Selecione a operação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financiamento" className="text-black">Financiamento</SelectItem>
                <SelectItem value="autofin" className="text-black">AutoFin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 -mt-2">
            <p className="text-sm font-medium text-white">Categoria do veículo</p>
            <Select
              value={vehicleCategory ?? ""}
              onValueChange={(value: "leves" | "motos" | "pesados") => onVehicleCategoryChange(value)}
            >
              <SelectTrigger className="w-[100%] bg-white">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leves" className="text-black">Leves</SelectItem>
                <SelectItem value="motos" className="text-black">Motos</SelectItem>
                <SelectItem value="pesados" className="text-black">Pesados</SelectItem>
              </SelectContent>
            </Select>
          </div>
            <div className="space-y-3 border-white/25 bg-white/10 backdrop-blur-md">
                <div className="grid gap-2 rounded-md border p-3">
                  <h3 className="text-white font-semibold text-xl">Acompanhe a simulação</h3>
                  {name && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Cliente</span>
                      <span className="font-medium text-white">{name}</span>
                    </div>
                  )}
                  {cpf_cnpj && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Documento</span>
                      <span className="font-medium text-white">{cpf_cnpj}</span>
                    </div>
                  )}
                  {email && phone && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Contato</span>
                      <aside>
                        <p className="font-medium text-white">{email}</p>
                        <p className="font-medium text-white">{phone}</p>
                      </aside>
                    </div>
                  )}
                  {((name || cpf_cnpj || email) && (vehicleModel || vehiclePlate || priceFIPE || amountFinanced || termMonths)) && <Separator className="bg-slate-50/50" />}
                  {vehicleModel && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Veículo</span>
                      <span className="font-medium text-white">{vehicleModel}</span>
                    </div>
                  )}
                  {vehiclePlate && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Placa</span>
                      <span className="font-medium text-white">{vehiclePlate}</span>
                    </div>
                  )}
                  {priceFIPE && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Valor FIPE</span>
                      <span className="font-medium text-white">{priceFIPE}</span>
                    </div>
                  )}
                  {amountFinanced && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Valor financiado</span>
                      <span className="font-medium text-white">{amountFinanced}</span>
                    </div>
                  )}
                  {termMonths && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Prazo</span>
                      <span className="font-medium text-white">{termMonths} meses</span>
                    </div>
                  )}
                  {installmentValue && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Parcela estimada</span>
                      <span className="font-medium text-white">{installmentValue}</span>
                    </div>
                  )}
                  {totalPaymentValue && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Total a pagar</span>
                      <span className="font-medium text-white">{totalPaymentValue}</span>
                    </div>
                  )}
                  {interestRateLabel && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Taxa estimada</span>
                      <span className="font-medium text-white">{interestRateLabel}</span>
                    </div>
                  )}
                  {((vehicleModel || vehiclePlate || priceFIPE || amountFinanced || termMonths) && (address)) && <Separator className="bg-slate-50/50" />}
                  {address && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 text-xs">Endereço</span>
                      <span className="font-medium text-right text-white">{address}</span>
                    </div>
                  )}   
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
