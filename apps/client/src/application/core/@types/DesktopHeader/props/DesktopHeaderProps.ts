interface DesktopHeaderProps {
  isScrolled: boolean;
  onLoginClick: () => void;
}

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[]; // Para submenus, caso necessário
}
