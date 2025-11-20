"use client";

import Link from "next/link";
import { Tagline } from "./tagline/tagline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import Image from "next/image";
import { motion } from "framer-motion";
import { PhoneCallIcon } from "lucide-react";

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative overflow-hidden border-b py-24 bg-[#1B4B7C] rounded-tl-[5rem] rounded-br-[5rem]"
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <Tagline className="bg-white text-[#1B4B7C]">Dúvidas Frequentes</Tagline>

            <motion.h1
              id="faq-heading"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              Tire suas dúvidas sobre financiamento de veículos
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-lg leading-relaxed text-gray-200 max-w-lg"
            >
              Reunimos as principais informações para ajudar você a entender
              como funciona o financiamento de veículos na
              <span className="font-semibold text-white">Grota</span>. Não
              encontrou o que procura?
              <Link
                href="https://api.whatsapp.com/send?phone=551937220914&text=Ol%C3%A1!%20Tudo%20bem%3F%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20finaciamento%20de%20ve%C3%ADculos."
                className="font-semibold text-white underline-offset-4 hover:underline"
              >
                Fale com a nossa equipe
              </Link>
              .
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-lg rounded-2xl overflow-hidden shadow-xl border border-white/20"
            >
              <Image
                src="https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"
                alt="Banner de Financiamento de Veículos Grota"
                width={800}
                height={300}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
          <div className="flex flex-col gap-10">
            {["Geral", "Pagamentos"].map((section, sectionIdx) => (
              <motion.div
                key={sectionIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIdx * 0.2 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-xl font-semibold text-white md:text-2xl">{section}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {section === "Geral" ? (
                    <>
                      <AccordionItem value="general-1" className="border-white">
                        <AccordionTrigger className="text-left text-base font-medium text-white">
                          O que é financiamento de veículos?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-200">
                          É uma forma de crédito em que você compra seu carro ou moto
                          e paga em parcelas mensais. O banco ou financeira quita o
                          valor à vista para a loja, e você paga de forma parcelada,
                          com juros e prazos acordados no contrato.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="general-2" className="border-white">
                        <AccordionTrigger className="text-left text-base font-medium text-white">
                          Quais veículos posso financiar pela Grota?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-200">
                          Financiamos carros, motos e veículos comerciais, novos ou
                          seminovos. O valor de entrada e as condições podem variar
                          conforme o veículo e o perfil do cliente.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="general-3" className="border-white">
                        <AccordionTrigger className="text-left text-base font-medium text-white">
                          Preciso dar entrada para financiar?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-200">
                          Não é obrigatório, mas recomendamos dar entrada para reduzir
                          o valor das parcelas e facilitar a aprovação do crédito.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="general-4" className="border-white">
                        <AccordionTrigger className="text-left text-base font-medium text-white">
                          Como funciona a análise de crédito?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-200">
                          A financeira avalia seu histórico de crédito, renda e
                          capacidade de pagamento. Isso define se o financiamento será
                          aprovado e em quais condições (juros e prazo).
                        </AccordionContent>
                      </AccordionItem>
                    </>
                  ) : (
                    <>
                      <AccordionItem value="billing-1" className="border-white">
                        <AccordionTrigger className="text-left text-base font-medium text-white">
                          Quais são as formas de pagamento das parcelas?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-200">
                          As parcelas podem ser pagas via boleto bancário, débito em
                          conta ou Pix (dependendo da instituição financeira parceira).
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="billing-2" className="border-white">
                        <AccordionTrigger className="text-left text-base font-medium text-white">
                          Posso antecipar parcelas do financiamento?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-200">
                          Sim, é possível antecipar parcelas ou até quitar o contrato
                          antes do prazo, o que pode gerar descontos nos juros.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="billing-3" className="border-white">
                        <AccordionTrigger className="text-left text-base font-medium text-white" >
                          O que acontece se eu atrasar o pagamento?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-200">
                          Em caso de atraso, podem ser cobrados juros, multas e
                          encargos adicionais. Recomendamos entrar em contato com a
                          financeira o quanto antes para negociar.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="billing-4" className="border-white">
                        <AccordionTrigger className="text-left text-base font-medium text-white">
                          Vocês oferecem desconto no pagamento à vista?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-200">
                          Sim! Dependendo da instituição parceira, é possível obter
                          condições especiais e descontos no financiamento à vista.
                        </AccordionContent>
                      </AccordionItem>
                    </>
                  )}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link target="_blank" href="https://api.whatsapp.com/send?phone=551937220914&text=Ol%C3%A1!%20Tudo%20bem%3F%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20finaciamento%20de%20ve%C3%ADculos.">
          <button className="group cursor-pointer bg-white hover:bg-gray-100 text-[#1B4B7C]  px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            <PhoneCallIcon className="w-6 h-6 animate-phone-ring" />
            Fale com a nossa equipe
          </button>
           </Link>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-[#1B4B7C]/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-r from-[#1B4B7C]/20 to-transparent rounded-full blur-3xl" />
    </section>
  );
}
