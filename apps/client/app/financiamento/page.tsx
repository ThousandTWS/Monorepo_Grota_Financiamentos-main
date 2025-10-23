"use client";

import { useState, useCallback } from "react";
import { useTheme } from "@/src/presentation/layout/navbar/hooks/useTheme";
import { useModalManager } from "@/src/presentation/layout/navbar/hooks/useModalManager";
import { useScrollDetection } from "@/src/presentation/layout/navbar/hooks/useScrollDetection";

import { DesktopHeader } from "@/src/presentation/layout/navbar/components/Header/DesktopHeader";
import { MobileHeader } from "@/src/presentation/layout/navbar/components/Header/MobileHeader";
import { MobileMenu } from "@/src/presentation/layout/navbar/components/Header/MobileMenu";
import Footer from "@/src/presentation/layout/Footer/Footer";
import { ModalContainer } from "@/src/presentation/layout/modais/ModalContainer";

import BoxBenefits from "@/src/presentation/components/financiamento/Benefits/BoxBenefits";
import BoxHero from "@/src/presentation/components/financiamento/Hero/Boxhero";
import BoxProcess from "@/src/presentation/components/financiamento/Process/BoxProcess";
import TestimonialSlider from "@/components/testimonial-slider";
import { FaqSection } from "@/src/presentation/components/banners/LogoSection/FaqSection";
import Link from "next/link";


function Financiamento() {
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
    <div className="min-h-screen w-full relative bg-white" data-oid="mb7:_id">
      <DesktopHeader
        isScrolled={isScrolled}
        onLoginClick={modalManager.openLoginModal}
        data-oid="movb6wm" />


      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
        data-oid="n-gpjzh" />


      <MobileMenu
        isOpen={isMobileMenuOpen}
        onLoginClick={handleMobileLoginClick}
        data-oid="g9j6-md" />


      <main data-oid="osag3_z">
        <BoxHero data-oid="d62l70b" />

        <section className="py-16 md:py-20 bg-white" data-oid="nfgi01d">
          <BoxBenefits data-oid=".0da_.f" />
        </section>

        {/*
         <section
          className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white"
          data-oid="0ext2ew">

          <BoxCalculator data-oid="nuyhmp7" />
        </section>
        */}


        <section className="py-16 md:py-20 bg-white" data-oid="n8oqk76">
          <BoxProcess data-oid=":iqeih0" />
        </section>

        <TestimonialSlider />
        <FaqSection />
        <section
          className="py-16 mt-10 mb-10 mr-10 ml-10 rounded-2xl md:py-20 bg-gradient-to-br from-[#1B4B7C] to-[#153a5f]"
          data-oid="se8yfv5">

          <div
            className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
            data-oid="688ocz3">

            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              data-oid="_694wa8">

              Pronto para Financiar seu Veículo?
            </h2>
            <p
              className="text-xl text-blue-100 mb-8 leading-relaxed"
              data-oid="g1bg0a.">

              Entre em contato com nossos especialistas e descubra as melhores
              condições de financiamento para você. Estamos prontos para ajudar!
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              data-oid="zc1g98v">

              <Link href="https://api.whatsapp.com/send?phone=551937220914&text=Ol%C3%A1!%20Tudo%20bem%3F%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20finaciamento%20de%20ve%C3%ADculos."
                className="bg-white text-[#1B4B7C] hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                data-oid="4riqpwn">

                Falar com Especialista
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer data-oid="3z1mtuq" />
      <ModalContainer {...modalManager} data-oid="k:v_wui" />
    </div>);

}

export default Financiamento;