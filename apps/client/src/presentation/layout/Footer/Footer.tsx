"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { JSX } from "react";

interface SocialItem {
  icon: JSX.Element;
  href: string;
}

interface FooterLink {
  name: string;
  href: string;
}

// Dados do Footer
const socialLinks: SocialItem[] = [
  { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com/grotafinanciamentos" },
  { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/grotafinanciamentos" },
  { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/company/grotafinanciamentos" },
  { icon: <Youtube className="w-5 h-5" />, href: "https://youtube.com/grotafinanciamentos" },
];

const servicesLinks: FooterLink[] = [
  { name: "Financiamento de Carros", href: "#" },
  { name: "Parcelas Flexíveis", href: "#" },
  { name: "Análise Rápida de Crédito", href: "#" },
  { name: "Planos Personalizados", href: "#" },
  { name: "Consultoria de Financiamento", href: "#" },
];

const companyLinks: FooterLink[] = [
  { name: "Sobre a Grota", href: "#" },
  { name: "Trabalhe Conosco", href: "#" },
  { name: "Política de Privacidade", href: "#" },
  { name: "Termos de Uso", href: "#" },
  { name: "Contato", href: "#" },
];

const bottomLinks: FooterLink[] = [
  { name: "Política de Privacidade", href: "#" },
  { name: "Termos de Uso", href: "#" },
  { name: "Contato", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1B4B7C] p-5 text-[#F8FAFC]">
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
                {socialLinks.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    target="_blank"
                    className="text-[#F8FAFC] hover:text-[#1B4B7C] transition-colors"
                  >
                    {item.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6 text-[#1B4B7C]">Serviços</h4>
            <ul className="space-y-4">
              {servicesLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-6 text-[#1B4B7C]">Empresa</h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
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
              {bottomLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-[#F8FAFC] hover:text-gray-900 transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
