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
import { maskCPF, maskPhone } from "@/lib/masks";
import { maskCEP, maskCNPJ } from "@/application/core/utils/masks";
import { formatName } from "@/lib/formatters";

type PersonalDataCardProps = {
  onZipChange: (value: string) => void;
  handleDocumentChange: (value: string) => void;
  cpfSituation: string;
  searchingLoading: boolean;
  searchingCPFLoading: boolean;
  personType: "PF" | "PJ" | null;
};

export function PersonalDataCard({
  onZipChange,
  handleDocumentChange,
  cpfSituation,
  searchingLoading,
  searchingCPFLoading,
  personType,
}: PersonalDataCardProps) {
  const { register, setValue, watch } = useFormContext();

  const hasCnh = watch("hasCNH");

  useEffect(() => {
    if (!hasCnh) {
      setValue("categoryCNH", "");
    }
  }, [hasCnh, setValue]);

  return (
    <Card className="w-full h-full">
      <CardContent className="space-y-5 px-0">
        <CardHeader className="px-0">
          <h2 className="text-lg font-semibold text-[#134B73]">Dados Pessoais</h2>
        </CardHeader>

        <div className="grid gap-4 md:grid-cols-12">
          <LabeledInput
            containerClassName="md:col-span-3"
            label="CPF/CNPJ"
            placeholder="Digite seu CPF ou CNPJ"
            autoComplete="off"
            {...register("cpf_cnpj", {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = personType === "PJ"
                  ? maskCNPJ(e.target.value)
                  : maskCPF(e.target.value);
                const value = e.target.value;
                handleDocumentChange(value);
              }
            })}
            warning={cpfSituation}
            loading={searchingLoading}
            disabled={searchingLoading || !personType}
          />
          <LabeledInput
            containerClassName="md:col-span-5"
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            autoComplete="off"
            {...register("name", {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = formatName(e.target.value);
              }
            })}
            disabled={searchingLoading || !personType}
          />
          <LabeledInput
            id="motherName"
            containerClassName="md:col-span-4"
            label="Nome da MÇœe"
            placeholder="Digite nome da mÇœe"
            {...register("motherName")}
            disabled={searchingLoading || !personType}
          />
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="birthday" className="text-[#134B73]">
              Data de nascimento
            </Label>
            <div className="relative">
              <Input
                id="birthday"
                type="date"
                className="w-full pr-10 cursor-pointer"
                {...register("birthday")}
                disabled={searchingLoading || !personType}
              />
              <CalendarDays className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#134B73]" />
            </div>
          </div>
          <Controller
            name="maritalStatus"
            render={({ field }) => (
              <LabeledSelect
                id="maritalStatus"
                containerClassName="md:col-span-2"
                label="Estado Civil"
                placeholder="Estado civil"
                value={field.value}
                onChange={field.onChange}
                disabled={!personType}
              >
                <SelectItem value="Solteiro">Solteiro</SelectItem>
                <SelectItem value="Casado">Casado</SelectItem>
                <SelectItem value="Separado">Separado</SelectItem>
                <SelectItem value="Divorciado">Divorciado</SelectItem>
                <SelectItem value="ViÇ§vo">ViÇ§vo</SelectItem>
              </LabeledSelect>
            )}
          />
          <Controller
            name="hasCNH"
            render={({ field }) => (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hasCNH" className="text-[#134B73]">Possui CNH?</Label>
                <div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
                  <Switch
                    id="hasCNH"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-sky-800 data-[state=unchecked]:bg-gray-300"
                    disabled={!personType}
                  />
                  <span className="text-sm text-muted-foreground">{field.value ? "Sim" : "NÇœo"}</span>
                </div>
              </div>
            )}
          />
          <Controller
            name="categoryCNH"
            render={({ field }) => (
              <LabeledSelect
                containerClassName="md:col-span-2"
                label="Categoria da CNH"
                placeholder="Categoria CNH"
                disabled={!hasCnh || !personType}
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
            id="personalEmail"
            containerClassName="md:col-span-4"
            label="E-mail"
            placeholder="Informe seu e-mail"
            type="email"
            autoComplete="email"
            {...register("email")}
            disabled={searchingLoading || !personType}
          />
          <LabeledInput
            id="personalPhone"
            containerClassName="md:col-span-2"
            label="Telefone"
            placeholder="(11) 99999-9999"
            maxLength={15}
            autoComplete="tel"
            {...register("phone", {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = maskPhone(e.target.value);
              }
            })}
            disabled={searchingLoading || !personType}
          />
          <LabeledInput
            id="companyName"
            containerClassName="md:col-span-5"
            label="Nome da Empresa"
            placeholder="Informe a empresa"
            {...register("companyName")}
            disabled={searchingLoading || !personType}
          />
          <LabeledInput
            id="shareholderName"
            containerClassName="md:col-span-5"
            label="Nome do SÇücio"
            placeholder="Informe o nome do sÇücio"
            {...register("shareholderName")}
            disabled={searchingLoading || !personType}
          />
          <LabeledInput
            containerClassName="md:col-span-2"
            label="CEP"
            placeholder="00000-000"
            maxLength={9}
            autoComplete="postal-code"
            {...register("CEP", {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = maskCEP(e.target.value);
                const value = e.target.value;
                onZipChange(value);
              }
            })}
            disabled={searchingCPFLoading || !personType}
          />
          <LabeledInput
            id="address"
            containerClassName="md:col-span-6"
            label="EndereÇõo (Rua/Av.)"
            placeholder="Rua Exemplo, 123 - Apto 45"
            autoComplete="address-line1"
            {...register("address")}
            disabled={searchingCPFLoading || !personType}
          />
          <LabeledInput
            id="addressNumber"
            containerClassName="md:col-span-1"
            label="NÇ§mero"
            placeholder="123"
            autoComplete="address-line2"
            {...register("addressNumber")}
            disabled={!personType}
          />
          <LabeledInput
            id="addressComplement"
            containerClassName="md:col-span-3"
            label="Complemento"
            placeholder="Apto, bloco, referÇ¦ncia"
            {...register("addressComplement")}
            disabled={!personType}
          />
          <LabeledInput
            id="neighborhood"
            containerClassName="md:col-span-2"
            label="Bairro"
            placeholder="Informe o bairro"
            autoComplete="address-level3"
            {...register("neighborhood")}
            disabled={searchingCPFLoading || !personType}
          />
          <LabeledInput
            id="city"
            containerClassName="md:col-span-4"
            label="Cidade"
            placeholder="Informe a cidade"
            autoComplete="address-level2"
            {...register("city")}
            disabled={searchingCPFLoading || !personType}
          />
          <Controller
            name="UF"
            render={({ field }) => (
              <LabeledSelect
                containerClassName="md:col-span-1"
                label="UF"
                placeholder="UF"
                value={field.value}
                onChange={field.onChange}
                disabled={searchingCPFLoading || !personType}
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
            id="nationality"
            containerClassName="md:col-span-5"
            label="Naturalidade"
            placeholder="Informe a naturalidade"
            {...register("nationality")}
            disabled={!personType}
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
                    className="data-[state=checked]:bg-sky-800 data-[state=unchecked]:bg-gray-300"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="acceptLGPD" className="text-[#134B73] font-semibold">
                      Consentimento LGPD
                    </Label>
                    <p className="text-sm text-slate-700">
                      Autorizo o uso dos meus dados para anÇ­lise de crÇ¸dito, contato e formalizaÇõÇœo,
                      conforme a polÇðtica de privacidade da Grota Financiamentos.
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
