"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1B4B7C] rounded-t-4xl p-5 text-[#F8FAFC]">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <Image
                src="https://res.cloudinary.com/dx1659yxu/image/upload/v1759322892/Artboard_1_copy_2_www9bf.png"
                alt="Grota Financiamentos"
                width={180}
                height={60}
                className="mb-4"
              />
              <p className="text-[#F8FAFC] leading-relaxed">
                A Grota Financiamentos ajuda você a conquistar seu carro próprio com planos acessíveis e aprovação rápida. Segurança, transparência e atendimento personalizado.
              </p>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <Link href="https://facebook.com/grotafinanciamentos" target="_blank" className="text-[#F8FAFC] hover:text-[#1B4B7C] transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="https://instagram.com/grotafinanciamentos" target="_blank" className="text-[#F8FAFC] hover:text-[#1B4B7C] transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="https://linkedin.com/company/grotafinanciamentos" target="_blank" className="text-[#F8FAFC] hover:text-[#1B4B7C] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="https://youtube.com/grotafinanciamentos" target="_blank" className="text-[#F8FAFC] hover:text-[#1B4B7C] transition-colors">
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
          <h4 className="font-semibold mb-6 text-[#1B4B7C]">Serviços</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Financiamento de Carros
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Parcelas Flexíveis
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Análise Rápida de Crédito
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Planos Personalizados
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Consultoria de Financiamento
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-6 text-[#1B4B7C]">Empresa</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Sobre a Grota
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Trabalhe Conosco
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-[#1B4B7C]">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#1B4B7C] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#F8FAFC] text-sm ">
                    Av. Paulista, 1234
                    São Paulo - SP<br />
                    CEP: 01310-100
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#1B4B7C] flex-shrink-0" /> 
                <p className="text-[#F8FAFC] text-sm">(11) 4002-8922</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#1B4B7C] flex-shrink-0" />
                <p className="text-[#F8FAFC] text-sm">contato@grotafinanciamentos.com.br</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#1B4B7C] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#F8FAFC] text-sm">
                    Segunda a Sexta: 8h às 18h<br />
                    Sábado: 8h às 12h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-[#F8FAFC] text-sm">
              © 2024 Grota Financiamentos. Todos os direitos reservados.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                Termos de Uso
              </Link>
              <Link href="#" className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
