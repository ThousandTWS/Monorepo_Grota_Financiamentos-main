import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/presentation/context/SidebarContext";
import { ThemeProvider } from "@/presentation/context/ThemeContext";

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
        <ThemeProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
