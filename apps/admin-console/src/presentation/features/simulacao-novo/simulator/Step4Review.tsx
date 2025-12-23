import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/presentation/layout/components/ui/card";
import { Label } from "@/presentation/layout/components/ui/label";
import { Button } from "@/presentation/layout/components/ui/button";
import { Switch } from "@/presentation/layout/components/ui/switch";
import { Separator } from "@/presentation/layout/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { createProposal } from "@/application/services/Proposals/proposalService";
import { formatNumberToBRL } from "@/lib/formatters";
import { SimulatorFormData, UpdateSimulatorField } from "../hooks/useSimulator";

type Calculation = {
  financed_amount: number;
  down_payment: number;
  term_months: number;
  monthly_payment: number;
  total_amount: number;
  first_payment_date: Date;
  last_payment_date: Date;
};

type Step4ReviewProps = {
  formData: SimulatorFormData;
  updateField: UpdateSimulatorField;
  prevStep: () => void;
  clearData: () => void;
  goToStep: (step: number) => void;
  dealerId?: number | null;
};

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const formatDate = (date?: Date) => {
  if (!date) return "--";
  return date.toLocaleDateString("pt-BR");
};

const extractYear = (value: string, fallback?: string) => {
  const match = value.match(/\d{4}/);
  if (match) return Number(match[0]);
  const fallbackMatch = fallback?.match(/\d{4}/);
  return fallbackMatch ? Number(fallbackMatch[0]) : new Date().getFullYear();
};

const calculateFinancing = async (payload: {
  financed_amount: number;
  down_payment: number;
  term_months: number;
}) => {
  const principal = Math.max(0, payload.financed_amount - payload.down_payment);
  const term = payload.term_months;

  if (!principal || !term) {
    throw new Error("Valores insuficientes para calcular o financiamento.");
  }

  const monthlyPayment = principal / term;
  const totalAmount = monthlyPayment * term;

  return {
    financed_amount: principal,
    down_payment: payload.down_payment,
    term_months: term,
    monthly_payment: monthlyPayment,
    total_amount: totalAmount,
    first_payment_date: addMonths(new Date(), 1),
    last_payment_date: addMonths(new Date(), term),
  } satisfies Calculation;
};

