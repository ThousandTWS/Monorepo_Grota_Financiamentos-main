import { useRef } from "react";

export const useSidebarHover = (
  setSidebarOpen: (open: boolean) => void,
  setGlobalSidebarOpen: (open: boolean) => void
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSidebarHoverStart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSidebarOpen(true);
    setGlobalSidebarOpen(true);
  };

  const handleSidebarHoverEnd = () => {
    timeoutRef.current = setTimeout(() => {
      setSidebarOpen(false);
      setGlobalSidebarOpen(false);
    }, 150);
  };

  return { handleSidebarHoverStart, handleSidebarHoverEnd };
};
