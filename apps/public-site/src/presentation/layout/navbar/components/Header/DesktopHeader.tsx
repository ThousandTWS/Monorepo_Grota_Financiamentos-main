"use client";

import Image from "next/image";
import Link from "next/link";

interface DesktopHeaderProps {
  isScrolled: boolean;
  onLoginClick: () => void;
}

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { name: "Inicio", href: "/" },
  {
    name: "Nossa Historia",
    href: "/nossa-historia",
    children: [],
  },
  { name: "Soluções", href: "/solucoes" },
  { name: "Financiamento", href: "/financiamento" },
  { name: "Contato", href: "/contato" },
];

export const DesktopHeader = ({
  isScrolled,
  onLoginClick,
}: DesktopHeaderProps) => {
  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => (
      <div key={item.name} className="relative group">
        <Link
          href={item.href}
          className={`relative px-4 py-1 whitespace-nowrap transition-colors duration-300 ${
            isScrolled
              ? "text-[#1B4B7C] hover:text-[#1B4B7C]"
              : "text-white hover:text-white"
          }`}
        >
          <span className="relative z-10">{item.name}</span>
          <span
            className={`absolute left-0 bottom-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${
              isScrolled ? "bg-[#1B4B7C]" : "bg-white"
            }`}
          ></span>
        </Link>

        {/* Submenu */}
        {item.children && (
          <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white shadow-lg rounded-md min-w-[150px] z-50">
            {item.children.map((child) => (
              <Link
                key={child.name}
                href={child.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <header
      className={`hidden md:flex sticky top-4 z-[9999] mx-auto w-full flex-row items-center justify-between rounded-4xl transition-all duration-500 backdrop-blur-md border border-border/50 shadow-lg max-w-7xl px-6 ${
        isScrolled ? "bg-white text-[#1B4B7C]" : "bg-[#1B4B7C] text-white"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center justify-center gap-2 transition-all duration-500"
      >
        <Image
          src="https://res.cloudinary.com/dx1659yxu/image/upload/v1759322731/Artboard_1_copy_mskwp8.svg"
          alt="Logo"
          width={150}
          height={150}
          className={`${isScrolled ? "filter-none" : "filter brightness-0 invert"}`}
        />
      </Link>

      {/* Navigation */}
      <nav className="flex flex-1 justify-center space-x-6 font-medium text-lg min-w-0">
        {renderNavItems(navItems)}
      </nav>

      {/* CTA Button */}
      <div className="flex items-center gap-4">
        

        <button
          onClick={onLoginClick}
          type="button"
          className={`relative flex items-center justify-center gap-2 px-5 py-1.5 font-semibold rounded-xl shadow-md overflow-hidden group transition-all duration-300 ${
            isScrolled
              ? "bg-[#1B4B7C] border-none hover:bg-[#153a5b]"
              : "bg-white border-2 border-gray-200 hover:bg-[#1b4b7cda]"
          }`}
        >
          <span
            className={`relative z-10 transition-colors duration-300 ${
              isScrolled
                ? "text-white"
                : "text-[#1B4B7C] hover:text-white cursor-pointer"
            }`}
          >
            Área do cliente
          </span>
          <span className="absolute inset-0 rounded-full transition-transform duration-700 group-hover:scale-150"></span>
        </button>
      </div>
    </header>
  );
};
