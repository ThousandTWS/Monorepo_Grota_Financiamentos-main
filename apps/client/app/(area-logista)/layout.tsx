"use client";

import BoxSidebar from "@/src/presentation/layout/Sidebar/BoxSidebar";
import DashboardHeader from "@/src/presentation/layout/dashboard/header/DashboardHeader";
import { ReactNode } from "react";
import { LayoutProviders } from "../../src/presentation/layout/dashboard/providers/LayoutProviders";
import { DashboardLayout as Layout } from "../../src/presentation/layout/dashboard/components/DashboardLayout";
import { MainContent } from "../../src/presentation/layout/dashboard/components/MainContent";
import { useDashboardLayout } from "../../src/presentation/layout/dashboard/hooks/useDashboardLayout";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const { sidebarWidth } = useDashboardLayout();

  return (
    <Layout sidebarWidth={sidebarWidth}>
      <BoxSidebar />
      <DashboardHeader />
      <MainContent>{children}</MainContent>
    </Layout>
  );
}

export default function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  return (
    <LayoutProviders>
      <DashboardContent>{children}</DashboardContent>
    </LayoutProviders>
  );
}
