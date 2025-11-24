import React from "react";
import {
  Percent,
  Clock,
  CheckCircle,
  TrendingDown,
  Shield,
  FileText } from
"lucide-react";

function BoxBenefits() {
  const benefits = [
  {
    icon: Percent,
    title: "Taxas Competitivas",
    description:
    "As melhores taxas do mercado com condições especiais para você."
  },
  {
    icon: Clock,
    title: "Aprovação Rápida",
    description: "Análise de crédito ágil e resposta em até 24 horas úteis."
  },
  {
    icon: TrendingDown,
    title: "Entrada Facilitada",
    description:
    "Parcelas que cabem no seu bolso com entrada a partir de 0%."
  },
  {
    icon: CheckCircle,
    title: "Sem Burocracia",
    description:
    "Processo simples e documentação mínima para sua comodidade."
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description:
    "Transações protegidas e conformidade com todas as regulamentações."
  },
  {
    icon: FileText,
    title: "Contratos Claros",
    description:
    "Total transparência nas condições, sem letras miúdas ou surpresas."
  }];


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="8hjm8l0">
      <div className="text-center mb-12" data-oid="cq3rk:a">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          data-oid="5r7gdtz">

          Vantagens do Nosso Financiamento
        </h2>
        <p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          data-oid="wer2155">

          Oferecemos as melhores condições para você realizar o sonho do seu
          veículo com segurança, rapidez e economia.
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        data-oid=".i0cb_8">

        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="bg-white flex flex-col gap-y-3 items-center text-center border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[220px]"
              data-oid="t4lzqrd">

              <div className="bg-blue-100 p-4 rounded-full" data-oid="4vbrg-2">
                <Icon size={36} className="text-[#1B4B7C]" data-oid="bitet.l" />
              </div>
              <h3
                className="font-semibold text-xl text-gray-800"
                data-oid="a0-a6zf">

                {benefit.title}
              </h3>
              <p
                className="text-sm text-gray-600 leading-relaxed"
                data-oid="vwavmdd">

                {benefit.description}
              </p>
            </div>);

        })}
      </div>
    </div>);

}

export default BoxBenefits;