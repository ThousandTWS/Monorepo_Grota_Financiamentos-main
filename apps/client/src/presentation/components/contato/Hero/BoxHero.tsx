import Image from "next/image";
import React from "react";

function BoxHero() {
  return (
    <section
      className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden -mt-24 h-[40rem]"
      data-oid="v68vssa">

      <div className="absolute inset-0" data-oid="lg:rg_l">
        <Image
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop"
          alt="Entre em Contato"
          fill
          className="object-cover"
          priority
          data-oid="d-fdloy" />


        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1B4B7C]/95 via-[#1B4B7C]/80 to-[#1B4B7C]/95"
          data-oid="-nzvqbh" />

      </div>
      <div
        className="relative max-w-4xl mx-auto text-center mt-5"
        data-oid="exw5bnk">

        <h1
          className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
          data-oid="co:yg9:">

          Fale{" "}
          <span className="text-blue-300 block" data-oid="l8a6ph_">
            Conosco
          </span>
        </h1>
        <p
          className="text-2xl text-blue-100 leading-relaxed max-w-4xl mx-auto mb-12"
          data-oid=".w8jcwk">

          Estamos prontos para atendê-lo! Entre em contato com nossa equipe
          especializada e tire todas as suas dúvidas sobre financiamento
          veicular.
        </p>
        <div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          data-oid="63bcpk2">

          <button
            className="bg-white hover:bg-gray-100 text-[#1B4B7C] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            data-oid="adm9bik">

            Enviar Mensagem
          </button>
          <button
            className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm"
            data-oid="hp9-tqv">

            Ver Localização
          </button>
        </div>
      </div>
    </section>);

}

export default BoxHero;