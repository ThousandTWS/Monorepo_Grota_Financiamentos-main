interface DesktopHeaderProps {
  isScrolled: boolean;
}

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[]; // Para submenus, caso necessário
}
