import { useSidebar } from "@/src/application/core/context/SidebarContext";

export function useDashboardLayout() {
  const { isSidebarOpen } = useSidebar();
  
  const sidebarWidth = isSidebarOpen ? "ml-[280px]" : "ml-[75px]";
  
  return {
    sidebarWidth,
    isSidebarOpen,
  };
}