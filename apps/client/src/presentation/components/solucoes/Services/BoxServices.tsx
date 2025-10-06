import React from "react";
import { Car, CreditCard, Shield } from "lucide-react";

function BoxServices() {
  return (
    <div className="max-w-7xl mx-auto" data-oid="sh7.rpr">
      <h1
        className="text-3xl font-bold text-center mb-12 text-gray-800"
        data-oid="lpjx7i7">

        Nossas Soluções
      </h1>
      <p
        className="text-center text-gray-800 text-lg max-w-3xl mx-auto"
        data-oid="xt96zmt">

        Oferecemos uma gama completa de serviços em financiamento veicular,
        sempre com foco em qualidade, transparência e satisfação do cliente.
      </p>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        data-oid="6e35dm_">

        <div
          className="text-gray-800 flex flex-col gap-y-3 items-center text-center border-gray-300 border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[200px]"
          data-oid="k_n2o1-">

          <Car size={48} className="text-[#1B4B7C]" data-oid="lt0y.qx" />
          <h3 className="font-semibold text-lg" data-oid="ze_na7:">
            Financiamento de Veículos
          </h3>
          <p className="text-sm" data-oid="-9q._y-">
            Financie carros novos e seminovos com as melhores taxas do mercado e
            condições personalizadas.
          </p>
        </div>
        <div
          className="text-gray-800 flex flex-col gap-y-3 items-center text-center border-gray-300 border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[200px]"
          data-oid="wdz0g_m">

          <CreditCard size={48} className="text-[#1B4B7C]" data-oid="nemq.b:" />

          <h3 className="font-semibold text-lg" data-oid="di9k1jy">
            Condições Flexíveis
          </h3>
          <p className="text-sm" data-oid="v57f5hh">
            Parcelas que cabem no seu bolso com prazos de 12 até 72 meses e
            entrada facilitada.
          </p>
        </div>
        <div
          className="text-gray-800 flex flex-col gap-y-3 items-center text-center border-gray-300 border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[200px]"
          data-oid="iwe.4sa">

          <Shield size={48} className="text-[#1B4B7C]" data-oid="gci0h-h" />
          <h3 className="font-semibold text-lg" data-oid="tn4:424">
            Segurança e Transparência
          </h3>
          <p className="text-sm" data-oid=".jbmpft">
            Processo 100% seguro com contratos claros e total transparência nas
            condições.
          </p>
        </div>
      </div>
    </div>);

}

export default BoxServices;