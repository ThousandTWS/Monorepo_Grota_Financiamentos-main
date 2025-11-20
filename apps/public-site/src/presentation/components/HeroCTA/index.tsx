"use client";

import { Check, ArrowRight, Calculator, ArrowBigRightIcon } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { Tagline } from "../banners/LogoSection/tagline/tagline";
import Link from "next/link";

export function HeroSectionGrota() {
  return (
    <section
      className="relative overflow-hidden py-16 px-6 lg:px-16 bg-gradient-to-b from-[#1B4B7C] to-[#1B4B7C] mt-5 rounded-[2rem] mx-5"
      aria-labelledby="hero-heading"

    > {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />


      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6 lg:gap-8">
          

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-white leading-tight animate-fade-in-up"
          >
            Financiamento rápido <br />  e seguro <br /> para o seu veículo
          </h1>

          <p className="text-white text-base lg:text-xl max-w-lg animate-fade-in-up delay-100">
            Conectamos você às melhores instituições financeiras com total transparência, confiança e taxas competitivas.
          </p>

          {/* Feature List */}
          <div className="flex flex-col gap-3 mt-6 animate-fade-in-up delay-200">
            {[
              "Aprovação de crédito rápida",
              "Taxas transparentes e competitivas",
              "Atendimento personalizado e confiável",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="pt-0.5">
                  <ArrowBigRightIcon className="text-white h-7 w-7 " />
                </div>
                <span className="text-white text-lg leading-6 font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up delay-300">
            <Link href="/financiamento">
            <button className="group bg-white cursor-pointer hover:bg-gray-100 text-[#1B4B7C] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Simule seu Financiamento
              <Calculator className="w-6 h-6" />
            </button>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full flex-1 flex justify-center items-center animate-fade-in-up delay-400">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <AspectRatio ratio={4 / 3}>
              <Image
                src="https://res.cloudinary.com/dx1659yxu/image/upload/v1760452281/clientes-satisfeitos-na-concessionaria-de-automoveis_kc75rk.jpg"
                alt="Visual Grota Financiamento"
                fill
                priority
                className="h-full w-full rounded-xl object-cover shadow-2xl"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
}
