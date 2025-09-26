import { NavItem } from "../types";
import {  Calculator, Car, ChartBar, DollarSign, Users } from "lucide-react";

export const navItems: NavItem[] = [
  {
    icon: <ChartBar />,
    name: "Dashboard",
    subItems: [{ name: "Visao Geral", path: "/visao-geral", pro: false }, { name: "Relatorios", path: "/", pro: false }],
  },
  {
    icon: <DollarSign/>,
    name: "Comissões",
    subItems: [{ name: "Comissões e Repasse", path: "/", pro: false }],
  },
  {
    name: "Veículos",
    icon: <Car/>,
    subItems: [{ name: "Gestão de Veículos", path: "/", pro: false }],
  },
  {
    name: "Clientes",
    icon: <Users />,
    subItems: [{ name: "Listas de Clientes", path: "/", pro: false }, { name: "Documentos", path: "/", pro: false }],
  },
  {
    name: "Financiamento",
    icon: <Calculator/>,
    subItems: [
      { name: "Todos", path: "/", pro: false },
      { name: "Simulação", path: "/", pro: false },
    ],
  },
];