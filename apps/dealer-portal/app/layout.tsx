import { Outfit } from "next/font/google";
import "./globals.css";

import { NotificationProvider } from "@grota/realtime-client";
import { SidebarProvider } from "@/application/core/context/SidebarContext";
import { ThemeProvider } from "@/application/core/context/ThemeContext";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        {/* Loader Global */}
      
        <NotificationProvider identity="logista">
          <ThemeProvider>
            <SidebarProvider>
              {children}
              <Toaster  richColors position="top-right" />
            </SidebarProvider>
          </ThemeProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
