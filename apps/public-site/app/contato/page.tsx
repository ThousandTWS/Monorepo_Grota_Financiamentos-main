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

import BoxHero from "@/src/presentation/components/contato/Hero/BoxHero";
import BoxMapa from "@/src/presentation/components/contato/Mapa/BoxMapa";
import BoxContatoForm from "@/src/presentation/components/contato/contatoForm/BoxContatoForm";
import BoxContactInfo from "@/src/presentation/components/contato/Info/BoxContactInfo";

function Contato() {
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
    <div className="min-h-screen w-full relative bg-white" data-oid="zp138.5">
      {/* Navbar */}
      <DesktopHeader
        isScrolled={isScrolled}
        onLoginClick={modalManager.openLoginModal}
        data-oid="fqf2r4_" />


      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
        data-oid="a5vkfw5" />


      <MobileMenu
        isOpen={isMobileMenuOpen}
        onLoginClick={handleMobileLoginClick}
        data-oid="3zncv7r" />


      {/* Conteúdo Principal */}
      <main data-oid="63b9p2h">
        <BoxHero data-oid="j5rq8dv" />

        <section className="py-16 px-4 max-w-7xl mx-auto" data-oid="x8mqsf:">
          <h1
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800"
            data-oid="r-b-34j">

            Entre em Contato
          </h1>
          <p
            className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto"
            data-oid="4py_0dt">

            Nossa equipe está pronta para atendê-lo. Escolha o canal de sua
            preferência ou envie uma mensagem através do formulário abaixo.
          </p>

          <BoxContactInfo data-oid="ti_9sj6" />

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12"
            data-oid="z4cn0mp">

            <BoxMapa data-oid="03hsos1" />
            <BoxContatoForm data-oid="1204sr2" />
          </div>
        </section>
      </main>

      {/* Footer + Modais */}
      <Footer data-oid="sndd:_g" />
      <ModalContainer {...modalManager} data-oid=":12jtf5" />
    </div>);

}

export default Contato;