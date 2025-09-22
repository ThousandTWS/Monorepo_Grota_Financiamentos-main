import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarWidth: string;
}

export function DashboardLayout({ children, sidebarWidth }: DashboardLayoutProps) {
  return (
    <div className="flex bg-[#f8f8f8ce] min-h-screen">
      <div
        className={`flex flex-col w-full transition-all duration-700 ease-in-out ${sidebarWidth}`}
      >
        {children}
      </div>
    </div>
  );
}