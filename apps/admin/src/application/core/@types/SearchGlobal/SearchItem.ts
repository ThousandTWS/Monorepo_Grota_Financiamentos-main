export interface SearchItem {
    id: string;
    title: string;
    description?: string;
    icon: React.ReactNode;
    href: string;
    group: string;
    keywords?: string[];
}