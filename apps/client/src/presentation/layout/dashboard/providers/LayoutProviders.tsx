import { ReactNode } from "react";
import { SidebarProvider } from "@/src/application/core/context/SidebarContext";
import { HeaderProvider } from "@/src/application/core/context/HeaderContext";

interface LayoutProvidersProps {
  children: ReactNode;
}

export function LayoutProviders({ children }: LayoutProvidersProps) {
  return (
    <SidebarProvider>
      <HeaderProvider>
        {children}
      </HeaderProvider>
    </SidebarProvider>
  );
}