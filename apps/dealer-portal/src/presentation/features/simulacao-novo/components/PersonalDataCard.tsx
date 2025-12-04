import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Switch } from "@/presentation/ui/switch";
import { Label } from "@/presentation/ui/label";
import { SelectItem } from "@/presentation/ui/select";
import { LabeledInput } from "./LabeledInput";
import { LabeledSelect } from "./LabeledSelect";
import { Input } from "@/presentation/ui/input";
import { CalendarDays } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

type PersonalDataCardProps = {
  personalCpf: string;
  onCpfChange: (value: string) => void;
  personalEmail: string;
  onEmailChange: (value: string) => void;
  personalPhone: string;
  onPhoneChange: (value: string) => void;
  personalMother: string;
  onMotherChange: (value: string) => void;
  personalCivilStatus: string;
  onCivilStatusChange: (value: string) => void;
  personalHasCnh: boolean;
  onHasCnhChange: (value: boolean) => void;
  personalCategoryCnh: string;
  onCategoryCnhChange: (value: string) => void;
  personalZip: string;
  onZipChange: (value: string) => void;
  personalAddress: string;
  onAddressChange: (value: string) => void;
  personalNumber: string;
  onNumberChange: (value: string) => void;
  personalComplement: string;
  onComplementChange: (value: string) => void;
  personalPartnerName: string;
  onPartnerNameChange: (value: string) => void;
  personalCompanyName: string;
  onCompanyNameChange: (value: string) => void;
  personalNeighborhood: string;
  onNeighborhoodChange: (value: string) => void;
  personalBirthUf: string;
  onBirthUfChange: (value: string) => void;
  personalCity: string;
  onCityChange: (value: string) => void;
  personalBirthCity: string;
  onBirthCityChange: (value: string) => void;
  privacyConsent: boolean;
  onPrivacyConsentChange: (value: boolean) => void;
  ufCapitals: Record<string, string>;
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

export function PersonalDataCard(props: PersonalDataCardProps) {
  const {
    personalCpf,
    onCpfChange,
    personalEmail,
    onEmailChange,
    personalPhone,
    onPhoneChange,
    personalMother,
    onMotherChange,
    personalCivilStatus,
    onCivilStatusChange,
    personalHasCnh,
    onHasCnhChange,
    personalCategoryCnh,
    onCategoryCnhChange,
    personalZip,
    onZipChange,
    personalAddress,
    onAddressChange,
    personalNumber,
    onNumberChange,
    personalComplement,
    onComplementChange,
    personalPartnerName,
    onPartnerNameChange,
    personalCompanyName,
    onCompanyNameChange,
    personalNeighborhood,
    onNeighborhoodChange,
    personalBirthUf,
    onBirthUfChange,
    personalCity,
    onCityChange,
    personalBirthCity,
    onBirthCityChange,
    privacyConsent,
    onPrivacyConsentChange,
    ufCapitals,
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
  } = props;

  const { register, watch, setValue, control } = useFormContext();

  return (
    <Card className="w-full">
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
            id="personalMother"
            containerClassName="md:col-span-4"
            label="Nome da Mãe"
            placeholder="Digite nome da mãe"
            {...register("motherName")}
          />
          <LabeledInput
            id="personalPartnerName"
            containerClassName="md:col-span-4"
            label="Nome do Sócio"
            placeholder="Informe o nome do sócio"
            {...register("shareholderName")}
          />
          <LabeledInput
            id="personalCompanyName"
            containerClassName="md:col-span-4"
            label="Nome da Empresa"
            placeholder="Informe a empresa"
            {...register("companyName")}
          />
          <Controller
            name="maritalStatus"
            control={control}
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
            name="hasCnh"
            control={control}
            render={({ field }) => (
              <div className="space-y-2 md:col-span-4">
                <Label htmlFor="haveCNH" className="text-[#134B73]">Possui CNH?</Label>
                <div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
                  <Switch
                    id="hasCnh-inline"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm text-muted-foreground">{personalHasCnh ? "Sim" : "Não"}</span>
                </div>
              </div>
            )}
          />
          <Controller
            name="categoryCNH"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <LabeledSelect
                containerClassName="md:col-span-3"
                label="Categoria da CNH"
                placeholder="Selecione a categoria"
                disabled={!personalHasCnh}
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
            {...register("CEP")}
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
          {/* Parei aqui */}
          <LabeledSelect
            id="birthUf"
            containerClassName="md:col-span-2"
            label="UF"
            value={personalBirthUf}
            onChange={(value) => {
              onBirthUfChange(value);
              onCityChange(ufCapitals[value] ?? personalCity);
            }}
            placeholder="Selecione a UF"
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
          <LabeledInput
            id="personalCity"
            containerClassName="md:col-span-4"
            label="Cidade"
            placeholder="Informe a cidade"
            //@ts-ignore
            value={personalCity}
            onChange={onCityChange}
            autoComplete="address-level2"
          />
          <LabeledInput
            id="birthPlace"
            containerClassName="md:col-span-4"
            label="Naturalidade"
            placeholder="Informe a naturalidade"
                      //@ts-ignore
            value={personalBirthCity}
            onChange={onBirthCityChange}
          />
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
          <div className="md:col-span-12 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <Switch
                id="privacyConsent"
                checked={privacyConsent}
                onCheckedChange={(checked) => onPrivacyConsentChange(!!checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="privacyConsent" className="text-[#134B73] font-semibold">
                  Consentimento LGPD
                </Label>
                <p className="text-sm text-slate-700">
                  Autorizo o uso dos meus dados para análise de crédito, contato e formalização,
                  conforme a política de privacidade da Grota Financiamentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
