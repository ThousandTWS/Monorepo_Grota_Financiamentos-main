import React from "react";
import {
  Car,
  DollarSign,
  TrendingUp,
  FileText,
  Shield,
  Users } from
"lucide-react";

function BoxCategories() {
  const categories = [
  {
    icon: Car,
    title: "Veículos",
    count: 24,
    color: "bg-blue-100 text-[#1B4B7C]"
  },
  {
    icon: DollarSign,
    title: "Financiamento",
    count: 32,
    color: "bg-blue-100 text-[#1B4B7C]"
  },
  {
    icon: TrendingUp,
    title: "Economia",
    count: 18,
    color: "bg-blue-100 text-[#1B4B7C]"
  },
  {
    icon: FileText,
    title: "Documentação",
    count: 15,
    color: "bg-blue-100 text-[#1B4B7C]"
  },
  {
    icon: Shield,
    title: "Segurança",
    count: 12,
    color: "bg-blue-100 text-[#1B4B7C]"
  },
  {
    icon: Users,
    title: "Dicas",
    count: 28,
    color: "bg-blue-100 text-[#1B4B7C]"
  }];


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="47.wl92">
      <div className="text-center mb-12" data-oid="opj72dv">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          data-oid="clt_w_j">

          Categorias
        </h2>
        <p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          data-oid="r.v.-3z">

          Navegue pelos nossos artigos organizados por categorias
        </p>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        data-oid="wn:1s7g">

        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={index}
              className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#1B4B7C] rounded-xl p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center gap-3 group"
              data-oid=".75pm5d">

              <div
                className={`${category.color} p-4 rounded-full group-hover:scale-110 transition-transform duration-300`}
                data-oid="m.po-9d">

                <Icon size={28} data-oid="kp-40nv" />
              </div>
              <div className="text-center" data-oid="v61u7la">
                <h3 className="font-bold text-gray-800 mb-1" data-oid="qj9e6vm">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500" data-oid="8f8n_e9">
                  {category.count} posts
                </p>
              </div>
            </button>);

        })}
      </div>
    </div>);

}

export default BoxCategories;