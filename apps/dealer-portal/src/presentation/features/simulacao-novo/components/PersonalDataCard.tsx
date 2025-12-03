import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Switch } from "@/presentation/ui/switch";
import { Label } from "@/presentation/ui/label";
import { SelectItem } from "@/presentation/ui/select";
import { LabeledInput } from "./LabeledInput";
import { LabeledSelect } from "./LabeledSelect";

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
  } = props;

  return (
    <Card className="w-full">
      <CardHeader className="-mt-5">
        <h2 className="text-lg font-semibold text-[#134B73] -mb-5">Dados Pessoais</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-12">
          <LabeledInput
            containerClassName="md:col-span-3"
            label="CPF/CNPJ"
            placeholder="Digite seu CPF ou CNPJ"
            value={personalCpf}
            onChange={onCpfChange}
            autoComplete="off"
          />
          <LabeledInput
            id="personalEmail"
            containerClassName="md:col-span-5"
            label="E-mail"
            placeholder="Informe seu e-mail"
            type="email"
            value={personalEmail}
            onChange={onEmailChange}
            autoComplete="email"
          />
          <LabeledInput
            id="personalPhone"
            containerClassName="md:col-span-4"
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={personalPhone}
            maxLength={15}
            onChange={onPhoneChange}
            autoComplete="tel"
          />
          <LabeledInput
            id="personalMother"
            containerClassName="md:col-span-4"
            label="Nome da Mãe"
            placeholder="Digite nome da mãe"
            value={personalMother}
            onChange={onMotherChange}
          />
          <LabeledInput
            id="personalPartnerName"
            containerClassName="md:col-span-4"
            label="Nome do Sócio"
            placeholder="Informe o nome do sócio"
            value={personalPartnerName}
            onChange={onPartnerNameChange}
          />
          <LabeledInput
            id="personalCompanyName"
            containerClassName="md:col-span-4"
            label="Nome da Empresa"
            placeholder="Informe a empresa"
            value={personalCompanyName}
            onChange={onCompanyNameChange}
          />
          <LabeledSelect
            id="civilStatus"
            containerClassName="md:col-span-5"
            label="Estado Civil"
            value={personalCivilStatus}
            onChange={onCivilStatusChange}
            placeholder="Selecione o estado civil"
          >
            <SelectItem value="A">Solteiro</SelectItem>
            <SelectItem value="B">Casado</SelectItem>
            <SelectItem value="AB">Separado</SelectItem>
            <SelectItem value="C">Divorciado</SelectItem>
            <SelectItem value="D">Viúvo</SelectItem>
          </LabeledSelect>
          <div className="space-y-2 md:col-span-4">
            <Label htmlFor="haveCNH" className="text-[#134B73]">Possui CNH?</Label>
            <div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
              <Switch
                id="haveCNH-inline"
                checked={personalHasCnh}
                onCheckedChange={(checked) => onHasCnhChange(!!checked)}
              />
              <span className="text-sm text-muted-foreground">{personalHasCnh ? "Sim" : "Não"}</span>
            </div>
          </div>
          <LabeledSelect
            containerClassName="md:col-span-3"
            label="Categoria da CNH"
            value={personalCategoryCnh}
            onChange={onCategoryCnhChange}
            placeholder="Selecione a categoria"
            disabled={!personalHasCnh}
          >
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="AB">AB</SelectItem>
            <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
              </LabeledSelect>
          <LabeledInput
            containerClassName="md:col-span-2"
            label="CEP"
            placeholder="00000-000"
            maxLength={9}
            value={personalZip}
            onChange={onZipChange}
            autoComplete="postal-code"
          />
          <LabeledInput
            id="personalAddress"
            containerClassName="md:col-span-6"
            label="Endereço (Rua/Av.)"
            placeholder="Rua Exemplo, 123 - Apto 45"
            value={personalAddress}
            onChange={onAddressChange}
            autoComplete="address-line1"
          />
          <LabeledInput
            id="personalNumber"
            containerClassName="md:col-span-2"
            label="Número"
            placeholder="123"
            value={personalNumber}
            onChange={onNumberChange}
            autoComplete="address-line2"
          />
          <LabeledInput
            id="personalComplement"
            containerClassName="md:col-span-2"
            label="Complemento"
            placeholder="Apto, bloco, referência"
            value={personalComplement}
            onChange={onComplementChange}
          />
          <LabeledInput
            id="personalNeighborhood"
            containerClassName="md:col-span-2"
            label="Bairro"
            placeholder="Informe o bairro"
            value={personalNeighborhood}
            onChange={onNeighborhoodChange}
            autoComplete="address-level3"
          />
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
            value={personalCity}
            onChange={onCityChange}
            autoComplete="address-level2"
          />
          <LabeledInput
            id="birthPlace"
            containerClassName="md:col-span-4"
            label="Naturalidade"
            placeholder="Informe a naturalidade"
            value={personalBirthCity}
            onChange={onBirthCityChange}
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
