"use client";
import { useSidebar } from "@/application/core/context/SidebarContext";
import AppHeader from "@/presentation/layout/header/AppHeader";
import AppSidebar from "@/presentation/layout/sidebar/AppSidebar";
import Backdrop from "@/presentation/layout/sidebar/Backdrop";
import React from "react";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />

        <div className="p-4 mx-auto max-w-[var(--breakpoint-2xl)] md:p-6">
     {children}
        </div>
      </div>
    </div>
  );
}
