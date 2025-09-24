"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "Como faço para solicitar um financiamento?",
    answer:
      "Você pode solicitar seu financiamento diretamente pelo nosso site ou em uma de nossas lojas parceiras. Basta preencher os dados do veículo desejado e suas informações pessoais, e nossa equipe entrará em contato rapidamente."
  },
  {
    question: "Quais documentos são necessários?",
    answer:
      "Para a análise de crédito, normalmente solicitamos RG, CPF, comprovante de residência e comprovante de renda. Documentos adicionais podem ser solicitados dependendo do perfil do cliente e do veículo escolhido."
  },
  {
    question: "Qual o prazo para aprovação do financiamento?",
    answer:
      "Nosso processo é rápido e transparente. A aprovação preliminar ocorre em poucas horas, enquanto a aprovação final e assinatura do contrato podem ser concluídas em até 48 horas úteis."
  },
  {
    question: "Posso escolher o valor da entrada e o número de parcelas?",
    answer:
      "Sim! Oferecemos planos personalizados que se adaptam ao seu orçamento. Você escolhe o valor da entrada, o prazo do financiamento e o valor das parcelas mensais dentro das condições do seu perfil de crédito."
  },
  {
    question: "O que acontece se eu atrasar uma parcela?",
    answer:
      "Em caso de atraso, nossa equipe entrará em contato para auxiliar no pagamento. Há cobrança de juros conforme legislação vigente, mas buscamos sempre oferecer soluções amigáveis para regularizar a situação."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full uppercase tracking-wide mb-4">
            Perguntas Frequentes
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Tire suas dúvidas sobre financiamentos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tudo o que você precisa saber sobre aprovação, parcelas e veículos disponíveis.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-2xl"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-orange-500 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-8 pb-6 transition-all duration-500 ease-in-out">
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ainda tem dúvidas? Fale com nossos consultores e receba atendimento personalizado!
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Fale Conosco
          </button>
        </div>
      </div>
    </section>
  );
}
