"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { slides } from "./data/slider";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[45rem] overflow-hidden -mt-24">
      {/* Imagens de fundo */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover object-center"
            sizes="100vw"
          />

          {/* Gradientes escuros em tons de azul */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4B7C]/80 via-[#1B4B7C]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4B7C]/50 to-transparent" />
        </div>
      ))}

      {/* Conteúdo sobreposto */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-40 px-4">
        <div className="text-center text-white space-y-7 max-w-5xl mx-auto">
          <div className="space-y-6 mt-32">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight transition-all duration-500">
              Financiamento com Segurança
              <br />e Confiança
            </h1>
            <p className="text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto transition-all duration-500">
              Há mais de 30 anos conectando clientes, lojistas
              <br />e instituições financeiras.
            </p>
          </div>

          {/* Botões de ação */}
          {/* 
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/financiamento">
              <button className="cursor-pointer group bg-white hover:bg-gray-100 text-[#1B4B7C] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Simular Financiamento
                <Calculator className="w-6 h-6" />
              </button>
            </Link>
            <Link
              target="_blank"
              href="https://api.whatsapp.com/send?phone=5519992837133&text=Ol%C3%A1!%20Tudo%20bem%3F%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20financiamento%20de%20ve%C3%ADculos."
            >
              <button className="cursor-pointer group bg-white hover:bg-gray-100 text-[#1B4B7C] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Seja nosso Parceiro
                <Handshake className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
