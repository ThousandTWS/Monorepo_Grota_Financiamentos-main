"use client";

import { useState } from "react";
import {
  Calculator,
  Car,
  DollarSign,
  Percent,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useSimulacaoBreadcrumb } from "@/src/application/core/hooks/useBreadcrumb";

// Interface para o resultado do cálculo
interface ResultadoCalculo {
  valorParcela: number;
  valorTotalFinanciamento: number;
  valorTotalJuros: number;
  valorTotalPago: number;
}

// Função para calcular financiamento usando sistema Price (parcelas fixas)
function calcularFinanciamento(
  valorVeiculo: number,
  valorEntrada: number,
  taxaJuros: number,
  numParcelas: number
) {
  const valorFinanciado = valorVeiculo - valorEntrada;

  if (valorFinanciado <= 0) {
    return {
      valorParcela: 0,
      valorTotalFinanciamento: 0,
      valorTotalJuros: 0,
      valorTotalPago: valorVeiculo,
    };
  }

  // Taxa de juros mensal em decimal
  const taxaDecimal = taxaJuros / 100;

  // Fórmula do sistema Price (parcelas fixas)
  const valorParcela =
    (valorFinanciado * (taxaDecimal * Math.pow(1 + taxaDecimal, numParcelas))) /
    (Math.pow(1 + taxaDecimal, numParcelas) - 1);

  const valorTotalFinanciamento = valorParcela * numParcelas;
  const valorTotalJuros = valorTotalFinanciamento - valorFinanciado;
  const valorTotalPago = valorTotalFinanciamento + valorEntrada;

  return {
    valorParcela,
    valorTotalFinanciamento,
    valorTotalJuros,
    valorTotalPago,
  };
}

