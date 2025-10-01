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

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-b py-20  bg-[#1B4B7C] rounded-tl-[2rem]"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Coluna Esquerda */}
          <div className="flex flex-col gap-6">
            <Tagline className=" bg-white text-[#1B4B7C]">Dúvidas Frequentes</Tagline>
            <h1
              id="faq-heading"
              className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              Tire suas dúvidas sobre financiamento de veículos
            </h1>
            <p className="text-lg leading-relaxed text-gray-200 max-w-lg">
              Reunimos as principais informações para ajudar você a entender
              como funciona o financiamento de veículos na{" "}
              <span className="font-semibold text-[#F5C518]">Grota</span>. Não
              encontrou o que procura?{" "}
              <Link
                href="#"
                className="font-semibold text-[#F5C518] underline-offset-4 hover:underline"
              >
                Fale com a nossa equipe
              </Link>
              .
            </p>

            {/* Banner abaixo do parágrafo */}
            <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <Image
                src="https://placehold.net/600x400.png"
                alt="Banner de Financiamento de Veículos Grota"
                width={800}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="flex flex-col gap-10">
            {/* FAQ Geral */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                Geral
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="general-1">
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

                <AccordionItem value="general-2">
                  <AccordionTrigger className="text-left text-base font-medium text-white">
                    Quais veículos posso financiar pela Grota?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-200">
                    Financiamos carros, motos e veículos comerciais, novos ou
                    seminovos. O valor de entrada e as condições podem variar
                    conforme o veículo e o perfil do cliente.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="general-3">
                  <AccordionTrigger className="text-left text-base font-medium text-white">
                    Preciso dar entrada para financiar?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-200">
                    Não é obrigatório, mas recomendamos dar entrada para reduzir
                    o valor das parcelas e facilitar a aprovação do crédito.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="general-4">
                  <AccordionTrigger className="text-left text-base font-medium text-white">
                    Como funciona a análise de crédito?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-200">
                    A financeira avalia seu histórico de crédito, renda e
                    capacidade de pagamento. Isso define se o financiamento será
                    aprovado e em quais condições (juros e prazo).
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* FAQ sobre Pagamentos */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                Pagamentos
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="billing-1">
                  <AccordionTrigger className="text-left text-base font-medium text-white">
                    Quais são as formas de pagamento das parcelas?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-200">
                    As parcelas podem ser pagas via boleto bancário, débito em
                    conta ou Pix (dependendo da instituição financeira parceira).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="billing-2">
                  <AccordionTrigger className="text-left text-base font-medium text-white">
                    Posso antecipar parcelas do financiamento?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-200">
                    Sim, é possível antecipar parcelas ou até quitar o contrato
                    antes do prazo, o que pode gerar descontos nos juros.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="billing-3">
                  <AccordionTrigger className="text-left text-base font-medium text-white">
                    O que acontece se eu atrasar o pagamento?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-200">
                    Em caso de atraso, podem ser cobrados juros, multas e
                    encargos adicionais. Recomendamos entrar em contato com a
                    financeira o quanto antes para negociar.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="billing-4">
                  <AccordionTrigger className="text-left text-base font-medium text-white">
                    Vocês oferecem desconto no pagamento à vista?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-200">
                    Sim! Dependendo da instituição parceira, é possível obter
                    condições especiais e descontos no financiamento à vista.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
