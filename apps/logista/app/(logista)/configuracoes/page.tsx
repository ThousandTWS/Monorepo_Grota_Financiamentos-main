"use client";

import { Button } from "@/presentation/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/ui/card";
import { Input } from "@/presentation/ui/input";
import React from "react";

function ConfiguracoesPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Título Principal */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Configurações da Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações, usuários e segurança
        </p>
      </div>

      {/* Dados do lojista */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Lojista</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Razão Social" />
            <Input placeholder="CNPJ" />
            <Input placeholder="Endereço" />
            <div className="col-span-1 md:col-span-3"> 
              <Button className="w-full md:w-auto">Salvar Alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Usuários da loja */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários da Loja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="p-3">Nome</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Permissões</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">String</td>
                  <td className="p-3">String</td>
                  <td className="p-3">String</td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">String</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alterar senha */}
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 max-w-md">
            <Input placeholder="Senha atual" type="password" />
            <Input placeholder="Nova senha" type="password" />
            <Input placeholder="Confirmar nova senha" type="password" />
            <Button>Alterar Senha</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConfiguracoesPage;
