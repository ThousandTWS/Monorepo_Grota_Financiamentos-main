
import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { Calculator, ChartBar } from "lucide-react";

export const navItems: NavItem[] = [
  {
    icon: <ChartBar />,
    name: "Painel Executivo",
    subItems: [{ name: "Visão do Logista", path: "/visao-geral", pro: false }],
  },
 
  {
    name: "Financiamentos",
    icon: <Calculator />,
    subItems: [
      { name: "Simulador", path: "/simulacao", pro: false },
    ],
  },
  {
    name: "Gestão de Propostas",
    icon: <Calculator />,
    subItems: [
      { name: "Esteira de Propostas", path: "/esteira-propostas", pro: false },
    ],
  },
];
