
import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { BadgeDollarSign, ClipboardList, Calculator, ClipboardCheck } from "lucide-react";

export const navItems: NavItem[] = [

  {
    name: "Financiamentos",
    icon: <BadgeDollarSign />,
    subItems: [
      { name: "Simulador", path: "/simulacao/novo", pro: false, icon: <Calculator size={16} /> },
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
