import React from "react";

function BoxNewsletter() {
  return (
    <section
      className="mt-20 bg-[#002B5B] py-14 px-6 rounded-3xl shadow-2xl text-center max-w-5xl mx-auto border border-[#004C91]/40"
      data-oid="grota-newsletter"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-4xl font-extrabold text-white mb-4 tracking-tight"
          data-oid="grota-title"
        >
          Receba novidades e condições exclusivas da Grota Financiamentos
        </h2>

        <p
          className="text-gray-300 mb-10 text-lg leading-relaxed"
          data-oid="grota-subtitle"
        >
          Cadastre-se para receber em primeira mão ofertas especiais, novas
          oportunidades de crédito e dicas para conquistar seu veículo com as
          melhores taxas do mercado.
        </p>

        <form
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto"
          data-oid="grota-form"
        >
          <input
            type="email"
            placeholder="Digite seu e-mail profissional"
            className="flex-1 px-5 py-3.5 rounded-xl border border-gray-400 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00B0F0] transition-all duration-200"
            data-oid="grota-email"
          />
          <button
            className="bg-white hover:bg-gray-100 text-[#1B4B7C] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            data-oid=":qqus:s">

             Inscrever-se
          </button>
        </form>
      </div>
    </section>
  );
}

export default BoxNewsletter;
