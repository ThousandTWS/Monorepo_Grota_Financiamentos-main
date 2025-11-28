import { Outfit } from "next/font/google";
import "./globals.css";

import { NotificationProvider } from "@grota/realtime-client";
import { SidebarProvider } from "@/application/core/context/SidebarContext";
import { ThemeProvider } from "@/application/core/context/ThemeContext";
import { Metadata } from "next";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Painel Administrativo | Grota - Gestão de Financiamentos de Veículos",
  description: "Painel de administração da Grota para gerenciar financiamentos, clientes, veículos e aprovações de forma eficiente.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className}`}>
        {/* Loader Global */}
        <NotificationProvider identity="admin">
          <ThemeProvider>
            <SidebarProvider>
              {children}
              <Toaster richColors position="top-right" />
            </SidebarProvider>
          </ThemeProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
