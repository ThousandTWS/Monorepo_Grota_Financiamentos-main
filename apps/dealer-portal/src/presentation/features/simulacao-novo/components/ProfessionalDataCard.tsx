import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { LabeledInput } from "./LabeledInput";
import { Label } from "@/presentation/ui/label";
import { Input } from "@/presentation/ui/input";
import { CalendarDays } from "lucide-react";

type ProfessionalDataCardProps = {
  personalCompany: string;
  onCompanyChange: (value: string) => void;
  personalJobTitle: string;
  onJobTitleChange: (value: string) => void;
  personalAdmissionDate: string;
  onAdmissionDateChange: (value: string) => void;
  personalIncome: string;
  onIncomeChange: (value: string) => void;
  personalOtherIncome: string;
  onOtherIncomeChange: (value: string) => void;
};

export function ProfessionalDataCard({
  personalCompany,
  onCompanyChange,
  personalJobTitle,
  onJobTitleChange,
  personalAdmissionDate,
  onAdmissionDateChange,
  personalIncome,
  onIncomeChange,
  personalOtherIncome,
  onOtherIncomeChange,
}: ProfessionalDataCardProps) {
  return (
    <Card>
      <CardHeader className="-mt-5">
        <h2 className="text-lg font-semibold text-[#134B73] -mb-5">Dados Profissionais</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-12">
          <LabeledInput
            id="personalCompany"
            containerClassName="md:col-span-4"
            label="Empresa"
            placeholder="Onde trabalha"
            //@ts-ignore
            value={personalCompany}
            onChange={onCompanyChange}
          />
          <LabeledInput
            id="personalJobTitle"
            containerClassName="md:col-span-3"
            label="Função"
            placeholder="Cargo ou função"
                        //@ts-ignore
            value={personalJobTitle}
            onChange={onJobTitleChange}
          />
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="personalAdmissionDate" className="text-[#134B73]">
              Data de admissão
            </Label>
            <div className="relative">
              <Input
                id="personalAdmissionDate"
                type="date"
                className="w-full pr-10 cursor-pointer"
                value={personalAdmissionDate}
                onChange={(e) => onAdmissionDateChange(e.target.value)}
              />
              <CalendarDays className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#134B73]" />
            </div>
          </div>
          <LabeledInput
            id="personalIncome"
            containerClassName="md:col-span-2"
            label="Renda"
            placeholder="R$ 0,00"
                        //@ts-ignore
            value={personalIncome}
            onChange={onIncomeChange}
            inputClassName="text-right"
          />
          <LabeledInput
            id="personalOtherIncome"
            containerClassName="md:col-span-2"
            label="Outras rendas"
            placeholder="R$ 0,00"
                        //@ts-ignore
            value={personalOtherIncome}
            onChange={onOtherIncomeChange}
            inputClassName="text-right"
          />
        </div>
      </CardContent>
    </Card>
  );
}
