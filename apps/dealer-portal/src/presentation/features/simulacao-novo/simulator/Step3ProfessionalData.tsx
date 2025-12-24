import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/presentation/ui/card";
import { Label } from "@/presentation/ui/label";
import { Input } from "@/presentation/ui/input";
import { Button } from "@/presentation/ui/button";
import { ArrowRight, ArrowLeft, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { formatNumberToBRL, parseBRL } from "@/lib/formatters";
import { SimulatorFormData, UpdateSimulatorFormData } from "../hooks/useSimulator";

type Step3ProfessionalDataProps = {
  formData: SimulatorFormData;
  updateFormData: UpdateSimulatorFormData;
  nextStep: () => void;
  prevStep: () => void;
};

const BRAZIL_STATES = [
  { uf: "AC", state: "Acre", capital: "Rio Branco" },
  { uf: "AL", state: "Alagoas", capital: "Maceio" },
  { uf: "AP", state: "Amapa", capital: "Macapa" },
  { uf: "AM", state: "Amazonas", capital: "Manaus" },
  { uf: "BA", state: "Bahia", capital: "Salvador" },
  { uf: "CE", state: "Ceara", capital: "Fortaleza" },
  { uf: "DF", state: "Distrito Federal", capital: "Brasilia" },
  { uf: "ES", state: "Espirito Santo", capital: "Vitoria" },
  { uf: "GO", state: "Goias", capital: "Goiania" },
  { uf: "MA", state: "Maranhao", capital: "Sao Luis" },
  { uf: "MT", state: "Mato Grosso", capital: "Cuiaba" },
  { uf: "MS", state: "Mato Grosso do Sul", capital: "Campo Grande" },
  { uf: "MG", state: "Minas Gerais", capital: "Belo Horizonte" },
  { uf: "PA", state: "Para", capital: "Belem" },
  { uf: "PB", state: "Paraiba", capital: "Joao Pessoa" },
  { uf: "PR", state: "Parana", capital: "Curitiba" },
  { uf: "PE", state: "Pernambuco", capital: "Recife" },
  { uf: "PI", state: "Piaui", capital: "Teresina" },
  { uf: "RJ", state: "Rio de Janeiro", capital: "Rio de Janeiro" },
  { uf: "RN", state: "Rio Grande do Norte", capital: "Natal" },
  { uf: "RS", state: "Rio Grande do Sul", capital: "Porto Alegre" },
  { uf: "RO", state: "Rondonia", capital: "Porto Velho" },
  { uf: "RR", state: "Roraima", capital: "Boa Vista" },
  { uf: "SC", state: "Santa Catarina", capital: "Florianopolis" },
  { uf: "SP", state: "Sao Paulo", capital: "Sao Paulo" },
  { uf: "SE", state: "Sergipe", capital: "Aracaju" },
  { uf: "TO", state: "Tocantins", capital: "Palmas" },
];

const NATURALITY_OPTIONS = Array.from(
  new Set(
    BRAZIL_STATES.flatMap(({ state, capital, uf }) => [
      `${capital} - ${uf}`,
      `${state} - ${uf}`,
    ]),
  ),
);

export default function Step3ProfessionalData({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: Step3ProfessionalDataProps) {
  const [incomeInput, setIncomeInput] = useState("");
  const [otherIncomeInput, setOtherIncomeInput] = useState("");
  const incomeFocusedRef = useRef(false);
  const otherIncomeFocusedRef = useRef(false);

  useEffect(() => {
    if (incomeFocusedRef.current) return;
    setIncomeInput(
      formData.professional.income > 0
        ? formatNumberToBRL(formData.professional.income)
        : "",
    );
  }, [formData.professional.income]);

  useEffect(() => {
    if (otherIncomeFocusedRef.current) return;
    setOtherIncomeInput(
      formData.professional.otherIncomes > 0
        ? formatNumberToBRL(formData.professional.otherIncomes)
        : "",
    );
  }, [formData.professional.otherIncomes]);

  const handleIncomeChange = (value: string) => {
    const numeric = parseBRL(value);
    setIncomeInput(value);
    updateFormData("professional", { income: numeric });
  };

  const handleOtherIncomesChange = (value: string) => {
    const numeric = parseBRL(value);
    setOtherIncomeInput(value);
    updateFormData("professional", { otherIncomes: numeric });
  };

  const validateStep = () => {
    const { professional } = formData;

    if (!professional.enterprise) {
      toast.error("Por favor, informe a empresa onde trabalha");
      return false;
    }

    if (professional.income <= 0) {
      toast.error("Por favor, informe sua renda mensal");
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
            <Briefcase className="w-5 h-5 text-[#134B73]" />
            <h2 className="text-lg font-semibold text-[#134B73]">Dados Profissionais</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Input
                value={formData.professional.enterprise}
                onChange={(e) => updateFormData("professional", { enterprise: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label>Funcao/Cargo</Label>
              <Input
                value={formData.professional.enterpriseFunction}
                onChange={(e) =>
                  updateFormData("professional", { enterpriseFunction: e.target.value })
                }
                placeholder="Seu cargo na empresa"
              />
            </div>

            <div className="space-y-2">
              <Label>Data de Admissao</Label>
              <Input
                type="date"
                value={formData.professional.admissionDate}
                onChange={(e) =>
                  updateFormData("professional", { admissionDate: e.target.value })
                }
              />
            </div>

            {formData.personType === "PF" && (
              <div className="space-y-2">
                <Label>Naturalidade</Label>
                <Input
                  value={formData.personal.nationality}
                  onChange={(e) => updateFormData("personal", { nationality: e.target.value })}
                  placeholder="Cidade/Estado de nascimento"
                  list="naturalidade-options"
                />
                <datalist id="naturalidade-options">
                  {NATURALITY_OPTIONS.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Renda Mensal</Label>
              <Input
                value={incomeInput}
                onChange={(e) => handleIncomeChange(e.target.value)}
                onFocus={() => {
                  incomeFocusedRef.current = true;
                }}
                onBlur={() => {
                  incomeFocusedRef.current = false;
                  setIncomeInput(
                    formData.professional.income > 0
                      ? formatNumberToBRL(formData.professional.income)
                      : "",
                  );
                }}
                placeholder="R$ 0,00"
                className="text-lg font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label>Outras Rendas (opcional)</Label>
              <Input
                value={otherIncomeInput}
                onChange={(e) => handleOtherIncomesChange(e.target.value)}
                onFocus={() => {
                  otherIncomeFocusedRef.current = true;
                }}
                onBlur={() => {
                  otherIncomeFocusedRef.current = false;
                  setOtherIncomeInput(
                    formData.professional.otherIncomes > 0
                      ? formatNumberToBRL(formData.professional.otherIncomes)
                      : "",
                  );
                }}
                placeholder="R$ 0,00"
                className="text-lg font-semibold"
              />
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-[#134B73]/20">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Renda Total Mensal:</span>
              <span className="text-2xl font-bold text-[#134B73]">
                {formatNumberToBRL(
                  formData.professional.income + formData.professional.otherIncomes,
                )}
              </span>
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
          Proximo: Revisao
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
