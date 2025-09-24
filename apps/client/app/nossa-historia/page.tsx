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


import Counter from "@/src/presentation/components/Counter";
import { Users, Target, Award, TrendingUp } from "lucide-react";
import Image from "next/image";
import StatItem from "@/src/presentation/components/NossaHistoria/StatItem";
import ValueCard from "@/src/presentation/components/NossaHistoria/ValueCard";
import Timeline from "@/src/presentation/components/NossaHistoria/Timeline";

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
        <section className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden -mt-24 h-[40rem]">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Background"
              className="w-full h-full object-cover"
              fill
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center mt-5">
            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Lorem Ipsum
              <span className="text-orange-500 block">Dolor Sit Amet</span>
            </h1>
            <p className="text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua ut
              enim ad minim veniam quis nostrud.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Lorem Ipsum
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm">
                Dolor Sit Amet
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Content */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <span className="inline-block px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full uppercase tracking-wide mb-6">
                  Lorem Ipsum
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur excepteur sint occaecat
                  cupidatat non proident.
                </p>
              </div>
              <div className="relative">
                <Image
                  fill
                  src="https://placehold.net/600x600.png"
                  alt="Lorem ipsum"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              <StatItem value={<Counter end={15} suffix="+" />} label="Lorem Ipsum" />
              <StatItem value={<Counter end={10} suffix="k+" />} label="Dolor Sit" />
              <StatItem value={<Counter end={98} suffix="%" />} label="Amet Consectetur" />
              <StatItem value={<Counter end={24} suffix="h" />} label="Adipiscing Elit" />
            </div>

            {/* Values */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              <ValueCard
                icon={<Users className="w-8 h-8 text-orange-500" />}
                title="Lorem Ipsum"
                description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod."
              />
              <ValueCard
                icon={<Target className="w-8 h-8 text-orange-500" />}
                title="Dolor Sit"
                description="Tempor incididunt ut labore et dolore magna aliqua ut enim ad minim."
              />
              <ValueCard
                icon={<Award className="w-8 h-8 text-orange-500" />}
                title="Amet Consectetur"
                description="Veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea."
              />
              <ValueCard
                icon={<TrendingUp className="w-8 h-8 text-orange-500" />}
                title="Adipiscing Elit"
                description="Commodo consequat duis aute irure dolor in reprehenderit in voluptate."
              />
            </div>

            {/* Timeline */}
            <Timeline />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Lorem ipsum dolor sit amet?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Consectetur adipiscing elit sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua.
            </p>
            <button className="bg-white hover:bg-gray-100 text-orange-600 px-10 py-4 rounded-xl font-bold text-lg transition-colors duration-200">
              Lorem Ipsum
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <ModalContainer {...modalManager} />
    </div>
  );
}

