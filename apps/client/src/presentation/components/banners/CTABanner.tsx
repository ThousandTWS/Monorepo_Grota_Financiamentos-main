"use client";

import { Car, Calculator, ArrowRight, Shield, Clock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CTABanner() {
  return (
    <section
      className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 rounded-tr-[5rem]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1950&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header com animação */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-2 sm:px-0"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Encontre o carro dos seus sonhos
            <span className="text-orange-500 block mt-2">com condições que cabem no seu bolso</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Na Grota Financiamentos, oferecemos aprovação rápida, parcelas flexíveis e consultoria personalizada para você sair de carro novo sem preocupações.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Clock className="w-8 h-8 text-orange-400" />,
              title: "Aprovação Rápida",
              description: "Seu financiamento aprovado em tempo recorde, sem burocracia.",
            },
            {
              icon: <Shield className="w-8 h-8 text-orange-400" />,
              title: "Segurança e Transparência",
              description: "Todo o processo é seguro e transparente, sem surpresas na hora da compra.",
            },
            {
              icon: <Calculator className="w-8 h-8 text-orange-400" />,
              title: "Parcelas Flexíveis",
              description: "Escolha o plano que melhor se adapta ao seu orçamento e ao seu carro.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center group hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-200 text-sm sm:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 animate-pulse" />
          <div className="relative z-10">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-snug">
              Realize seu sonho de ter um carro novo!
            </h3>
            <p className="text-xl sm:text-2xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Conte com a Grota Financiamentos para um processo simples, rápido e totalmente confiável.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-white hover:bg-gray-100 text-orange-600 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <Calculator className="w-6 h-6" />
                Simular Financiamento
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                <Car className="w-6 h-6" />
                Ver Carros Disponíveis
              </button>
            </div>
          </div>

          {/* Decorative Blurs */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-orange-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-transparent rounded-full blur-3xl" />
    </section>
  );
}
