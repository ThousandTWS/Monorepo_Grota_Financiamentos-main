import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { BookOpen, Accessibility, Cog, Sparkles, FileQuestion, Wrench } from "lucide-react";


export const othersItems: NavItem[] = [
  {
    icon: <Cog className="text-white" />,
    name: "Configurações",
    path: "/",
  },
  {
    icon: <BookOpen className="text-white" />,
    name: "Dicas & Tutoriais",
    subItems: [
      { name: "Introdução", path: "/", pro: false, icon: <Sparkles size={16} className="text-white" /> },
      { name: "Guia de Funções", path: "/", pro: false, icon: <BookOpen size={16} className="text-white" /> },
      { name: "Personalização", path: "/", pro: false, icon: <Wrench size={16} className="text-white" /> },
      { name: "Ajuda", path: "/", pro: false, icon: <FileQuestion size={16} className="text-white" /> },
    ],
  },
   {
    icon: <Accessibility className="text-white" />,
    name: "Acessibilidade",
    path: "/",
  },
];
