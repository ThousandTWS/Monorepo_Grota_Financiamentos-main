"use client";

import { Card, Input, Typography } from "antd";
import { CalendarDays } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { maskBRL } from "@/lib/masks";
import { LabeledInput } from "./LabeledInput";

export function ProfessionalDataCard() {
  const { register } = useFormContext();

  return (
    <Card title={<span className="text-lg font-semibold text-[#134B73]">Dados Profissionais</span>}>
      <div className="space-y-4">
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
            label="Funcao"
            placeholder="Cargo ou funcao"
            {...register("enterpriseFunction")}
          />
          <div className="space-y-2 md:col-span-3">
            <Typography.Text className="text-[#134B73]">Data de admissao</Typography.Text>
            <Input
              id="admissionDate"
              type="date"
              className="w-full pr-10 cursor-pointer"
              suffix={<CalendarDays className="h-4 w-4 text-[#134B73]" />}
              {...register("admissionDate")}
            />
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
              },
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
              },
            })}
          />
        </div>
      </div>
    </Card>
  );
}
