
import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { Calculator, Car, ChartBar, DollarSign, Users } from "lucide-react";

export const navItems: NavItem[] = [
  {
    icon: <ChartBar />,
    name: "Dashboard",
    subItems: [{ name: "Visao Geral", path: "/visao-geral", pro: false }, { name: "Relatorios", path: "/", pro: false }],
  },
  {
    icon: <DollarSign />,
    name: "Gestão Clientes",
    subItems: [
      {
        name: "Cadastrar Clientes",
        path: "/",
        pro: false
      },
      {
        name: "Listar Clientes",
        path: "/",
        pro: false
      },
    ],
  },
  {
    name: "Gestao Veículos",
    icon: <Car />,
    subItems: [
      {
        name: "Cadastrar Veículos",
        path: "/",
        pro: false
      },
      {
        name: "Listar Veículos",
        path: "/",
        pro: false
      },
    ],
  },
  {
    name: "Gestão de Propostas",
    icon: <Users />,
    subItems: [
      {
        name: "Enviar Propostas",
        path: "/",
        pro: false
      },
      {
        name: "Documentos",
        path: "/",
        pro: false
      }
    ],
  },
  {
    name: "Financiamento",
    icon: <Calculator />,
    subItems: [
      { name: "Simulação", path: "/simulacao", pro: false },
    ],
  },
];

