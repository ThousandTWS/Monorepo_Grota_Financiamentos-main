import React from 'react'

function BoxContatoForm() {
    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Entre em Contato
            </h2>
            <form className="space-y-4">
                <div>
                    <label
                        htmlFor="nome"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Nome
                    </label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="telefone"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Telefone
                    </label>
                    <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <div>
                    <label
                        htmlFor="mensagem"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Mensagem
                    </label>
                    <textarea
                        id="mensagem"
                        name="mensagem"
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
                >
                    Enviar Mensagem
                </button>
            </form>
        </div>
    )
}

export default BoxContatoForm