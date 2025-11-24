import React from "react";
import { FileSearch, UserCheck, Calculator, Car } from "lucide-react";

function BoxProcess() {
  const steps = [
  {
    icon: FileSearch,
    step: "01",
    title: "Escolha seu Veículo",
    description:
    "Navegue pelo nosso catálogo e selecione o veículo dos seus sonhos."
  },
  {
    icon: Calculator,
    step: "02",
    title: "Simule o Financiamento",
    description:
    "Use nosso simulador para calcular parcelas e encontrar a melhor condição."
  },
  {
    icon: UserCheck,
    step: "03",
    title: "Análise de Crédito",
    description:
    "Envie sua documentação e aguarde a aprovação rápida do seu crédito."
  },
  {
    icon: Car,
    step: "04",
    title: "Retire seu Veículo",
    description:
    "Aprovado! Finalize o contrato e retire seu veículo com toda segurança."
  }];


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="o3op1ts">
      <div className="text-center mb-12" data-oid="o7loyve">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          data-oid="h7yk_.4">

          Como Funciona o Processo
        </h2>
        <p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          data-oid="zo4u-n7">

          Em apenas 4 passos simples, você pode realizar o sonho do seu veículo.
          Processo descomplicado e transparente do início ao fim.
        </p>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block" data-oid="w8zh_ur">
        <div className="relative" data-oid="0bwk:.l">
          {/* Connecting line */}
          <div
            className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-[#1B4B7C]"
            data-oid="139f5gt">
          </div>

          <div className="grid grid-cols-4 gap-8 relative" data-oid="_96b71.">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative" data-oid="_dzjjzj">
                  {/* Circle with icon */}
                  <div className="flex justify-center mb-6" data-oid="gl2vak_">
                    <div className="relative" data-oid="btufd80">
                      <div
                        className="bg-white border-4 border-[#1B4B7C] rounded-full p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110"
                        data-oid="7nam4-b">

                        <Icon
                          size={40}
                          className="text-[#1B4B7C]"
                          data-oid="ea-c.5s" />

                      </div>
                      <div
                        className="absolute -top-2 -right-2 bg-[#1B4B7C] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
                        data-oid="740dzde">

                        {step.step}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center" data-oid="wia64u7">
                    <h3
                      className="text-xl font-bold text-gray-800 mb-3"
                      data-oid="k0ymwm7">

                      {step.title}
                    </h3>
                    <p
                      className="text-sm text-gray-600 leading-relaxed"
                      data-oid="1y8h82s">

                      {step.description}
                    </p>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </div>

      {/* Mobile and tablet view */}
      <div className="lg:hidden space-y-6" data-oid="_l5s15_">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              data-oid="_xn49zb">

              <div className="flex items-start gap-4" data-oid="5ifckmz">
                <div className="relative flex-shrink-0" data-oid="ve7jq8.">
                  <div
                    className="bg-blue-100 rounded-full p-4"
                    data-oid="w2pxgax">

                    <Icon
                      size={32}
                      className="text-[#1B4B7C]"
                      data-oid="b23jkl5" />

                  </div>
                  <div
                    className="absolute -top-2 -right-2 bg-[#1B4B7C] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
                    data-oid="z:gftcv">

                    {step.step}
                  </div>
                </div>
                <div className="flex-1" data-oid="xcgx55f">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-2"
                    data-oid=":5nla:8">

                    {step.title}
                  </h3>
                  <p
                    className="text-sm text-gray-600 leading-relaxed"
                    data-oid="us05u5w">

                    {step.description}
                  </p>
                </div>
              </div>
            </div>);

        })}
      </div>
    </div>);

}

export default BoxProcess;