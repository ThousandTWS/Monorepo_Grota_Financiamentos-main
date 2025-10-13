import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { Lightbulb, PersonStanding, Settings } from "lucide-react";


export const othersItems: NavItem[] = [
  {
    icon: <Settings />,
    name: "Configurações",
    path: "/",
  },
  {
    icon: <Lightbulb />,
    name: "Dicas & Tutoriais",
    subItems: [
      { name: "Introdução", path: "/", pro: false },
      { name: "Guia de Funções", path: "/", pro: false },
      { name: "Personalização", path: "/", pro: false },
      { name: "Ajuda", path: "/", pro: false },
    ],
  },
   {
    icon: <PersonStanding/>,
    name: "Acessibilidade",
    path: "/",
  },
];