"use client";

import React from "react";
import { useConfiguracoesBreadcrumb } from "@/src/application/core/hooks/useBreadcrumb";

function ConfiguracoesPage() {
  useConfiguracoesBreadcrumb();

  return (
    <div className="p-4 md:p-8 max-w-7xl space-y-8">
      <h1 className="text-3xl font-bold mb-4">Configurações da Conta</h1>
      {/* Dados do lojista */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Dados do Lojista</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="border rounded p-2" placeholder="Razão Social" />
          <input className="border rounded p-2" placeholder="CNPJ" />
          <input className="border rounded p-2" placeholder="Endereço" />
          <button className="col-span-1 md:col-span-3 bg-primary text-white rounded p-2 mt-2">
            Salvar
          </button>
        </form>
      </div>
      {/* Usuários da loja */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Usuários da Loja</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Nome</th>
                <th className="p-2">E-mail</th>
                <th className="p-2">Permissões</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">João Silva</td>
                <td className="p-2">joao@email.com</td>
                <td className="p-2">Administrador</td>
                <td className="p-2">
                  <button className="text-primary">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Alterar senha */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-2">Alterar Senha</h2>
        <form className="flex flex-col gap-2 max-w-md mx-auto">
          <input
            className="border rounded p-2"
            placeholder="Senha atual"
            type="password"
          />
          <input
            className="border rounded p-2"
            placeholder="Nova senha"
            type="password"
          />
          <input
            className="border rounded p-2"
            placeholder="Confirmar nova senha"
            type="password"
          />
          <button className="bg-primary text-white rounded p-2 mt-2">
            Alterar Senha
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;
