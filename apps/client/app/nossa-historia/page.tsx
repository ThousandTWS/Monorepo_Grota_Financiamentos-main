"use client"
import { useState } from "react"
import { useModalManager } from "@/src/presentation/layout/navbar/hooks/useModalManager"
import { useScrollDetection } from "@/src/presentation/layout/navbar/hooks/useScrollDetection"
import { useTheme } from "@/src/presentation/layout/navbar/hooks/useTheme"
import { DesktopHeader } from "@/src/presentation/layout/navbar/components/Header/DesktopHeader"
import { MobileHeader } from "@/src/presentation/layout/navbar/components/Header/MobileHeader"
import { MobileMenu } from "@/src/presentation/layout/navbar/components/Header/MobileMenu"
import { ModalContainer } from "@/src/presentation/layout/modais/ModalContainer"
import Footer from "@/src/presentation/layout/Footer/Footer"
import Counter from "@/src/presentation/components/Counter"
import { Users, Target, Award, TrendingUp, CheckCircle, Calendar } from "lucide-react"

export default function Sobre() {
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden -mt-24 h-[40rem]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center mt-5">
          <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Lorem Ipsum
            <span className="text-orange-500 block">Dolor Sit Amet</span>
          </h1>
          <p className="text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud.
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

      {/* About Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <span className="inline-block px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full uppercase tracking-wide mb-6">
                Lorem Ipsum
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://placehold.net/600x600.png"
                alt="Lorem ipsum"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <Counter end={15} suffix="+" />
              <p className="text-gray-600">Lorem Ipsum</p>
            </div>
            <div className="text-center">
              <Counter end={10} suffix="k+" />
              <p className="text-gray-600">Dolor Sit</p>
            </div>
            <div className="text-center">
              <Counter end={98} suffix="%" />
              <p className="text-gray-600">Amet Consectetur</p>
            </div>
            <div className="text-center">
              <Counter end={24} suffix="h" />
              <p className="text-gray-600">Adipiscing Elit</p>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lorem Ipsum</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dolor Sit</h3>
              <p className="text-gray-600">Tempor incididunt ut labore et dolore magna aliqua ut enim ad minim.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Amet Consectetur</h3>
              <p className="text-gray-600">Veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Adipiscing Elit</h3>
              <p className="text-gray-600">Commodo consequat duis aute irure dolor in reprehenderit in voluptate.</p>
            </div>
          </div>

          {/* Corporate Timeline */}
          <div className="mb-32 bg-gradient-to-b from-gray-50 to-white py-24">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Lorem Ipsum Dolor Sit
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                
                <div className="space-y-16">
                  {/* 2009 */}
                  <div className="relative flex items-start">
                    <div className="absolute left-6 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg" />
                    <div className="ml-20 bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">2009</h3>
                            <p className="text-orange-600 font-semibold">Lorem Ipsum</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          Lorem Ipsum
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.
                      </p>
                    </div>
                  </div>

                  {/* 2015 */}
                  <div className="relative flex items-start">
                    <div className="absolute left-6 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg" />
                    <div className="ml-20 bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">2015</h3>
                            <p className="text-orange-600 font-semibold">Dolor Sit</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          Dolor Sit
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris.
                      </p>
                    </div>
                  </div>

                  {/* 2020 */}
                  <div className="relative flex items-start">
                    <div className="absolute left-6 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg" />
                    <div className="ml-20 bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Award className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">2020</h3>
                            <p className="text-orange-600 font-semibold">Amet Consectetur</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          Amet Consectetur
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor.
                      </p>
                    </div>
                  </div>

                  {/* 2024 */}
                  <div className="relative flex items-start">
                    <div className="absolute left-6 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg" />
                    <div className="ml-20 bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">2024</h3>
                            <p className="text-orange-600 font-semibold">Adipiscing Elit</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          Adipiscing Elit
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Lorem ipsum dolor sit amet?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button className="bg-white hover:bg-gray-100 text-orange-600 px-10 py-4 rounded-xl font-bold text-lg transition-colors duration-200">
            Lorem Ipsum
          </button>
        </div>
      </section>
      
      <Footer />
      
      <ModalContainer {...modalManager} />
    </div>
  )
}