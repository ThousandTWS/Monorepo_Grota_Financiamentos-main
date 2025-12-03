
import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { LayoutDashboard, BadgeDollarSign, ClipboardList, Gauge, Calculator, ClipboardCheck } from "lucide-react";

export const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard />,
    name: "Painel Executivo",
    subItems: [{ name: "Visão do Logista", path: "/visao-geral", pro: false, icon: <Gauge size={16} /> }],
  },
 
  {
    name: "Financiamentos",
    icon: <BadgeDollarSign />,
    subItems: [
      { name: "Simulador", path: "/simulacao", pro: false, icon: <Calculator size={16} /> },
    ],
  },
 
  {
    name: "Gestão de Propostas",
    icon: <ClipboardList />,
    subItems: [
      { name: "Esteira de Propostas", path: "/esteira-propostas", pro: false, icon: <ClipboardCheck size={16} /> },
    ],
  },
];
