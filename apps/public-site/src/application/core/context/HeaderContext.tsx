"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface HeaderContextType {
  breadcrumb: string[];
  setBreadcrumb: (breadcrumb: string[]) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}

interface HeaderProviderProps {
  children: ReactNode;
}
export function HeaderProvider({ children }: Readonly<HeaderProviderProps>) {
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["Dashboard"]);
  const [pageTitle, setPageTitle] = useState<string>("Dashboard");

  const value = useMemo(
    () => ({
      breadcrumb,
      setBreadcrumb,
      pageTitle,
      setPageTitle,
    }),
    [breadcrumb, pageTitle]
  );

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
}
