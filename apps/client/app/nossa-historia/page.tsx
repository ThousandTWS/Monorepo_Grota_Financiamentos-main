"use client";

import { useState, useCallback } from "react";

import { useModalManager } from "@/src/presentation/layout/navbar/hooks/useModalManager";
import { useScrollDetection } from "@/src/presentation/layout/navbar/hooks/useScrollDetection";
import { useTheme } from "@/src/presentation/layout/navbar/hooks/useTheme";

import { DesktopHeader } from "@/src/presentation/layout/navbar/components/Header/DesktopHeader";
import { MobileHeader } from "@/src/presentation/layout/navbar/components/Header/MobileHeader";
import { MobileMenu } from "@/src/presentation/layout/navbar/components/Header/MobileMenu";
import { ModalContainer } from "@/src/presentation/layout/modais/ModalContainer";
import Footer from "@/src/presentation/layout/Footer/Footer";
import { HeroSection } from "@/components/hero-section-2";
import LogoCloudDemoPage from "@/src/presentation/components/banners/LogoSection/primary";
import { FeatureGrota } from "@/components/shadcnblocks-com-feature108";
import TestimonialSlider from "@/components/testimonial-slider";
import CTA from "@/src/presentation/components/banners/LogoSection/Banner";

export default function Sobre() {
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
      <DesktopHeader
        isScrolled={isScrolled}
        onLoginClick={modalManager.openLoginModal}
      />

      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
      />

      <MobileMenu isOpen={isMobileMenuOpen} onLoginClick={handleMobileLoginClick} />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 px-4 sm:px-6 lg:px-8 overflow-hidden -mt-24 h-[50rem] ">
          <HeroSection
            logo={{
              url: "https://res.cloudinary.com/dx1659yxu/image/upload/v1759322731/Artboard_2_copy_10_w5ob1u.svg",
              alt: "Grota Financiamentos Logo",
              text: "Grota Financiamentos",
             
            }}
            slogan="SOLUÇÕES FINANCEIRAS ÁGEIS E SEGURAS"
            title={
              <>
                Fundada em 2005, <br />
                <span className="text-white">especializada em veículos</span>
              </>
            }
            subtitle="Com mais de 30 anos de experiência no mercado financeiro, oferecemos soluções personalizadas de financiamento para carros, motos e caminhões, além de expertise em seguros. Credibilidade, ética e excelência no atendimento fazem parte da nossa trajetória."
            callToAction={{
              text: "Fale com a nossa equipe",
              href: "https://api.whatsapp.com/send?phone=551937220914&text=Ol%C3%A1!%20Tudo%20bem%3F%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20finaciamento%20de%20ve%C3%ADculos.",
            }}
            backgroundImage="https://res.cloudinary.com/dqxcs3pwx/image/upload/v1758680425/f1lqg1pf6xrjoqk1sei5.jpg"
            contactInfo={{
              website: "",
              phone: "",
              address: "",
            }}
            className="rounded-2xl"
          />
        </section>

        <div className="[margin-top:clamp(-2rem,-8vh,-15rem)]">
          <LogoCloudDemoPage />
        </div>
        <FeatureGrota />
        <TestimonialSlider />
        <CTA />
      </main>
      <Footer />
      <ModalContainer {...modalManager} />
    </div>
  );
}
