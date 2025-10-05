import React from "react";

function BoxNewsletter() {
  return (
    <div className="mt-16 text-center bg-[#1B4B7C] py-6" data-oid="v70tw6o">
      <h2 className="text-2xl font-bold text-white mb-4" data-oid="i1_2zqb">
        Lorem Ipsum Newsletter
      </h2>
      <p className="text-white mb-8 max-w-2xl mx-auto" data-oid="it.4_64">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <div
        className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
        data-oid="x3z1mdc">

        <input
          type="email"
          placeholder="Seu email aqui"
          className="flex-1 px-4 py-3 border border-gray-500 bg-white rounded-lg placeholder-gray-400"
          data-oid="a_:sc7z" />


        <button
          className="bg-white text-black px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-semibold"
          data-oid="yis6kq9">

          Inscrever-se
        </button>
      </div>
    </div>);

}

export default BoxNewsletter;