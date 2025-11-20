"use client";

import { Car, Calculator, ArrowRight, Shield, Clock } from "lucide-react";
import { DifferentialsCTA } from "../../DifferentialsCTA";

export default function CTA() {
    return (
        <section className="relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-7xl mx-auto">
                {/* Título */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-extrabold text-[#1B4B7C] leading-tight mb-6">
                        Nossos Serviços
                    </h2>

                </div>

                {/* Features */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {/* Card 1 */}
                    <div className="bg-gradient-to-b from-[#1B4B7C]/90 to-[#1B4B7C]/90 border border-[#1B4B7C] rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-1 group">

                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                            <Clock className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Financiamento de Veículos</h3>
                        <p className="text-gray-200">Carros, motos e caminhões, novos ou seminovos.</p>

                    </div>


                    {/* Card 2 */}
                    <div className="bg-gradient-to-b from-[#1B4B7C]/90 to-[#1B4B7C]/90 border border-[#1B4B7C] rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Parcerias com Lojas e Concessionárias</h3>
                        <p className="text-gray-200">Suporte completo para alavancar suas vendas.</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-gradient-to-b from-[#1B4B7C]/90 to-[#1B4B7C]/90 border border-[#1B4B7C] rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                            <Calculator className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Seguros</h3>
                        <p className="text-gray-200"> Proteção para você e seu patrimônio.</p>
                    </div>
                </div>

                {/* Main Call To Action */}
                <DifferentialsCTA />
            </div>
        </section>
    );
}
