"use client";

import { Check, PhoneCallIcon } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function DifferentialsCTA() {
  const features = [
    "Mais de 30 anos de experiência",
    "Parcerias com grandes instituições financeiras",
    "Atendimento rápido e transparente",
    "Soluções personalizadas para cada cliente",
  ];

  return (
    <section
      className="relative overflow-hidden rounded-tl-[5rem] rounded-br-[5rem] py-24 px-6 md:px-16 my-16"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      <div className="relative z-10 max-w-[1273px] mx-auto flex flex-col gap-12">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center md:text-left"
        >
          Diferenciais Grota Financiamentos
        </motion.h2>

        {/* Features List */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="flex items-start gap-4 p-6 rounded-2xl border border-white/20 bg-white/20 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Check className="w-7 h-7 text-green-500 flex-shrink-0" />
              <p className="text-white text-base md:text-lg font-medium">{feature}</p>
            </motion.div>
          ))}
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white text-lg md:text-xl font-semibold mb-6 text-center md:text-left"
        >
          Pronto para financiar seu veículo com segurança?
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start"
        >
          <Link href="https://api.whatsapp.com/send?phone=551937220914&text=Ol%C3%A1!%20Tudo%20bem%3F%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20finaciamento%20de%20ve%C3%ADculos." target='_blank'>
           <button className="group  bg-white cursor-pointer hover:bg-gray-100 text-[#1B4B7C] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            <PhoneCallIcon className="w-6 h-6 animate-phone-ring" />
            Fale Conosco
          </button>
          </Link>
          
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-orange-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-r from-orange-500/20 to-transparent rounded-full blur-3xl" />
    </section>
  );
}
