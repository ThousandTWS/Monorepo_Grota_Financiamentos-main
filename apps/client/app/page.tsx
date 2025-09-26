"use client";

import { useState, useCallback } from "react";

import { useTheme } from "@/src/presentation/layout/navbar/hooks/useTheme";
import { useModalManager } from "@/src/presentation/layout/navbar/hooks/useModalManager";
import { useScrollDetection } from "@/src/presentation/layout/navbar/hooks/useScrollDetection";

import { DesktopHeader } from "@/src/presentation/layout/navbar/components/Header/DesktopHeader";
import { MobileHeader } from "@/src/presentation/layout/navbar/components/Header/MobileHeader";
import { MobileMenu } from "@/src/presentation/layout/navbar/components/Header/MobileMenu";
import { ModalContainer } from "@/src/presentation/layout/modais/ModalContainer";
import Footer from "@/src/presentation/layout/Footer/Footer";

import HeroSection from "@/src/presentation/components/Hero/BoxHero";
import Carousel01 from "@/src/presentation/components/banners/carroucel/Carousel";
import CTABanner from "@/src/presentation/components/banners/CTABanner";
import FAQ from "@/src/presentation/components/FAQ/FAQ";
import { BentoGrid6 } from "@/src/presentation/components/Hero/HeroSection";
import { InflectedCardDemo } from "@/src/presentation/components/demo";
import TestimonialSlider from "@/components/testimonial-slider";


export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isScrolled = useScrollDetection(100);
  const modalManager = useModalManager();


  useTheme("dark");


  const handleMobileLoginClick = useCallback(() => {
    setIsMobileMenuOpen(false);
    modalManager.openLoginModal();
  }, [modalManager]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-white">
      {/* Navbar */}
      <DesktopHeader
        isScrolled={isScrolled}
        onLoginClick={modalManager.openLoginModal}
      />

      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onLoginClick={handleMobileLoginClick}
      />

      {/* Conteúdo Principal */}
      <main>
        <HeroSection />
        <Carousel01 />
        <InflectedCardDemo />
        <CTABanner />
        <BentoGrid6 />
        <TestimonialSlider/>
        <FAQ />
      </main>

      {/* Footer + Modais */}
      <Footer />
      <ModalContainer {...modalManager} />
    </div>
  );
}
