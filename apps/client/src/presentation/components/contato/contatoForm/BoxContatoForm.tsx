import React from "react";

function BoxContatoForm() {
  return (
    <div
      className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-lg"
      data-oid="qxq20bp">

      <h2 className="text-2xl font-bold mb-6 text-gray-800" data-oid="5lb5ad8">
        Envie sua Mensagem
      </h2>
      <form className="space-y-5" data-oid="-1c1vxt">
        <div data-oid="4eu3x:a">
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
            data-oid="i12ba2n">

            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B4B7C] focus:border-transparent transition-all"
            placeholder="Digite seu nome completo"
            required
            data-oid="ti2iwg:" />

        </div>
        <div data-oid="oj9u8h.">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
            data-oid="a:kskeu">

            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B4B7C] focus:border-transparent transition-all"
            placeholder="seu.email@exemplo.com"
            required
            data-oid="ggunazp" />

        </div>
        <div data-oid="lzzwgl0">
          <label
            htmlFor="telefone"
            className="block text-sm font-medium text-gray-700"
            data-oid="sbegpz9">

            Telefone
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B4B7C] focus:border-transparent transition-all"
            placeholder="(11) 98765-4321"
            data-oid="we4pxlh" />

        </div>
        <div data-oid="i787ts3">
          <label
            htmlFor="mensagem"
            className="block text-sm font-medium text-gray-700"
            data-oid="mehm6jm">

            Mensagem
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={5}
            className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B4B7C] focus:border-transparent transition-all resize-none"
            placeholder="Digite sua mensagem aqui..."
            required
            data-oid="fovnk:t">
          </textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#1B4B7C] text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-[#153a5f] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          data-oid="qm1as36">

          Enviar Mensagem
        </button>
      </form>
    </div>);

}

export default BoxContatoForm;