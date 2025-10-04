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
import BoxHero from "@/src/presentation/components/blog/hero/BoxHero";
import BoxCategories from "@/src/presentation/components/blog/Categories/BoxCategories";
import BoxFeaturedPost from "@/src/presentation/components/blog/FeaturedPost/BoxFeaturedPost";
import BoxPostsList from "@/src/presentation/components/blog/PostsList/BoxPostsList";


function Blog() {
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
    <div className="min-h-screen w-full relative bg-white" data-oid="a95aqw8">
      <DesktopHeader
        isScrolled={isScrolled}
        onLoginClick={modalManager.openLoginModal}
        data-oid="tyedfmv" />


      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
        data-oid="t7mvpaj" />


      <MobileMenu
        isOpen={isMobileMenuOpen}
        onLoginClick={handleMobileLoginClick}
        data-oid="lzl5cbi" />


      <main data-oid="5le8zb6">
        <BoxHero data-oid="v:.k5z5" />

        <section className="py-16 md:py-20 bg-white" data-oid="dl6vkry">
          <BoxCategories data-oid="yl-o0sg" />
        </section>

        <section
          className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white"
          data-oid="v6y91-w">

          <BoxFeaturedPost data-oid=":crdnti" />
        </section>

        <section className="py-16 md:py-20 bg-white" data-oid="_ryezu6">
          <BoxPostsList data-oid="szdo01s" />
        </section>

        <section
          className="py-16 md:py-20 bg-gradient-to-br from-[#1B4B7C] to-[#153a5f]"
          data-oid="oz:5n18">

          <div
            className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
            data-oid=":0jmgu8">

            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              data-oid="qpze8_f">

              Receba Nossas Novidades
            </h2>
            <p
              className="text-xl text-blue-100 mb-8 leading-relaxed"
              data-oid="p2h0n3d">

              Inscreva-se em nossa newsletter e receba dicas exclusivas sobre
              financiamento veicular diretamente no seu e-mail.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto"
              data-oid="7_ipcgl">

              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 font-medium text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg bg-white"
                data-oid="arg-2ly" />


              <button
                className="bg-white text-[#1B4B7C] hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 whitespace-nowrap"
                data-oid="5ycfmuw">

                Inscrever-se
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer data-oid="o9-wczv" />
      <ModalContainer {...modalManager} data-oid=".4w3ohg" />
    </div>);

}

export default Blog;