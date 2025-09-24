import React from "react";

function BoxNewsletter() {
    return (
        <div className="mt-16 text-center bg-orange-500 py-6">
            <h2 className="text-2xl font-bold text-white mb-4">
                Lorem Ipsum Newsletter
            </h2>
            <p className="text-white mb-8 max-w-2xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="Seu email aqui"
                    className="flex-1 px-4 py-3 border border-gray-500 bg-white rounded-lg placeholder-gray-400"
                />
                <button className="bg-white text-black px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-semibold">
                    Inscrever-se
                </button>
            </div>
        </div>
    );
}

export default BoxNewsletter;