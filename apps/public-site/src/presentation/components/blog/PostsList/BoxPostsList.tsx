import React from "react";
import Image from "next/image";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

function BoxPostsList() {
  const posts = [
  {
    title: "5 Dicas para Conseguir um Financiamento Aprovado",
    excerpt:
    "Saiba o que fazer para aumentar suas chances de ter o crédito aprovado rapidamente.",
    image:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
    category: "Financiamento",
    date: "12 Jan 2025",
    readTime: "4 min",
    author: "Maria Santos"
  },
  {
    title: "Financiamento com ou sem Entrada: Qual a Melhor Opção?",
    excerpt:
    "Entenda as vantagens e desvantagens de cada modalidade e faça a escolha certa.",
    image:
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
    category: "Dicas",
    date: "10 Jan 2025",
    readTime: "6 min",
    author: "Carlos Oliveira"
  },
  {
    title: "Documentos Necessários para Financiar um Veículo",
    excerpt:
    "Lista completa de documentos que você precisa separar antes de solicitar o financiamento.",
    image:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
    category: "Documentação",
    date: "08 Jan 2025",
    readTime: "3 min",
    author: "Ana Paula"
  },
  {
    title: "Taxa de Juros: Como Funciona e Como Calcular",
    excerpt:
    "Aprenda a entender as taxas de juros e como elas impactam no valor final do seu financiamento.",
    image:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
    category: "Economia",
    date: "05 Jan 2025",
    readTime: "7 min",
    author: "Pedro Alves"
  },
  {
    title: "Carro Novo vs Seminovo: Qual Vale Mais a Pena Financiar?",
    excerpt:
    "Compare os prós e contras de financiar um veículo novo ou seminovo.",
    image:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    category: "Veículos",
    date: "03 Jan 2025",
    readTime: "5 min",
    author: "Lucas Ferreira"
  },
  {
    title: "Seguros Obrigatórios no Financiamento Veicular",
    excerpt:
    "Conheça os seguros que são exigidos ao financiar um veículo e seus benefícios.",
    image:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
    category: "Segurança",
    date: "01 Jan 2025",
    readTime: "4 min",
    author: "Fernanda Costa"
  }];


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="05nd6br">
      <div className="text-center mb-12" data-oid="fzazee-">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          data-oid="tqrlaot">

          Últimos Artigos
        </h2>
        <p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          data-oid="tbop4pv">

          Fique por dentro das últimas novidades e dicas sobre financiamento
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        data-oid=":lapn93">

        {posts.map((post, index) =>
        <article
          key={index}
          className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group hover:-translate-y-2"
          data-oid="t1ylo_r">

            {/* Image */}
            <div className="relative h-48 overflow-hidden" data-oid="yg0p1y.">
              <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              data-oid="g37bj1r" />


              <div className="absolute top-4 left-4" data-oid="r.g1ve7">
                <span
                className="bg-[#1B4B7C] text-white px-3 py-1 rounded-full text-xs font-semibold"
                data-oid="pejz6hg">

                  {post.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6" data-oid="r299c2_">
              <div
              className="flex items-center gap-4 mb-3 text-xs text-gray-500"
              data-oid="e0qlotv">

                <div className="flex items-center gap-1" data-oid="bmpc-jl">
                  <Calendar
                  size={14}
                  className="text-[#1B4B7C]"
                  data-oid="rhfpjjg" />

                  <span data-oid="ng-.n6-">{post.date}</span>
                </div>
                <div className="flex items-center gap-1" data-oid="l06u6qb">
                  <Clock
                  size={14}
                  className="text-[#1B4B7C]"
                  data-oid="dy:10:e" />

                  <span data-oid="39_iso1">{post.readTime}</span>
                </div>
              </div>

              <h3
              className="text-xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-[#1B4B7C] transition-colors"
              data-oid="4z8.r0y">

                {post.title}
              </h3>

              <p
              className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3"
              data-oid="42776a-">

                {post.excerpt}
              </p>

              <div
              className="flex items-center justify-between pt-4 border-t border-gray-200"
              data-oid="fe.tvf.">

                <div
                className="flex items-center gap-2 text-sm text-gray-600"
                data-oid="tbj3.8h">

                  <User
                  size={16}
                  className="text-[#1B4B7C]"
                  data-oid=".tc6pxv" />

                  <span data-oid="bxunwll">{post.author}</span>
                </div>
                <button
                className="text-[#1B4B7C] font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all group/btn"
                data-oid="lk:d9oh">

                  Ler mais
                  <ArrowRight
                  size={16}
                  className="group-hover/btn:translate-x-1 transition-transform"
                  data-oid="_lje_5x" />

                </button>
              </div>
            </div>
          </article>
        )}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12" data-oid="_o_87k0">
        <button
          className="bg-[#1B4B7C] hover:bg-[#153a5f] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          data-oid=":7lscmm">

          Carregar Mais Artigos
        </button>
      </div>
    </div>);

}

export default BoxPostsList;