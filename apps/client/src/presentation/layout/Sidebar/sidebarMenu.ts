import {
  Home,
  Users,
  Bell,
  Settings,
  Car,
  DollarSign,
  Calculator,
  HelpCircle,
} from "lucide-react";

export const sidebarMenu = [
  {
    title: "Dashboard",
    icon: Home,
    items: [
      { text: "Visão Geral", href: "/dashboard" },
      { text: "Relatórios", href: "/relatorios" },
    ],
  },
  {
    title: "Comissões",
    icon: DollarSign,
    items: [{ text: "Comissões e Repasse", href: "/comissoes" }],
  },
  {
    title: "Notificações",
    icon: Bell,
    items: [{ text: "Notificações e Alertas", href: "/notificacoes" }],
  },
  {
    title: "Veículos",
    icon: Car,
    items: [{ text: "Gestão de Veículos", href: "/veiculos" }],
  },
  {
    title: "Clientes",
    icon: Users,
    items: [
      { text: "Lista de Clientes", href: "/clientes" },
      { text: "Documentos", href: "/documentos" },
    ],
  },
  {
    title: "Financiamentos",
    icon: Calculator,
    items: [
      { text: "Todos", href: "/financiamentos" },
      { text: "Simulação", href: "/simulacao" },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    items: [{ text: "Preferências", href: "/configuracoes" }],
  },
  {
    title: "Suporte",
    icon: HelpCircle,
    items: [{ text: "Central de Suporte", href: "/suporte" }],
  },
];
