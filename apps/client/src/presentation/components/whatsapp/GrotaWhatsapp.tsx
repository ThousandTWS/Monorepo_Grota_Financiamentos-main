// components/WhatsappGrota.tsx
"use client";

import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function WhatsappGrota() {
  const [isHovered, setIsHovered] = useState(false);

  const message = encodeURIComponent(
    "Olá! Tudo bem? Gostaria de mais informações sobre finaciamento de veículos."
  );

  return (
    <div className="fixed bottom-5 right-5 z-50">

      <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
      </div>


      {isHovered && (
        <div className="absolute right-20 bottom-4 bg-white text-gray-800 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-sm w-max max-w-[200px] whitespace-nowrap animate-fade-in">
          <span>💬</span> <span>Precisa de ajuda?</span>
        </div>
      )}


      <Link
        href={`https://api.whatsapp.com/send?phone=551937220914&text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-16 h-16 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl animate-slow-pulse relative"
        aria-label="Fale com a Grota Financiamentos no WhatsApp"
      >
        <FaWhatsapp className="w-10 h-10" />
      </Link>
    </div>
  );
}
