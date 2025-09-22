"use client";

import { useEffect } from "react";
import { useHeader } from "@/src/application/core/context/HeaderContext";

interface UseBreadcrumbProps {
  items: string[];
  title?: string;
}

export function useBreadcrumb({ items, title }: UseBreadcrumbProps) {
  const { setBreadcrumb, setPageTitle } = useHeader();
  const itemsStr = JSON.stringify(items);
  useEffect(() => {
    setBreadcrumb(items);
    if (title) {
      setPageTitle(title);
    }
  }, [itemsStr, title, setBreadcrumb, setPageTitle]);
}

// Hook específico para rotas comuns
export function useDashboardBreadcrumb() {
  useBreadcrumb({ items: ["Dashboard"], title: "Dashboard" });
}

export function useClientesBreadcrumb() {
  useBreadcrumb({ items: ["Dashboard", "Clientes"], title: "Clientes" });
}

export function useFinanciamentosBreadcrumb() {
  useBreadcrumb({
    items: ["Dashboard", "Financiamentos"],
    title: "Financiamentos",
  });
}

export function useSimulacaoBreadcrumb() {
  useBreadcrumb({
    items: ["Dashboard", "Financiamentos", "Simulação"],
    title: "Simulação de Financiamento",
  });
}

export function useRelatoriosBreadcrumb() {
  useBreadcrumb({ items: ["Dashboard", "Relatórios"], title: "Relatórios" });
}

export function useConfiguracoesBreadcrumb() {
  useBreadcrumb({
    items: ["Dashboard", "Configurações"],
    title: "Configurações",
  });
}

export function useSuporteBreadcrumb() {
  useBreadcrumb({ items: ["Dashboard", "Suporte"], title: "Suporte" });
}

export function useDocumentosBreadcrumb() {
  useBreadcrumb({
    items: ["Dashboard", "Clientes", "Documentos"],
    title: "Documentos",
  });
}

export function useComissoesBreadcrumb() {
  useBreadcrumb({
    items: ["Dashboard", "Comissões"],
    title: "Comissões e Repasse",
  });
}

export function useNotificacoesBreadcrumb() {
  useBreadcrumb({
    items: ["Dashboard", "Notificações"],
    title: "Notificações e Alertas",
  });
}

export function useVeiculosBreadcrumb() {
  useBreadcrumb({
    items: ["Dashboard", "Veículos"],
    title: "Gestão de Veículos",
  });
}
