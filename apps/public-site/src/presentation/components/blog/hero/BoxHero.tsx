import Image from "next/image";
import Link from "next/link";
import React from "react";

function BoxHero() {
  return (
    <section
      className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden -mt-24 h-[40rem]"
      data-oid="0rexx__">

      <div className="absolute inset-0" data-oid="kv6p2a3">
        <Image
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&h=1080&fit=crop"
          alt="Blog Grota Financiamentos"
          fill
          className="object-cover"
          priority
          data-oid="5v-4wr1" />


        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1B4B7C]/95 via-[#1B4B7C]/80 to-[#1B4B7C]/95"
          data-oid="by_f.4y" />

      </div>

      <div
        className="relative max-w-4xl mx-auto text-center mt-5"
        data-oid="h8qjk4x">

        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
          data-oid="e2rxw22">

          Blog
          <span className="text-white block" data-oid="p0tdesd">
            Grota Financiamentos
          </span>
        </h1>
        <p
          className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-4xl mx-auto mb-12"
          data-oid="npiix7x">

          Dicas, notícias e informações sobre financiamento veicular, economia e
          tudo que você precisa saber para realizar o sonho do seu veículo.
        </p>
        <div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          data-oid="1.r0z90">

          <Link
          href="/blog/artigo"
            className="bg-white hover:bg-gray-100 text-[#1B4B7C] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            data-oid="_jeya57">

            Ver Últimos Posts
          </Link>
          <Link
          href="/blog/categoria"
            className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm"
            data-oid="mnu1oc9">

            Categorias
          </Link>
        </div>
      </div>
    </section>);

}

export default BoxHero;