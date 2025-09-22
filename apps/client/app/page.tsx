"use client"
import { useState } from "react"
import HeroSection from "@/src/presentation/components/Hero/BoxHero"
import { useModalManager } from "@/src/presentation/layout/navbar/hooks/useModalManager"
import { useScrollDetection } from "@/src/presentation/layout/navbar/hooks/useScrollDetection"
import { useTheme } from "@/src/presentation/layout/navbar/hooks/useTheme"
import { DesktopHeader } from "@/src/presentation/layout/navbar/components/Header/DesktopHeader"
import { MobileHeader } from "@/src/presentation/layout/navbar/components/Header/MobileHeader"
import { MobileMenu } from "@/src/presentation/layout/navbar/components/Header/MobileMenu"
import { ModalContainer } from "@/src/presentation/layout/modais/ModalContainer"
import Carousel01 from "@/src/presentation/components/banners/carroucel/Carousel"
import CTABanner from "@/src/presentation/components/banners/CTABanner"
import Footer from "@/src/presentation/layout/Footer/Footer"
import FAQ from "@/src/presentation/components/FAQ/FAQ"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isScrolled = useScrollDetection(100)
  const modalManager = useModalManager()
  
  useTheme('dark')

  const handleMobileLoginClick = () => {
    setIsMobileMenuOpen(false)
    modalManager.openLoginModal()
  }

  return (
    <div className="min-h-screen w-full relative bg-white">
      <DesktopHeader 
        isScrolled={isScrolled} 
        onLoginClick={modalManager.openLoginModal} 
      />
      
      <MobileHeader 
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onLoginClick={handleMobileLoginClick}
      />
      
      <HeroSection />

      <Carousel01/>
      
      <CTABanner />
      
      <FAQ />
      
      <Footer />
      
      <ModalContainer {...modalManager} />
    </div>
  )
}