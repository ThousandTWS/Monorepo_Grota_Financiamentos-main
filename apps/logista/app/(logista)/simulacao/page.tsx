"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import { Input } from "@/presentation/ui/input";
import { Label } from "@/presentation/ui/label";
import { Textarea } from "@/presentation/ui/textarea";
import { Button } from "@/presentation/ui/button";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const mockProposal = {
  plate: "ABC1D23",
  vehicle: "—",
  fipePrice: 0,
  requestedValue: 0,
  statusLabel: "Aguardando consulta da placa",
  statusTone: "text-muted-foreground",
  difference: 0,
};

export default function SimulacaoPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-500">Simulador</p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Simplifique sua proposta de financiamento
        </h1>
        <p className="text-sm text-muted-foreground">
          Consulte automaticamente a FIPE a partir da placa e envie os dados
          essenciais sem precisar calcular parcelas.
        </p>
      </div>

      <form className="grid gap-6 lg:grid-cols-3" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados do veículo</CardTitle>
              <CardDescription>
                Utilize a placa para preencher automaticamente as informações do
                veículo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa</Label>
                  <Input id="plate" placeholder="ABC1D23" defaultValue="" />
                  <p className="text-xs text-muted-foreground">
                    Formatos Mercosul e antigo são aceitos.
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Digite a placa para consultar automaticamente o valor FIPE.
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Valor FIPE (automático)</Label>
                  <Input readOnly value={currency.format(mockProposal.fipePrice)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Condições da proposta</CardTitle>
              <CardDescription>
                Informe apenas o que a loja precisa financiar — calculamos as parcelas depois.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor desejado</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="500"
                    min={1000}
                    placeholder="35000"
                    defaultValue={mockProposal.requestedValue}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    placeholder="Ex: veículo com acessórios, sinal de entrada, etc"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do cliente</CardTitle>
              <CardDescription>
                Coletamos somente CPF, CEP e CNH para gerar a proposta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="somente números" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="somente números" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnh">CNH</Label>
                  <Input id="cnh" placeholder="somente números" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Resumo da simulação</CardTitle>
            <CardDescription>
              Revise as informações antes de preencher a proposta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Placa</span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">
                  {mockProposal.plate}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Veículo</span>
                <span className="font-semibold text-right text-gray-900 dark:text-gray-50">
                  {mockProposal.vehicle}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Valor FIPE</span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">
                  {currency.format(mockProposal.fipePrice)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Valor solicitado</span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">
                  {currency.format(mockProposal.requestedValue)}
                </span>
              </div>
              <div className={`text-sm font-medium ${mockProposal.statusTone}`}>
                {mockProposal.statusLabel}
                <span className="block text-xs text-muted-foreground">
                  Diferença: {currency.format(Math.abs(mockProposal.difference))}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-muted-foreground/40 p-4 text-sm text-muted-foreground">
              Esta proposta não exige o valor da parcela neste momento. Nossa equipe calcula o plano ideal depois da validação dos dados.
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Dados complementares da placa
              </p>
              <p>
                Localização: <span className="font-medium text-gray-900 dark:text-gray-50">--/--</span>
              </p>
              <p>
                Cor: <span className="font-medium text-gray-900 dark:text-gray-50">--</span>
              </p>
              <p>
                Motor: <span className="font-medium text-gray-900 dark:text-gray-50">-- cv — -- cc</span>
              </p>
            </div>

            <Button type="submit" className="w-full">
              Preencher proposta
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
