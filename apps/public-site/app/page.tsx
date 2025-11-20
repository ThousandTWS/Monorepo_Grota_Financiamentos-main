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
import CTABanner from "@/src/presentation/components/banners/CTABanner";
import { BentoGrid6 } from "@/src/presentation/components/Hero/HeroSection";
import TestimonialSlider from "@/components/testimonial-slider";
import { FaqSection } from "@/src/presentation/components/banners/LogoSection/FaqSection";
import CTA from "@/src/presentation/components/banners/LogoSection/Banner";
import { HeroSectionGrota } from "@/src/presentation/components/HeroCTA";
import LogoCloudDemoPage from "@/src/presentation/components/banners/LogoSection/primary";

import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { FeatureGrota } from "@/components/shadcnblocks-com-feature108";


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

  
  const runtime = useChatRuntime({
    //@ts-ignore
    api: "/api/chat",
  });

  return (
      <div className="min-h-screen w-full relative bg-white">
        <DesktopHeader
          isScrolled={isScrolled}
          onLoginClick={modalManager.openLoginModal}
          data-testid="desktop-header"
        />

        <MobileHeader
          isMobileMenuOpen={isMobileMenuOpen}
          onMenuToggle={toggleMobileMenu}
          data-testid="mobile-header"
        />

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onLoginClick={handleMobileLoginClick}
        />

        <main>
          <HeroSection />
          <LogoCloudDemoPage />
          <HeroSectionGrota />
          <FeatureGrota/>
          <CTABanner />
          <BentoGrid6 />
          <TestimonialSlider />
          <FaqSection />
          <CTA />
        </main>
        <Footer data-testid="footer" />
        <ModalContainer {...modalManager} />
      </div>
    
  );
}
