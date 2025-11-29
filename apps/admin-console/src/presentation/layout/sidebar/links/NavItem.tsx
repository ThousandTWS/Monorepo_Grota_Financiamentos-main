import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { ChartBar, Users, UserSquare } from "lucide-react";

export const navItems: NavItem[] = [
  {
    icon: <ChartBar />,
    name: "Painel Administrativo",
    subItems: [
      { 
        name: "Visao Geral", 
        path: "/visao-geral", 
        pro: false 
      },
    ],
  },
   {
    icon: <ChartBar />,
    name: "Gestão de Propostas",
    subItems: [
      { 
        name: "Esteira de Propostas", 
        path: "/esteira-de-propostas", 
        pro: false 
      },
    ],
  },
  {
    icon: <UserSquare />,
    name: "Gestão de usuarios",
    subItems: [
      { 
        name: "Cadastrar Vendedor",
        path: "/vendedores", 
        pro: false
       },
       { 
        name: "Cadastrar Operadores",
        path: "/vendedores", 
        pro: false
       },
        { 
        name: "Cadastrar Gestores",
        path: "/vendedores", 
        pro: false
       },
    ],
  },

  {
    name: "Gestão de Lojas",
    icon: <Users />,
    subItems: [
      { 
        name: "Cadastrar Lojas",
         path: "/logistas", 
         pro: false 
      }, 
    ],
  },
];