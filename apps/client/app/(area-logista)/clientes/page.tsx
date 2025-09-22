"use client";

import { useClientesBreadcrumb } from "@/src/application/core/hooks/useBreadcrumb";

// Clientes - Cadastro, documentação, histórico
export default function ClientesPage() {
  useClientesBreadcrumb();

  return (
    <div className="p-4 md:p-8 max-w-7xl space-y-8">
      <h1 className="text-3xl font-bold mb-4">Clientes</h1>
      {/* Cadastro de cliente */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Cadastrar Novo Cliente</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="border rounded p-2" placeholder="Nome" />
          <input className="border rounded p-2" placeholder="CPF" />
          <input className="border rounded p-2" placeholder="Telefone" />
          <button className="col-span-1 md:col-span-3 bg-primary text-white rounded p-2 mt-2">
            Cadastrar
          </button>
        </form>
      </div>
      {/* Upload de documentação */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Documentação Necessária</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <span className="block mb-1">CNH</span>
            <input type="file" className="border rounded p-2 w-full" />
          </div>
          <div className="flex-1">
            <span className="block mb-1">Comprovante de Renda</span>
            <input type="file" className="border rounded p-2 w-full" />
          </div>
        </div>
      </div>
      {/* Histórico de propostas */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-2">
          Histórico de Propostas do Cliente
        </h2>
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          [Tabela de propostas]
        </div>
      </div>
    </div>
  );
}