const buildPdf = (formData: SimulatorFormData, calculation: Calculation | null) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  const labelColor: [number, number, number] = [71, 85, 105];
  const textColor: [number, number, number] = [15, 23, 42];
  let cursorY = 48;

  const addTitle = (title: string, subtitle?: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(19, 75, 115);
    doc.text(title, marginX, cursorY);
    cursorY += 16;
    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
      doc.text(subtitle, marginX, cursorY);
      cursorY += 12;
    }
    cursorY += 8;
  };

  const ensureSpace = (height: number) => {
    if (cursorY + height > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      cursorY = 48;
    }
  };

  const addSection = (title: string, rows: Array<[string, string]>) => {
    ensureSpace(80);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.roundedRect(
      marginX - 8,
      cursorY - 8,
      pageWidth - marginX * 2 + 16,
      16 + rows.length * 18 + 20,
      8,
      8,
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(19, 75, 115);
    doc.text(title.toUpperCase(), marginX, cursorY + 6);
    cursorY += 22;

    rows.forEach(([label, value]) => {
      ensureSpace(20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
      doc.text(label, marginX, cursorY + 10);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      const valueLines = doc.splitTextToSize(value || "-", pageWidth - marginX * 2 - 140);
      doc.text(valueLines, pageWidth - marginX, cursorY + 10, { align: "right" });
      cursorY += 18 + (valueLines.length - 1) * 12;
    });

    cursorY += 12;
  };

  const issuedAt = new Date().toLocaleString("pt-BR");
  addTitle("Simulacao de Financiamento", `Emitido em ${issuedAt}`);

  addSection("Cliente", [
    ["Nome", formData.personal.name],
    ["Documento", formData.personal.cpfCnpj],
    ["Contato", `${formData.personal.email} / ${formData.personal.phone}`],
  ]);

  addSection("Veiculo", [
    [
      "Descricao",
      `${formData.vehicle.brand} ${formData.vehicle.model} ${formData.vehicle.year}`.trim(),
    ],
    ["Placa", formData.vehicle.plate || "-"],
    ["FIPE", formatNumberToBRL(formData.vehicle.fipeValue)],
    ["Valor financiado", formatNumberToBRL(formData.financial.financedAmount)],
    ["Prazo", `${formData.financial.termMonths} meses`],
  ]);

  addSection("Resultado da simulacao", [
    ["Parcela estimada", calculation ? formatNumberToBRL(calculation.monthly_payment) : "-"],
    ["Total a pagar", calculation ? formatNumberToBRL(calculation.total_amount) : "-"],
  ]);

  addSection("Operacao", [
    ["Tipo", formData.operationType.toUpperCase()],
    ["Categoria", formData.vehicleCategory],
    ["Pessoa", formData.personType],
    [
      "Endereco",
      `${formData.address.address}, ${formData.address.number} - ${formData.address.neighborhood} / ${formData.address.city} - ${formData.address.uf}`,
    ],
  ]);

  ensureSpace(40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
  doc.text(
    "Valores estimados. A aprovacao e as condicoes finais dependem de analise de credito e politica comercial.",
    marginX,
    cursorY,
    { maxWidth: pageWidth - marginX * 2 },
  );

  doc.save("simulacao-grota.pdf");
};

export default function Step4Review({
  formData,
  updateField,
  prevStep,
  clearData,
  goToStep,
  dealerId,
}: Step4ReviewProps) {
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [proposalId, setProposalId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const totalVehicle = useMemo(() => {
    return `${formData.vehicle.brand} ${formData.vehicle.model}`.trim();
  }, [formData.vehicle.brand, formData.vehicle.model]);

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalculate = async () => {
    try {
      setCalculating(true);
      const result = await calculateFinancing({
        financed_amount: formData.financial.financedAmount,
        down_payment: formData.financial.downPayment,
        term_months: formData.financial.termMonths,
      });

      setCalculation(result);
      toast.success("Calculo realizado com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao calcular financiamento",
      );
      console.error(error);
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.acceptLgpd) {
      toast.error("Por favor, aceite os termos da LGPD para continuar");
      return;
    }

    if (dealerId == null) {
      toast.error("Selecione a loja para vincular a simulacao.");
      return;
    }

    if (!calculation) {
      toast.error("Calculo nao disponivel. Recalcule a simulacao.");
      return;
    }

    try {
      setSubmitting(true);

      const financedValue = Math.max(
        0,
        formData.financial.financedAmount - formData.financial.downPayment,
      );

      const payload = {
        dealerId,
        customerName: formData.personal.name,
        customerCpf: formData.personal.cpfCnpj,
        customerBirthDate: formData.personal.birthday || undefined,
        customerEmail: formData.personal.email,
        customerPhone: formData.personal.phone,
        cnhCategory: formData.personal.cnhCategory || "",
        hasCnh: formData.personal.hasCnh,
        vehiclePlate: formData.vehicle.plate || "",
        fipeCode: formData.vehicle.fipeCode || "",
        fipeValue: formData.vehicle.fipeValue,
        vehicleBrand: formData.vehicle.brand,
        vehicleModel: formData.vehicle.model,
        vehicleYear: extractYear(formData.vehicle.year, formData.vehicle.yearCode),
        downPaymentValue: formData.financial.downPayment,
        financedValue,
        termMonths: formData.financial.termMonths,
        vehicle0km: formData.vehicle.isZeroKm,
        maritalStatus: formData.personal.maritalStatus,
        cep: formData.address.cep,
        address: formData.address.address,
        addressNumber: formData.address.number,
        addressComplement: formData.address.complement,
        neighborhood: formData.address.neighborhood,
        uf: formData.address.uf,
        city: formData.address.city,
        income: formData.professional.income,
        otherIncomes: formData.professional.otherIncomes,
        metadata: JSON.stringify({
          personType: formData.personType,
          operationType: formData.operationType,
          vehicleCategory: formData.vehicleCategory,
          vehicleCodes: {
            brandCode: formData.vehicle.brandCode,
            modelCode: formData.vehicle.modelCode,
            yearCode: formData.vehicle.yearCode,
          },
          calculation,
        }),
      };

      const result = await createProposal(payload);
      setProposalId(result.id);
      setSubmitted(true);
      toast.success("Proposta enviada com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar proposta",
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true);
      buildPdf(formData, calculation);
      toast.success("PDF baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao baixar PDF");
      console.error(error);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleNewSimulation = () => {
    clearData();
    goToStep(1);
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold text-green-800">Proposta Enviada com Sucesso!</h2>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button onClick={handleDownloadPDF} disabled={downloadingPDF} size="lg" variant="outline">
            {downloadingPDF ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Baixar PDF
          </Button>
          <Button onClick={handleNewSimulation} size="lg" className="bg-[#134B73] hover:bg-[#0f3a5a]">
            Nova Simulacao
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[#134B73]">Resumo da Operacao</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tipo de Operacao</p>
              <p className="font-semibold">{formData.operationType.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo de Pessoa</p>
              <p className="font-semibold">{formData.personType}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[#134B73]">Dados do Veiculo</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Veiculo</p>
              <p className="font-semibold">{totalVehicle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ano</p>
              <p className="font-semibold">{formData.vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Categoria</p>
              <p className="font-semibold">{formData.vehicleCategory}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">0 KM</p>
              <p className="font-semibold">{formData.vehicle.isZeroKm ? "Sim" : "Nao"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor FIPE</p>
              <p className="font-semibold text-[#134B73]">
                {formatNumberToBRL(formData.vehicle.fipeValue)}
              </p>
            </div>
            {formData.vehicle.plate && (
              <div>
                <p className="text-sm text-gray-600">Placa</p>
                <p className="font-semibold">{formData.vehicle.plate}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[#134B73]">Dados do Cliente</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="font-semibold">{formData.personal.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {formData.personType === "PF" ? "CPF" : "CNPJ"}
              </p>
              <p className="font-semibold">{formData.personal.cpfCnpj}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">E-mail</p>
              <p className="font-semibold">{formData.personal.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="font-semibold">{formData.personal.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Endereco</p>
              <p className="font-semibold">
                {formData.address.address}, {formData.address.number} - {formData.address.neighborhood}
                <br />
                {formData.address.city} - {formData.address.uf}, CEP: {formData.address.cep}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[#134B73]">Dados Profissionais</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Empresa</p>
              <p className="font-semibold">{formData.professional.enterprise}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Funcao</p>
              <p className="font-semibold">{formData.professional.enterpriseFunction}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Renda Mensal</p>
              <p className="font-semibold text-green-600">
                {formatNumberToBRL(formData.professional.income)}
              </p>
            </div>
            {formData.professional.otherIncomes > 0 && (
              <div>
                <p className="text-sm text-gray-600">Outras Rendas</p>
                <p className="font-semibold text-green-600">
                  {formatNumberToBRL(formData.professional.otherIncomes)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#134B73] to-[#0a2940]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Calculo do Financiamento</h2>
            <Button onClick={handleCalculate} disabled={calculating} variant="secondary" size="sm">
              {calculating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calculando...
                </>
              ) : (
                "Recalcular"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {calculation ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-sm text-white/80">Valor Financiado</p>
                  <p className="text-xl font-bold text-white">
                    {formatNumberToBRL(calculation.financed_amount)}
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-sm text-white/80">Entrada</p>
                  <p className="text-xl font-bold text-white">
                    {formatNumberToBRL(calculation.down_payment)}
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-sm text-white/80">Prazo</p>
                  <p className="text-xl font-bold text-white">
                    {calculation.term_months} meses
                  </p>
                </div>
              </div>

              <Separator className="bg-white/20" />

              <div className="bg-white p-6 rounded-lg space-y-4">
                                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg text-gray-600">Valor Total:</span>
                  <span className="text-xl font-semibold text-gray-800">
                    {formatNumberToBRL(calculation.total_amount)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-white/90 text-sm">
                <div>
                  <p className="text-white/70">Primeira Parcela:</p>
                  <p className="font-semibold">{formatDate(calculation.first_payment_date)}</p>
                </div>
                <div>
                  <p className="text-white/70">Ultima Parcela:</p>
                  <p className="font-semibold">{formatDate(calculation.last_payment_date)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-white mx-auto" />
              <p className="text-white mt-2">Calculando...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <Switch
              checked={formData.acceptLgpd}
              onCheckedChange={(checked) => updateField("acceptLgpd", checked)}
            />
            <div className="space-y-2">
              <Label className="text-base font-semibold">Consentimento LGPD</Label>
              <p className="text-sm text-gray-600">
                Autorizo o uso dos meus dados pessoais para analise de credito, contato comercial
                e formalizacao da proposta, conforme a Lei Geral de Protecao de Dados (LGPD).
                Declaro que as informacoes fornecidas sao verdadeiras.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={prevStep} variant="outline" size="lg" disabled={submitting}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            submitting || !formData.acceptLgpd || !calculation || dealerId == null
          }
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Enviar Proposta
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
