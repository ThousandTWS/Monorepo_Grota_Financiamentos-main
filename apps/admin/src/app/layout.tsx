import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/presentation/context/SidebarContext";
import { ThemeProvider } from "@/presentation/context/ThemeContext";
import { Metadata } from "next";

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
      <body className={`${outfit.className} dark:bg-gray-900`}>
        {/* Loader Global */}
        <ThemeProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
