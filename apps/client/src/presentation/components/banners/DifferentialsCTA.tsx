"use client";

import { Check } from "lucide-react";
import { Button } from "../ui/button";

export function DifferentialsCTA() {
  const features = [
    "Mais de 30 anos de experiência",
    "Parcerias com grandes instituições financeiras",
    "Atendimento rápido e transparente",
    "Soluções personalizadas para cada cliente",
  ];

  return (
    <section className="bg-white rounded-2xl p-10 md:p-16 my-12  md:mx-0 shadow-sm border border-gray-200 max-w-[90vw] md:max-w-[1273px] mx-auto">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 text-center md:text-left">
        Diferenciais Grota Financiamentos
      </h2>

      {/* Features List */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Check className="w-7 h-7 text-green-500 flex-shrink-0" />
            <p className="text-gray-700 text-base md:text-lg font-medium">{feature}</p>
          </div>
        ))}
      </div>

      {/* Subheading */}
      <p className="text-gray-900 text-lg md:text-xl font-semibold mb-6 text-center md:text-left">
        Pronto para financiar seu veículo com segurança?
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
        <Button className="bg-[#1B4B7C] hover:bg-[#153a5b] text-white px-8 py-4 rounded-full font-semibold shadow-md transition-all duration-300">
          Simule agora
        </Button>
        <Button className="bg-white border border-gray-300 hover:bg-gray-50 text-[#1B4B7C] px-8 py-4 rounded-full font-semibold shadow-md transition-all duration-300">
          Fale Conosco
        </Button>
      </div>
    </section>
  );
}
