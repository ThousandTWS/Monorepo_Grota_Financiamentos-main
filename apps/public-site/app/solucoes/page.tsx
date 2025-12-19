"use client";

import { useState, useCallback } from "react";
import { useTheme } from "@/src/presentation/layout/navbar/hooks/useTheme";
import { useScrollDetection } from "@/src/presentation/layout/navbar/hooks/useScrollDetection";

import { DesktopHeader } from "@/src/presentation/layout/navbar/components/Header/DesktopHeader";
import { MobileHeader } from "@/src/presentation/layout/navbar/components/Header/MobileHeader";
import { MobileMenu } from "@/src/presentation/layout/navbar/components/Header/MobileMenu";

import Footer from "@/src/presentation/layout/Footer/Footer";

import BoxHero from "@/src/presentation/components/solucoes/Hero/BoxHero";
import BoxServices from "@/src/presentation/components/solucoes/Services/BoxServices";
import TestimonialSlider from "@/components/testimonial-slider";

function Solucoes() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isScrolled = useScrollDetection(100);


  useTheme("dark");


    const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-white">
      <DesktopHeader
        isScrolled={isScrolled}
      />

      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
      />

      <main>
        <BoxHero />
        <section className="py-16 w-full mx-auto">
          <BoxServices />
          {/* <BoxNewsletter /> */}
          
          <TestimonialSlider />
          
        </section>
      </main>

      <Footer />    </div>
  );
}

export default Solucoes;
