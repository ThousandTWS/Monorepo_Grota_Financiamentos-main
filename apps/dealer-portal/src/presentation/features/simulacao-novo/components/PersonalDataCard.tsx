import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Switch } from "@/presentation/ui/switch";
import { Label } from "@/presentation/ui/label";
import { SelectItem } from "@/presentation/ui/select";
import { LabeledInput } from "./LabeledInput";
import { LabeledSelect } from "./LabeledSelect";
import { Input } from "@/presentation/ui/input";
import { CalendarDays } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";

type PersonalDataCardProps = {
  onZipChange: (value: string) => void;
};

export function PersonalDataCard(props: PersonalDataCardProps) {
  const {
    onZipChange,
  } = props;

  const { register, setValue, watch } = useFormContext();

  const hasCnh = watch("hasCNH");

  useEffect(() => {
    if (!hasCnh) {
      setValue("categoryCNH", "");
    }
  }, [hasCnh, setValue]);


  return (
    <Card className="w-full">
      <CardContent className="space-y-5 px-0">
        <CardHeader className="px-0">
          <h2 className="text-lg font-semibold text-[#134B73]">Dados Pessoais</h2>
        </CardHeader>
    
        <div className="grid gap-4 md:grid-cols-12">
          <LabeledInput
            id="fullName"
            containerClassName="md:col-span-6"
            label="Nome completo"
            placeholder="Informe o nome completo"
            autoComplete="name"
            {...register("fullName")}
          />
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="birthDate" className="text-[#134B73]">
              Data de nascimento
            </Label>
            <div className="relative">
              <Input
                id="birthDate"
                type="date"
                className="w-full pr-10 cursor-pointer"
                {...register("birthDate")}
              />
              <CalendarDays className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#134B73]" />
            </div>
          </div>
          <LabeledInput
            containerClassName="md:col-span-3"
            label="CPF/CNPJ"
            placeholder="Digite seu CPF ou CNPJ"
            autoComplete="off"
            {...register("cpf_cnpj")}
          />
          <LabeledInput
            id="personalEmail"
            containerClassName="md:col-span-5"
            label="E-mail"
            placeholder="Informe seu e-mail"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          <LabeledInput
            id="personalPhone"
            containerClassName="md:col-span-4"
            label="Telefone"
            placeholder="(11) 99999-9999"
            maxLength={15}
            autoComplete="tel"
            {...register("phone")}
          />
          <LabeledInput
            id="motherName"
            containerClassName="md:col-span-4"
            label="Nome da Mãe"
            placeholder="Digite nome da mãe"
            {...register("motherName")}
          />
          <LabeledInput
            id="shareholderName"
            containerClassName="md:col-span-4"
            label="Nome do Sócio"
            placeholder="Informe o nome do sócio"
            {...register("shareholderName")}
          />
          <LabeledInput
            id="companyName"
            containerClassName="md:col-span-4"
            label="Nome da Empresa"
            placeholder="Informe a empresa"
            {...register("companyName")}
          />
          <Controller
            name="maritalStatus"
            render={({ field }) => (
              <LabeledSelect
                id="maritalStatus"
                containerClassName="md:col-span-5"
                label="Estado Civil"
                placeholder="Selecione o estado civil"
                value={field.value}
                onChange={field.onChange}
              >
                <SelectItem value="Solteiro">Solteiro</SelectItem>
                <SelectItem value="Casado">Casado</SelectItem>
                <SelectItem value="Separado">Separado</SelectItem>
                <SelectItem value="Divorciado">Divorciado</SelectItem>
                <SelectItem value="Viúvo">Viúvo</SelectItem>
              </LabeledSelect>
            )}
          />
          <Controller
            name="hasCNH"
            render={({ field }) => (
              <div className="space-y-2 md:col-span-4">
                <Label htmlFor="hasCNH" className="text-[#134B73]">Possui CNH?</Label>
                <div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
                  <Switch
                    id="hasCNH"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm text-muted-foreground">{field.value ? "Sim" : "Não"}</span>
                </div>
              </div>
            )}
          />
          <Controller
            name="categoryCNH"
            render={({ field }) => (
              <LabeledSelect
                containerClassName="md:col-span-3"
                label="Categoria da CNH"
                placeholder="Selecione a categoria"
                disabled={!hasCnh}
                value={field.value}
                onChange={field.onChange}
              >
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
                <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
              </LabeledSelect>
            )}
          />
          <LabeledInput
            containerClassName="md:col-span-2"
            label="CEP"
            placeholder="00000-000"
            maxLength={9}
            autoComplete="postal-code"
            {...register("CEP", {
              onChange: (e) => {
                const value = e.target.value;
                onZipChange(value);
              }
            })}
          />
          <LabeledInput
            id="address"
            containerClassName="md:col-span-6"
            label="Endereço (Rua/Av.)"
            placeholder="Rua Exemplo, 123 - Apto 45"
            autoComplete="address-line1"
            {...register("address")}
          />
          <LabeledInput
            id="addressNumber"
            containerClassName="md:col-span-2"
            label="Número"
            placeholder="123"
            autoComplete="address-line2"
            {...register("addressNumber")}
          />
          <LabeledInput
            id="addressComplement"
            containerClassName="md:col-span-2"
            label="Complemento"
            placeholder="Apto, bloco, referência"
            {...register("addressComplement")}
          />
          <LabeledInput
            id="neighborhood"
            containerClassName="md:col-span-2"
            label="Bairro"
            placeholder="Informe o bairro"
            autoComplete="address-level3"
            {...register("neighborhood")}
          />
          <Controller
            name="UF"
            render={({ field }) => (
              <LabeledSelect
                containerClassName="md:col-span-2"
                label="UF"
                placeholder="Selecione a UF"
                value={field.value}
                onChange={field.onChange}
              >
                {[
                  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
                  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
                  "SP","SE","TO",
                ].map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </LabeledSelect>
            )}
          />
          <LabeledInput
            id="city"
            containerClassName="md:col-span-4"
            label="Cidade"
            placeholder="Informe a cidade"
            autoComplete="address-level2"
            {...register("city")}
          />
          <LabeledInput
            id="nationality"
            containerClassName="md:col-span-4"
            label="Naturalidade"
            placeholder="Informe a naturalidade"
            {...register("nationality")}
          />
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
            label="Função"
            placeholder="Cargo ou função"
            {...register("enterpriseFunction")}
          />
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="admissionDate" className="text-[#134B73]">
              Data de admissão
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
            {...register("income")}
          />
          <LabeledInput
            id="otherIncomes"
            containerClassName="md:col-span-2"
            label="Outras rendas"
            placeholder="R$ 0,00"
            inputClassName="text-right"
            {...register("otherIncomes")}
          />
          <div className="md:col-span-12 rounded-md border border-slate-200 bg-slate-50 p-5">
            <Controller
              name="acceptLGPD"
              render={({ field }) => (
                <div className="flex items-start gap-3">
                  <Switch
                    id="acceptLGPD"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="acceptLGPD" className="text-[#134B73] font-semibold">
                      Consentimento LGPD
                    </Label>
                    <p className="text-sm text-slate-700">
                      Autorizo o uso dos meus dados para análise de crédito, contato e formalização,
                      conforme a política de privacidade da Grota Financiamentos.
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