export default function SimulacaoPage() {
  // Configurar breadcrumb para esta página
  useSimulacaoBreadcrumb();

  const [valorVeiculo, setValorVeiculo] = useState<string>("");
  const [valorEntrada, setValorEntrada] = useState<string>("");
  const [taxaJuros, setTaxaJuros] = useState<string>("");
  const [numParcelas, setNumParcelas] = useState<string>("");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [showResultado, setShowResultado] = useState(false);

  // Formatar valor em reais
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Calcular simulação
  const calcular = () => {
    const vVeiculo = parseFloat(
      valorVeiculo.replace(/[^\d,]/g, "").replace(",", ".")
    );
    const vEntrada = parseFloat(
      valorEntrada.replace(/[^\d,]/g, "").replace(",", ".")
    );
    const tJuros = parseFloat(taxaJuros);
    const nParcelas = parseInt(numParcelas);

    if (
      !vVeiculo ||
      !tJuros ||
      !nParcelas ||
      vVeiculo <= 0 ||
      tJuros < 0 ||
      nParcelas <= 0
    ) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    if (vEntrada >= vVeiculo) {
      alert(
        "O valor de entrada não pode ser maior ou igual ao valor do veículo."
      );
      return;
    }

    const resultadoCalc = calcularFinanciamento(
      vVeiculo,
      vEntrada || 0,
      tJuros,
      nParcelas
    );
    setResultado(resultadoCalc);
    setShowResultado(true);
  };

  // Limpar formulário
  const limpar = () => {
    setValorVeiculo("");
    setValorEntrada("");
    setTaxaJuros("");
    setNumParcelas("");
    setResultado(null);
    setShowResultado(false);
  };

  // Formatação de moeda para inputs
  const formatarInputMoeda = (valor: string) => {
    const numeros = valor.replace(/[^\d]/g, "");
    const valorFormatado = (parseInt(numeros) / 100).toFixed(2);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(valorFormatado));
  };

  const handleValorVeiculoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (valor === "") {
      setValorVeiculo("");
      return;
    }
    setValorVeiculo(formatarInputMoeda(valor));
  };

  const handleValorEntradaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (valor === "") {
      setValorEntrada("");
      return;
    }
    setValorEntrada(formatarInputMoeda(valor));
  };

  const handleTaxaJurosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Remove % e qualquer caractere que não seja número ou ponto/vírgula
    const valorLimpo = valor.replace(/[^\d.,]/g, "");
    setTaxaJuros(valorLimpo);
  };

  return (
    <div className="p-4 md:p-8 w-full mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Calculator className="text-orange-600" size={32} />
          Simulador de Financiamento de Veículo
        </h1>
        <p className="text-gray-600 text-lg">
          Simule seu financiamento e descubra o valor das parcelas
        </p>
      </div>

      {/* Formulário de Simulação */}
      <div className="bg-gradient-to-b from-white to-orange-50 rounded-xl shadow-lg p-8">
        <h2 className="font-bold text-xl mb-6 text-center text-gray-800">
          Preencha os dados para simulação
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Valor do Veículo */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Car size={18} className="text-orange-600" />
              Valor do Veículo
            </label>
            <input
              type="text"
              value={valorVeiculo}
              onChange={handleValorVeiculoChange}
              placeholder="R$ 0,00"
              className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Valor de Entrada */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <DollarSign size={18} className="text-orange-600" />
              Valor de Entrada (Opcional)
            </label>
            <input
              type="text"
              value={valorEntrada}
              onChange={handleValorEntradaChange}
              placeholder="R$ 0,00"
              className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Taxa de Juros */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Percent size={18} className="text-orange-600" />
              Taxa de Juros (% ao mês)
            </label>
            <div className="relative">
              <input
                type="text"
                value={taxaJuros ? `${taxaJuros}%` : ""}
                onChange={handleTaxaJurosChange}
                placeholder="Ex: 1.5%"
                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Número de Parcelas */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar size={18} className="text-orange-600" />
              Número de Parcelas
            </label>
            <select
              value={numParcelas}
              onChange={(e) => setNumParcelas(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            >
              <option value="">Selecione</option>
              <option value="12">12 parcelas</option>
              <option value="18">18 parcelas</option>
              <option value="24">24 parcelas</option>
              <option value="36">36 parcelas</option>
              <option value="48">48 parcelas</option>
              <option value="60">60 parcelas</option>
            </select>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={calcular}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Calcular
          </button>
          <button
            onClick={limpar}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Resultado da Simulação */}
      {showResultado && resultado && (
        <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl shadow-lg p-8 border border-green-200">
          <h3 className="font-bold text-xl mb-6 text-center text-green-800">
            Resultado da Simulação
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Valor da Parcela */}
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Valor da Parcela</p>
              <p className="text-2xl font-bold text-green-700">
                {formatarMoeda(resultado.valorParcela)}
              </p>
            </div>

            {/* Valor Total Financiado */}
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-sm text-gray-600 mb-1">
                Total do Financiamento
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {formatarMoeda(resultado.valorTotalFinanciamento)}
              </p>
            </div>

            {/* Valor Total de Juros */}
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Total de Juros</p>
              <p className="text-2xl font-bold text-orange-700">
                {formatarMoeda(resultado.valorTotalJuros)}
              </p>
            </div>

            {/* Valor Total Pago */}
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-sm text-gray-600 mb-1">
                Total Pago (Veículo + Juros)
              </p>
              <p className="text-2xl font-bold text-purple-700">
                {formatarMoeda(resultado.valorTotalPago)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informações Importantes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">
              Informações Importantes:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • Esta simulação fornece resultados aproximados para fins
                educativos
              </li>
              <li>
                • As condições reais podem variar conforme análise de crédito
              </li>
              <li>
                • Consulte taxas atualizadas diretamente com as instituições
                financeiras
              </li>
              <li>
                • É recomendado que o financiamento não ultrapasse 30% da renda
                mensal
              </li>
              <li>
                • Considere custos adicionais como IPVA, seguro e combustível
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
