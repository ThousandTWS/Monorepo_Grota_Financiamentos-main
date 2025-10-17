import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

function BoxContactInfo() {
  const contactItems = [
  {
    icon: Phone,
    title: "Telefone",
    content: "(19) 3722-0914",
    subContent: "(19)99283-7133"
  },
  {
    icon: Mail,
    title: "E-mail",
    content: "contato@grotafinanciamentos.com.br",
    subContent: "SAC@grotafinanciamentos.com.br"
  },
  {
    icon: MapPin,
    title: "Endereço",
    content: "R. Ferdinando Panattoni, 411 - Sala 03",
    subContent: "Jardim Pauliceia, Campinas - SP"
  },
  
  {
    icon: Clock,
    title: "Horário de Atendimento",
    content: "Segunda a Sexta: 8h às 18h",
    subContent: "Sábado: 9h às 13h"
  }];


  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      data-oid="rs644s-">

      {contactItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            data-oid="rhwx757">

            <div className="flex items-start gap-4" data-oid="qjx-wiw">
              <div
                className="bg-blue-100 p-3 rounded-full flex-shrink-0"
                data-oid="nj7vo-7">

                <Icon size={24} className="text-[#1B4B7C]" data-oid="_b9o6lg" />
              </div>
              <div data-oid="0dregb8">
                <h3
                  className="font-bold text-lg text-gray-800 mb-2"
                  data-oid="jntry14">

                  {item.title}
                </h3>
                <p className="text-gray-700 font-medium" data-oid="-ceyb0-">
                  {item.content}
                </p>
                {item.subContent &&
                <p className="text-gray-600 text-md mt-1" data-oid="2awdjd7">
                    {item.subContent}
                  </p>
                }
              </div>
            </div>
          </div>);

      })}
    </div>);

}

export default BoxContactInfo;