"use client";

import { Check, Calculator } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { Tagline } from "../banners/LogoSection/tagline/tagline";

export function SobreNos() {
  const features = [
    "Aprovação de crédito rápida",
    "Taxas transparentes e competitivas",
    "Atendimento personalizado e confiável",
  ];

  return (
    <section
      className="relative overflow-hidden py-24 px-6 lg:px-20 bg-gradient-to-b from-[#1B4B7C]/90 to-[#1B4B7C]/70 mt-10 rounded-[2rem] mx-5 shadow-2xl"
      aria-labelledby="sobre-nos-heading"
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="relative z-10 container mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Coluna esquerda */}
        <div className="flex-1 flex flex-col gap-6 lg:gap-8">
          <Tagline className="text-[#1B4B7C] font-bold opacity-90 uppercase tracking-widest text-sm bg-white inline-block px-4 py-1 rounded-full shadow-md">
            Quem Somos
          </Tagline>

          <h1
            id="sobre-nos-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight animate-fade-in-up"
          >
            Fundada em 2005, a Grota Financiamentos é um correspondente bancário especializado em financiamento de veículos – carros, motos e caminhões.
          </h1>

          <div className="space-y-4 mt-6">
            <p className="text-blue-200 text-base lg:text-lg leading-relaxed animate-fade-in-up delay-100">
              Com mais de 30 anos de experiência no mercado financeiro, oferecemos soluções ágeis, seguras e personalizadas, sempre em parceria com as principais instituições financeiras do país.
            </p>
            <p className="text-blue-200 text-base lg:text-lg leading-relaxed animate-fade-in-up delay-150">
              Nossa trajetória é marcada pela credibilidade, ética e excelência no atendimento, fatores que nos consolidaram como referência para lojistas e clientes.
            </p>
            <p className="text-blue-200 text-base lg:text-lg leading-relaxed animate-fade-in-up delay-200">
              Além do crédito automotivo, contamos também com expertise no setor de seguros, ampliando nossa capacidade de oferecer soluções financeiras completas.
            </p>
          </div>

          {/* Lista de diferenciais com glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 animate-fade-in-up delay-250">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl shadow-lg"
              >
                <Check className="text-green-400 w-6 h-6 animate-pulse" />
                <span className="text-white font-medium text-lg">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 animate-fade-in-up delay-300">
            <button className="group bg-white hover:bg-gray-100 text-[#1B4B7C] px-12 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-1">
              Simule seu Financiamento
              <Calculator className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="flex-1 flex justify-center items-center animate-fade-in-up delay-400">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <AspectRatio ratio={4 / 3}>
              <Image
                src="https://placehold.net/600x400.png"
                alt="Visual Grota Financiamento"
                fill
                priority
                className="object-cover rounded-3xl"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
}
