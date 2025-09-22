"use client";

import React from "react";
import { Search, Bell, ChevronRight } from "lucide-react";
import { useHeader } from "@/src/application/core/context/HeaderContext";

function DashboardHeader() {
  const { breadcrumb } = useHeader();

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between shadow-sm">
      {/* Lado Esquerdo - Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumb.map((item, index) => (
          <React.Fragment key={`${item}-${index}`}>
            <span
              className={`${
                index === breadcrumb.length - 1
                  ? "text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-700 cursor-pointer"
              }`}
            >
              {item}
            </span>
            {index < breadcrumb.length - 1 && (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Lado Direito - Pesquisa e Notificações */}
      <div className="flex items-center space-x-4">
        {/* Input de Pesquisa */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Ícone de Notificação */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          {/* Badge de notificação */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
