import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/presentation/layout/components/ui/card";
import { Label } from "@/presentation/layout/components/ui/label";
import { Input } from "@/presentation/layout/components/ui/input";
import { Button } from "@/presentation/layout/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/layout/components/ui/select";
import { Switch } from "@/presentation/layout/components/ui/switch";
import { ArrowRight, ArrowLeft, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { maskCPF, maskPhone } from "@/lib/masks";
import { maskCEP, maskCNPJ } from "@/application/core/utils/masks";
import { formatName } from "@/lib/formatters";
import { convertBRtoISO } from "@/application/core/utils/formatters";
import { StatusBadge } from "@/presentation/features/logista/components/status-badge";
import { SimulatorFormData, UpdateSimulatorFormData } from "../hooks/useSimulator";

type Step2PersonalDataProps = {
  formData: SimulatorFormData;
  updateFormData: UpdateSimulatorFormData;
  nextStep: () => void;
  prevStep: () => void;
};

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const validatePhone = (value: string) => digitsOnly(value).length >= 10;

const CNPJ_STATUS_LABELS: Record<string, string> = {
  "01": "Nula",
  "02": "Ativa",
  "03": "Suspensa",
  "04": "Inapta",
  "08": "Baixada",
};

const normalizeCnpjStatusTone = (status?: string | null) => {
  const raw = (status ?? "").toString().trim().toLowerCase();
  if (!raw) return "pendente";

  const digits = raw.replace(/\D/g, "");
  if (digits) {
    if (digits === "02") return "aprovada";
    if (["01", "03", "04", "08"].includes(digits)) return "recusada";
  }

  const normalized = raw.replace(/[^a-z]+/g, " ");

  const isActive = ["ativa", "ativo", "active", "regular", "regularizada"].some(
    (value) => normalized.includes(value),
  );
  if (isActive) return "aprovada";

  const isInactive = [
    "baixada",
    "suspensa",
    "suspenso",
    "inapta",
    "inativa",
    "inativada",
    "cancelada",
    "nula",
    "irregular",
  ].some((value) => normalized.includes(value));
  if (isInactive) return "recusada";

  return "pendente";
};

const formatCnpjStatusLabel = (status?: string | null) => {
  const raw = (status ?? "").toString().trim();
  if (!raw) return "Status nao informado";

  const digits = raw.replace(/\D/g, "");
  if (digits) {
    return CNPJ_STATUS_LABELS[digits] ?? "Status nao informado";
  }

  return raw;
};

export default function Step2PersonalData({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: Step2PersonalDataProps) {
  const [searchingDoc, setSearchingDoc] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  const [cnpjStatus, setCnpjStatus] = useState<string | null>(null);
  const [cnpjVerified, setCnpjVerified] = useState(false);

  const cnpjStatusLabel = formatCnpjStatusLabel(cnpjStatus);
  const cnpjStatusTone = normalizeCnpjStatusTone(cnpjStatus);
  const cnpjVerificationLabel = cnpjVerified ? "Verificado" : "Nao verificado";
  const cnpjVerificationTone = cnpjVerified ? "aprovada" : "pendente";

  useEffect(() => {
    if (formData.personType !== "PJ") {
      setCnpjStatus(null);
      setCnpjVerified(false);
    }
  }, [formData.personType]);

  const handleDocumentChange = async (value: string) => {
    const masked = formData.personType === "PJ" ? maskCNPJ(value) : maskCPF(value);
    updateFormData("personal", { cpfCnpj: masked });

    const digits = digitsOnly(masked);
    const isComplete = formData.personType === "PJ" ? digits.length === 14 : digits.length === 11;

    if (!isComplete) {
      if (formData.personType === "PJ") {
        setCnpjStatus(null);
        setCnpjVerified(false);
      }
      return;
    }

    try {
      setSearchingDoc(true);
      if (formData.personType === "PF") {
        setCnpjStatus(null);
        setCnpjVerified(false);
        const res = await fetch("/api/searchCPF", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cpf: digits }),
        });
        const response = await res.json();
        if (response?.success) {
          const data = response?.data?.response?.content;
          updateFormData("personal", {
            name: formatName(data?.nome?.conteudo?.nome || ""),
            motherName: formatName(data?.nome?.conteudo?.mae || ""),
            birthday: convertBRtoISO(data?.nome?.conteudo?.data_nascimento || ""),
          });
          toast.success("Dados carregados com sucesso!");
        }
      } else {
        const res = await fetch("/api/searchCNPJ", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cnpj: digits }),
        });
        const response = await res.json();
        if (response?.success && (response?.data?.data?.cnpj || response?.data?.cnpj)) {
          const cnpjData =
            response?.data?.data?.cnpj ??
            response?.data?.cnpj ??
            response?.data?.response?.content?.cnpj ??
            response?.data?.response?.content ??
            null;

          const razaoSocial =
            cnpjData?.empresa?.razao_social ??
            cnpjData?.razao_social ??
            cnpjData?.empresa?.nome_empresarial ??
            cnpjData?.nome_empresarial ??
            "";

          const emailValue =
            cnpjData?.estabelecimento?.email ??
            cnpjData?.email ??
            cnpjData?.empresa?.email ??
            cnpjData?.empresa?.email_contato ??
            "";

          const buildPhone = (ddd?: string | number | null, phone?: string | number | null) => {
            const dddDigits = digitsOnly(String(ddd ?? ""));
            const phoneDigits = digitsOnly(String(phone ?? ""));
            if (!dddDigits && !phoneDigits) return "";
            if (phoneDigits.startsWith(dddDigits)) {
              return phoneDigits;
            }
            return `${dddDigits}${phoneDigits}`;
          };

          const phoneCandidates = [
            buildPhone(cnpjData?.estabelecimento?.ddd1, cnpjData?.estabelecimento?.telefone1),
            buildPhone(cnpjData?.estabelecimento?.ddd2, cnpjData?.estabelecimento?.telefone2),
            buildPhone(cnpjData?.estabelecimento?.ddd3, cnpjData?.estabelecimento?.telefone3),
            digitsOnly(cnpjData?.telefone ?? ""),
            digitsOnly(cnpjData?.telefone1 ?? ""),
            digitsOnly(cnpjData?.telefone2 ?? ""),
          ];

          const phoneDigits = phoneCandidates.find((candidate) => candidate.length >= 10) ?? "";
          const maskedPhone = phoneDigits ? maskPhone(phoneDigits) : "";

          const statusValue =
            cnpjData?.empresa?.situacao_cadastral ??
            cnpjData?.situacao_cadastral ??
            cnpjData?.situacao ??
            cnpjData?.status ??
            cnpjData?.estabelecimento?.situacao_cadastral ??
            null;

          const statusText =
            typeof statusValue === "string"
              ? statusValue
              : typeof statusValue === "number"
                ? String(statusValue)
                : statusValue && typeof statusValue === "object"
                  ? String(
                      (statusValue as Record<string, unknown>).descricao ??
                        (statusValue as Record<string, unknown>).description ??
                        (statusValue as Record<string, unknown>).nome ??
                        (statusValue as Record<string, unknown>).codigo ??
                        "",
                    )
                  : "";

          setCnpjStatus(statusText || null);
          setCnpjVerified(true);

          updateFormData("personal", {
            name: formatName(razaoSocial || ""),
            companyName: formatName(razaoSocial || ""),
            shareholderName: formatName(cnpjData?.socios?.[0]?.nome_socio || ""),
            email: emailValue || formData.personal.email,
            phone: maskedPhone || formData.personal.phone,
          });
          toast.success("Dados da empresa carregados!");
        } else {
          setCnpjStatus(null);
          setCnpjVerified(false);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
      setCnpjStatus(null);
      setCnpjVerified(false);
    } finally {
      setSearchingDoc(false);
    }
  };

  const handleCepChange = async (value: string) => {
    const masked = maskCEP(value);
    updateFormData("address", { cep: masked });

    const digits = digitsOnly(masked);
    if (digits.length !== 8) return;

    try {
      setSearchingCep(true);
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data?.erro) {
        updateFormData("address", {
          address: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          uf: data.uf || "",
        });
        toast.success("Endereco encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setSearchingCep(false);
    }
  };

  const validateStep = () => {
    const { personal, address } = formData;

    if (!personal.cpfCnpj) {
      toast.error("CPF/CNPJ e obrigatorio");
      return false;
    }

    if (formData.personType === "PF" && digitsOnly(personal.cpfCnpj).length !== 11) {
      toast.error("CPF invalido");
      return false;
    }

    if (formData.personType === "PJ" && digitsOnly(personal.cpfCnpj).length !== 14) {
      toast.error("CNPJ invalido");
      return false;
    }

    if (!personal.name) {
      toast.error("Nome e obrigatorio");
      return false;
    }

    if (!personal.email || !validateEmail(personal.email)) {
      toast.error("Email invalido");
      return false;
    }

    if (!personal.phone || !validatePhone(personal.phone)) {
      toast.error("Telefone invalido");
      return false;
    }

    if (!address.cep || !address.address || !address.city) {
      toast.error("Por favor, preencha o endereco completo");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#134B73]" />
            <h2 className="text-lg font-semibold text-[#134B73]">Dados Pessoais</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{formData.personType === "PF" ? "CPF" : "CNPJ"}</Label>
              <div className="relative">
                <Input
                  value={formData.personal.cpfCnpj}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  placeholder={formData.personType === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
                  maxLength={formData.personType === "PF" ? 14 : 18}
                />
                {searchingDoc && (
                  <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-[#134B73]" />
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Nome Completo / Razao Social</Label>
              <Input
                value={formData.personal.name}
                onChange={(e) => updateFormData("personal", { name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            {formData.personType === "PJ" && (
              <div className="space-y-2 md:col-span-3">
                <Label>Status do CNPJ (Receita)</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={cnpjStatusTone} className="shadow-none">
                    {cnpjStatusLabel}
                  </StatusBadge>
                  <StatusBadge status={cnpjVerificationTone} className="shadow-none">
                    {cnpjVerificationLabel}
                  </StatusBadge>
                </div>
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={formData.personal.email}
                onChange={(e) => updateFormData("personal", { email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={formData.personal.phone}
                onChange={(e) =>
                  updateFormData("personal", { phone: maskPhone(e.target.value) })
                }
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
          </div>

          {formData.personType === "PF" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Nome da Mae</Label>
                <Input
                  value={formData.personal.motherName}
                  onChange={(e) => updateFormData("personal", { motherName: e.target.value })}
                  placeholder="Nome da mae"
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Nascimento</Label>
                <Input
                  type="date"
                  value={formData.personal.birthday}
                  onChange={(e) => updateFormData("personal", { birthday: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Estado Civil</Label>
                <Select
                  value={formData.personal.maritalStatus}
                  onValueChange={(value) =>
                    updateFormData("personal", { maritalStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="Viuvo">Viuvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Switch
                  checked={formData.personal.hasCnh}
                  onCheckedChange={(checked) => updateFormData("personal", { hasCnh: checked })}
                />
                <Label>Possui CNH?</Label>
              </div>

              {formData.personal.hasCnh && (
                <div className="space-y-2">
                  <Label>Categoria CNH</Label>
                  <Select
                    value={formData.personal.cnhCategory}
                    onValueChange={(value) =>
                      updateFormData("personal", { cnhCategory: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {formData.personType === "PJ" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Nome do Socio</Label>
                <Input
                  value={formData.personal.shareholderName}
                  onChange={(e) =>
                    updateFormData("personal", { shareholderName: e.target.value })
                  }
                  placeholder="Nome do socio principal"
                />
              </div>
              <div className="space-y-2">
                <Label>Nome Fantasia</Label>
                <Input
                  value={formData.personal.companyName}
                  onChange={(e) =>
                    updateFormData("personal", { companyName: e.target.value })
                  }
                  placeholder="Nome fantasia da empresa"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[#134B73]">Endereco</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>CEP</Label>
              <div className="relative">
                <Input
                  value={formData.address.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                />
                {searchingCep && (
                  <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-[#134B73]" />
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Endereco</Label>
              <Input
                value={formData.address.address}
                onChange={(e) => updateFormData("address", { address: e.target.value })}
                placeholder="Rua, Av, etc"
              />
            </div>

            <div className="space-y-2">
              <Label>Numero</Label>
              <Input
                value={formData.address.number}
                onChange={(e) => updateFormData("address", { number: e.target.value })}
                placeholder="Numero"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Complemento</Label>
              <Input
                value={formData.address.complement}
                onChange={(e) => updateFormData("address", { complement: e.target.value })}
                placeholder="Apto, sala, etc"
              />
            </div>

            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                value={formData.address.neighborhood}
                onChange={(e) => updateFormData("address", { neighborhood: e.target.value })}
                placeholder="Bairro"
              />
            </div>

            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                value={formData.address.city}
                onChange={(e) => updateFormData("address", { city: e.target.value })}
                placeholder="Cidade"
              />
            </div>

            <div className="space-y-2">
              <Label>UF</Label>
              <Select
                value={formData.address.uf}
                onValueChange={(value) => updateFormData("address", { uf: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
                    "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
                    "SP","SE","TO",
                  ].map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={prevStep} variant="outline" size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button onClick={handleNext} size="lg" className="bg-[#134B73] hover:bg-[#0f3a5a]">
          Proximo: Dados Profissionais
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
