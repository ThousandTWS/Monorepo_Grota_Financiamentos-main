"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1B4B7C]/90 to-[#1B4B7C]/70 rounded-tr-[5rem] rounded-bl-[5rem]">
      {/* Overlay animado */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-2 text-sm font-semibold text-orange-500 bg-orange-100 rounded-full uppercase tracking-wide mb-4">
            Perguntas Frequentes
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Tire suas dúvidas sobre financiamentos
          </h2>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Tudo o que você precisa saber sobre aprovação, parcelas e veículos disponíveis.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-2xl"
              >
                <h3 className="text-white text-lg md:text-xl font-semibold pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-orange-400 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-300 transition-transform duration-300" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="px-8 pb-6 overflow-hidden"
                  >
                    <div className="border-t border-white/20 pt-6">
                      <p className="text-gray-200 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-200 mb-6 text-lg">
            Ainda tem dúvidas? Fale com nossos consultores e receba atendimento personalizado!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            Fale Conosco
          </motion.button>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-orange-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-r from-orange-500/20 to-transparent rounded-full blur-3xl" />
    </section>
  );
}
