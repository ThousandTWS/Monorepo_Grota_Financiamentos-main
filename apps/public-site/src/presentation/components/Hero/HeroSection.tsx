"use client";

import Image from "next/image";
import { CardContent } from "../ui/card";
import { motion } from "framer-motion";

export function BentoGrid6() {
  const features = [
    {
      title: "Aprovação Rápida",
      description: "Seu financiamento aprovado em tempo recorde, sem burocracia.",
      image: "https://res.cloudinary.com/dx1659yxu/image/upload/v1760451097/homem-escolhendo-um-carro-em-um-salao-de-carros_demghk.jpg",
      colSpan: "lg:col-span-2",
    },
    {
      title: "Segurança e Transparência",
      description: "Todo o processo é seguro e transparente, sem surpresas na hora da compra.",
      image: "https://res.cloudinary.com/dx1659yxu/image/upload/v1760451243/linda-mulher-comprando-um-carro_lp9oo0.jpg",
      colSpan: "lg:col-span-1",
    },
    {
      title: "Parcelas Flexíveis",
      description: "Escolha o plano que melhor se adapta ao seu orçamento e ao seu carro.",
      image: "https://res.cloudinary.com/dx1659yxu/image/upload/v1760451707/casal-feliz-em-concessionaria-de-showroom-de-carros_aoifki.jpg",
      colSpan: "lg:col-span-1",
    },
    {
      title: "Suporte Personalizado",
      description: "Equipe dedicada para ajudá-lo em cada etapa do financiamento.",
      image: "https://res.cloudinary.com/dx1659yxu/image/upload/v1760451898/clientes-satisfeitos-na-concessionaria-de-automoveis_x3sao9.jpg",
      colSpan: "lg:col-span-2",
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 rounded-tl-[5rem] mt-5"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="container mx-auto relative z-10 flex flex-col gap-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
            Benefícios da Grota Financiamentos
          </h2>
          <p className="text-gray-200 text-2xl mt-4">
            Oferecemos soluções financeiras ágeis, seguras e transparentes para que você conquiste seu carro novo sem preocupações.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3 lg:grid-rows-2">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className={`bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden ${feature.colSpan} hover:scale-105 transition-transform duration-300`}
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={800}
                height={332}
                className="h-56 w-full object-cover md:h-64 lg:h-72"
              />
              <CardContent className="flex flex-col gap-2 p-6">
                <h3 className="text-white text-2xl font-bold">{feature.title}</h3>
                <p className="text-gray-200 text-base">{feature.description}</p>
              </CardContent>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-orange-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-transparent rounded-full blur-3xl" />
    </section>
  );
}
