import { Card, CardContent, CardHeader } from "@/presentation/layout/components/ui/card";
import { LabeledInput } from "./LabeledInput";
import { Label } from "@/presentation/layout/components/ui/label";
import { Input } from "@/presentation/layout/components/ui/input";
import { CalendarDays } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { maskBRL } from "@/lib/masks";

export function ProfessionalDataCard() {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader className="-mt-5">
        <h2 className="text-lg font-semibold text-[#134B73] -mb-5">Dados Profissionais</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-12">
          <LabeledInput
            id="enterprise"
            containerClassName="md:col-span-4"
            label="Empresa"
            placeholder="Onde trabalha"
            {...register("enterprise")}
          />
          <LabeledInput
            id="enterpriseFunction"
            containerClassName="md:col-span-3"
            label="FunÇõÇœo"
            placeholder="Cargo ou funÇõÇœo"
            {...register("enterpriseFunction")}
          />
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="admissionDate" className="text-[#134B73]">
              Data de admissÇœo
            </Label>
            <div className="relative">
              <Input
                id="admissionDate"
                type="date"
                className="w-full pr-10 cursor-pointer"
                {...register("admissionDate")}
              />
              <CalendarDays className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#134B73]" />
            </div>
          </div>
          <LabeledInput
            id="income"
            containerClassName="md:col-span-2"
            label="Renda"
            placeholder="R$ 0,00"
            inputClassName="text-right"
            {...register("income", {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = maskBRL(e.target.value);
              }
            })}
          />
          <LabeledInput
            id="otherIncomes"
            containerClassName="md:col-span-2"
            label="Outras rendas"
            placeholder="R$ 0,00"
            inputClassName="text-right"
            {...register("otherIncomes", {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = maskBRL(e.target.value);
              }
            })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
