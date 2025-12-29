import { useEffect, useRef, useState } from "react";
import { Button, Card, Input, Typography } from "antd";
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

export default function Step3ProfessionalData({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: Step3ProfessionalDataProps) {
  const blueInputClass = "border-[#134B73] focus-visible:border-[#134B73] focus-visible:ring-[#134B73]/30";
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
      <Card
        title={
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#134B73]" />
            <span className="text-lg font-semibold text-[#134B73]">Dados Profissionais</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Typography.Text>Empresa</Typography.Text>
              <Input
                value={formData.professional.enterprise}
                onChange={(e) => updateFormData("professional", { enterprise: e.target.value })}
                placeholder="Nome da empresa"
                className={blueInputClass}
              />
            </div>

            <div className="space-y-2">
              <Typography.Text>Funcao/Cargo</Typography.Text>
              <Input
                value={formData.professional.enterpriseFunction}
                onChange={(e) =>
                  updateFormData("professional", { enterpriseFunction: e.target.value })
                }
                placeholder="Seu cargo na empresa"
                className={blueInputClass}
              />
            </div>

            <div className="space-y-2">
              <Typography.Text>Data de Admissao</Typography.Text>
              <Input
                type="date"
                value={formData.professional.admissionDate}
                onChange={(e) =>
                  updateFormData("professional", { admissionDate: e.target.value })
                }
                className={blueInputClass}
              />
            </div>

            {formData.personType === "PF" && (
              <div className="space-y-2">
                <Typography.Text>Naturalidade</Typography.Text>
                <Input
                  value={formData.personal.nationality}
                  onChange={(e) => updateFormData("personal", { nationality: e.target.value })}
                  placeholder="Cidade/Estado de nascimento"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Typography.Text>Renda Mensal</Typography.Text>
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
                className={`${blueInputClass} text-lg font-semibold`}
              />
            </div>

            <div className="space-y-2">
              <Typography.Text>Outras Rendas (opcional)</Typography.Text>
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
                className={`${blueInputClass} text-lg font-semibold`}
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
        </div>
      </Card>

      <div className="flex justify-between">
        <Button onClick={prevStep} type="default" size="large">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button onClick={handleNext} type="primary" size="large">
          Proximo: Revisao
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
