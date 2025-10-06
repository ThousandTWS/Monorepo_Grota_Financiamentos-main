import React from "react";
import Image from "next/image";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

function BoxFeaturedPost() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="26x:xa.">
      <div className="text-center mb-12" data-oid="_v8esjb">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          data-oid="3goy.lm">

          Post em Destaque
        </h2>
        <p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          data-oid="2s2on:v">

          O artigo mais relevante desta semana
        </p>
      </div>

      <div
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
        data-oid="4uht-sm">

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-0"
          data-oid="2-vblh6">

          {/* Image */}
          <div
            className="relative h-80 lg:h-full min-h-[400px]"
            data-oid="b0z56lw">

            <Image
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
              alt="Post em destaque"
              fill
              className="object-cover"
              data-oid="-knyrio" />


            <div className="absolute top-4 left-4" data-oid="dnsk-ei">
              <span
                className="bg-[#1B4B7C] text-white px-4 py-2 rounded-full text-sm font-semibold"
                data-oid="ktrbicx">

                Destaque
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            className="p-8 md:p-12 flex flex-col justify-center"
            data-oid="4kud7:8">

            <div
              className="flex items-center gap-4 mb-6 text-sm text-gray-600"
              data-oid="06kwpb8">

              <div className="flex items-center gap-2" data-oid="yvu_51p">
                <Calendar
                  size={16}
                  className="text-[#1B4B7C]"
                  data-oid=".htp43w" />

                <span data-oid="1oocim1">15 Jan 2025</span>
              </div>
              <div className="flex items-center gap-2" data-oid="50ykgya">
                <Clock
                  size={16}
                  className="text-[#1B4B7C]"
                  data-oid="8:w:9v2" />

                <span data-oid="ihtbhy3">5 min</span>
              </div>
              <div className="flex items-center gap-2" data-oid="-:ctqj1">
                <User size={16} className="text-[#1B4B7C]" data-oid="ayzksx3" />
                <span data-oid="plm0.p.">João Silva</span>
              </div>
            </div>

            <h3
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight"
              data-oid="1ng583i">

              Como Escolher o Melhor Financiamento para seu Veículo
            </h3>

            <p
              className="text-lg text-gray-600 mb-6 leading-relaxed"
              data-oid="we62yrm">

              Descubra os principais critérios que você deve avaliar antes de
              escolher um financiamento veicular. Entenda sobre taxas, prazos,
              seguros e muito mais para fazer a melhor escolha.
            </p>

            <div className="flex flex-wrap gap-2 mb-8" data-oid="wdq:32j">
              <span
                className="bg-blue-100 text-[#1B4B7C] px-3 py-1 rounded-full text-sm font-medium"
                data-oid="i_b9z:q">

                Financiamento
              </span>
              <span
                className="bg-blue-100 text-[#1B4B7C] px-3 py-1 rounded-full text-sm font-medium"
                data-oid="-rho:y6">

                Dicas
              </span>
              <span
                className="bg-blue-100 text-[#1B4B7C] px-3 py-1 rounded-full text-sm font-medium"
                data-oid="5:hrowp">

                Veículos
              </span>
            </div>

            <button
              className="bg-[#1B4B7C] hover:bg-[#153a5f] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 self-start group"
              data-oid="lxb:mq_">

              Ler Artigo Completo
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
                data-oid="ll38ipa" />

            </button>
          </div>
        </div>
      </div>
    </div>);

}

export default BoxFeaturedPost;