import { useState } from "react";

export function useNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleMobileNavClick = (elementId: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => handleNavigation(elementId), 100);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return {
    isMobileMenuOpen,
    handleNavigation,
    handleMobileNavClick,
    toggleMobileMenu,
  };
}