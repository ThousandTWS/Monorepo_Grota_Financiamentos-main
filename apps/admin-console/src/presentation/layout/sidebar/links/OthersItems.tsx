import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { Cog,} from "lucide-react";


export const othersItems: NavItem[] = [
  {
    icon: <Cog className="text-white" />,
    name: "Configurações",
    path: "/configuracoes",
  },
];
