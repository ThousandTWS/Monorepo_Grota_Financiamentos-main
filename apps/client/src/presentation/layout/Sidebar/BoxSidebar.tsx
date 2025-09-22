import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/src/application/core/context/SidebarContext";
import { sidebarMenu } from "./sidebarMenu";
import { useSidebarHover } from "./useSidebarHover";
import { SidebarLogo } from "./SidebarLogo";
import { MenuItem } from "./MenuItem";
import { SidebarButton } from "./SidebarButton";
import { SystemStatus } from "./SystemStatus";
import { LogOut, User } from "lucide-react";


function BoxSidebar() {
  const { setSidebarOpen: setGlobalSidebarOpen } = useSidebar();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { handleSidebarHoverStart, handleSidebarHoverEnd } = useSidebarHover(
    setSidebarOpen,
    setGlobalSidebarOpen
  );

  // Abre automaticamente o grupo do menu da página ativa ao abrir a sidebar
  React.useEffect(() => {
    if (sidebarOpen) {
      const group = sidebarMenu.find((group) =>
        group.items.some((item) => item.href === pathname)
      );
      if (group) setOpenMenu(group.title);
    }
  }, [sidebarOpen, pathname]);

  return (
    <nav
      className="bg-orange-500 shadow-md z-50 flex flex-col group/sidebar rounded-r-xl fixed left-0 top-0 h-screen"
      onMouseEnter={handleSidebarHoverStart}
      onMouseLeave={handleSidebarHoverEnd}
      style={{ width: sidebarOpen ? 280 : 75, transition: 'width 0.7s ease-in-out' }}
    >
      <div className="flex flex-col mt-4 gap-2 h-screen">
        <SidebarLogo sidebarOpen={sidebarOpen} />
        <div className="flex-1 flex flex-col gap-1">
          {sidebarMenu.map((group) => (
            <MenuItem
              key={group.title}
              group={group}
              sidebarOpen={sidebarOpen}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              pathname={pathname}
            />
          ))}
        </div>
        <SidebarButton
          icon={User}
          text="Perfil"
          sidebarOpen={sidebarOpen}
          onClick={() => {/* ação de perfil aqui */}}
        />
        <SidebarButton
          icon={LogOut}
          text="Sair"
          sidebarOpen={sidebarOpen}
          onClick={() => {/* ação de logout aqui */}}
          variant="danger"
        />
        <SystemStatus sidebarOpen={sidebarOpen} />
      </div>
    </nav>
  );
}

export default BoxSidebar;
