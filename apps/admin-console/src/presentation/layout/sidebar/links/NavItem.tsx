import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { Car, ChartBar, Users } from "lucide-react";

export const navItems: NavItem[] = [
  {
    icon: <ChartBar />,
    name: "Painel Administrativo",
    subItems: [{ name: "Visao Geral", path: "/visao-geral", pro: false },],
  },
  {
    name: "Veículos",
    icon: <Car/>,
    subItems: [{ name: "Gestão de Veículos", path: "/gestao-de-veiculos", pro: false }],
  },
  {
    name: "Logistas",
    icon: <Users />,
    subItems: [{ name: "Gestão de Logistas", path: "/logistas", pro: false }, { name: "Gestão de Documentos", path: "/gestao-documentos", pro: false }, { name: "Gestão de Propostas", path: "/esteira-de-propostas", pro: false }],
  },
];