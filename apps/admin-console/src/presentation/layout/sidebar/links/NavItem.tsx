import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { Car, ChartBar, Users, UserSquare } from "lucide-react";

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
    name: "Gestão de Vendedores",
    subItems: [
      { 
        name: "Cadastrar Vendedor",
        path: "/operadores", 
        pro: false
       },
    ],
  },

  {
    name: "Gestão de Logistas",
    icon: <Users />,
    subItems: [
      { 
        name: "Logistas",
         path: "/logistas", 
         pro: false 
      }, 
    ],
    
  },
  {
    name: "Gestão de Gestores",
    icon: <Users />,
    subItems: [
      { 
        name: "Gestores",
         path: "/gestores", 
         pro: false 
      }, 
    ],
    
  },
];