"use client";

import { useEffect } from "react";
import { Card, Input, Switch, Typography } from "antd";
import { CalendarDays } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { maskCPF, maskPhone } from "@/lib/masks";
import { maskCEP, maskCNPJ } from "@/application/core/utils/masks";
import { formatName } from "@/lib/formatters";
import { LabeledInput } from "./LabeledInput";
import { LabeledSelect } from "./LabeledSelect";

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
    <Card
      className="w-full h-full"
      title={<span className="text-lg font-semibold text-[#134B73]">Dados Pessoais</span>}
    >
      <div className="space-y-5">
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
                handleDocumentChange(e.target.value);
              },
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
              },
            })}
            disabled={searchingLoading || !personType}
          />
          <LabeledInput
            id="motherName"
            containerClassName="md:col-span-4"
            label="Nome da Mae"
            placeholder="Digite nome da mae"
            {...register("motherName")}
            disabled={searchingLoading || !personType}
          />
          <div className="space-y-2 md:col-span-2">
            <Typography.Text className="text-[#134B73]">
              Data de nascimento
            </Typography.Text>
            <Input
              id="birthday"
              type="date"
              className="w-full pr-10 cursor-pointer"
              suffix={<CalendarDays className="h-4 w-4 text-[#134B73]" />}
              {...register("birthday")}
              disabled={searchingLoading || !personType}
            />
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
                options={[
                  { value: "Solteiro", label: "Solteiro" },
                  { value: "Casado", label: "Casado" },
                  { value: "Separado", label: "Separado" },
                  { value: "Divorciado", label: "Divorciado" },
                  { value: "Viuvo", label: "Viuvo" },
                ]}
              />
            )}
          />
          <Controller
            name="hasCNH"
            render={({ field }) => (
              <div className="space-y-2 md:col-span-2">
                <Typography.Text className="text-[#134B73]">Possui CNH?</Typography.Text>
                <div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={!personType}
                  />
                  <span className="text-sm text-muted-foreground">{field.value ? "Sim" : "Nao"}</span>
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
                options={[
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                  { value: "AB", label: "AB" },
                  { value: "C", label: "C" },
                  { value: "D", label: "D" },
                  { value: "E", label: "E" },
                ]}
              />
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
              },
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
            label="Nome do Socio"
            placeholder="Informe o nome do socio"
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
                onZipChange(e.target.value);
              },
            })}
            disabled={searchingCPFLoading || !personType}
          />
          <LabeledInput
            id="address"
            containerClassName="md:col-span-6"
            label="Endereco (Rua/Av.)"
            placeholder="Rua Exemplo, 123 - Apto 45"
            autoComplete="address-line1"
            {...register("address")}
            disabled={searchingCPFLoading || !personType}
          />
          <LabeledInput
            id="addressNumber"
            containerClassName="md:col-span-1"
            label="Numero"
            placeholder="123"
            autoComplete="address-line2"
            {...register("addressNumber")}
            disabled={!personType}
          />
          <LabeledInput
            id="addressComplement"
            containerClassName="md:col-span-3"
            label="Complemento"
            placeholder="Apto, bloco, referencia"
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
                options={[
                  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
                  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
                  "SP","SE","TO",
                ].map((uf) => ({ value: uf, label: uf }))}
              />
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
                    onChange={field.onChange}
                  />
                  <div className="space-y-1">
                    <Typography.Text className="text-[#134B73] font-semibold">
                      Consentimento LGPD
                    </Typography.Text>
                    <p className="text-sm text-slate-700">
                      Autorizo o uso dos meus dados para analise de credito, contato e formalizacao,
                      conforme a politica de privacidade da Grota Financiamentos.
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
