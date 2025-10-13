import { Car, DollarSign, FileText, Home, Settings, TrendingUp, User, Users } from "lucide-react";
import { SearchItem } from "../SearchItem";

export const searchItems: SearchItem[] = [
    {
        id: "dashboard",
        title: "Visão Geral",
        description: "Dashboard principal",
        icon: <Home className="size-4" data-oid="7sqy6rg" />,
        href: "/",
        group: "Navegação",
        keywords: ["home", "inicio", "dashboard", "painel"]
    },
    {
        id: "logistas",
        title: "Logistas",
        description: "Gerenciar logistas",
        icon: <Users className="size-4" data-oid="hn:pao8" />,
        href: "/logistas",
        group: "Navegação",
        keywords: ["usuarios", "vendedores", "parceiros", "colaboradores"]
    },
    {
        id: "veiculos",
        title: "Gestão de Veículos",
        description: "Gerenciar veículos",
        icon: <Car className="size-4" data-oid="86wen32" />,
        href: "/gestao-de-veiculos",
        group: "Navegação",
        keywords: ["carros", "frota", "automoveis"]
    },
    {
        id: "comissoes",
        title: "Comissões",
        description: "Gerenciar comissões",
        icon: <DollarSign className="size-4" data-oid="7241hdt" />,
        href: "/comissoes",
        group: "Navegação",
        keywords: ["pagamentos", "financeiro", "valores"]
    },
    {
        id: "relatorios",
        title: "Relatórios",
        description: "Visualizar relatórios",
        icon: <FileText className="size-4" data-oid="l8hjweg" />,
        href: "/relatorios",
        group: "Navegação",
        keywords: ["reports", "analise", "dados"]
    },
    {
        id: "analytics",
        title: "Análises",
        description: "Métricas do sistema",
        icon: <TrendingUp className="size-4" data-oid="l.w7ofv" />,
        href: "/visao-geral",
        group: "Análises",
        keywords: ["metricas", "graficos", "estatisticas", "performance"]
    },
    {
        id: "perfil",
        title: "Meu Perfil",
        description: "Editar perfil",
        icon: <User className="size-4" data-oid="3o26_ck" />,
        href: "/perfil",
        group: "Configurações",
        keywords: ["usuario", "conta", "dados pessoais"]
    },
    {
        id: "configuracoes",
        title: "Configurações",
        description: "Ajustes do sistema",
        icon: <Settings className="size-4" data-oid="72e9rnk" />,
        href: "/configuracoes",
        group: "Configurações",
        keywords: ["settings", "ajustes", "preferencias"]
    }];