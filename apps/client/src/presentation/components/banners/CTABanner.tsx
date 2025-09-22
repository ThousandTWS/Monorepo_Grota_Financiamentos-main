"use client"
import { Car, Calculator, ArrowRight, Shield, Clock } from "lucide-react"
import Image from "next/image"

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 rounded-tr-[5rem]">
      <div className="absolute inset-0">
        <Image
          src="https://placehold.net/800x600.png"
          alt="Carros em showroom"
          className="w-full h-full object-cover"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Lorem ipsum dolor
            <span className="text-orange-500 block">sit amet consectetur</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
         
          <div className="bg-white backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center group hover:border-orange-500/50 transition-all duration-300">
            <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Lorem Ipsum</h3>
            <p className="text-gray-400">Lorem ipsum dolor sit amet consectetur</p>
          </div>

          <div className="bg-white backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center group hover:border-orange-500/50 transition-all duration-300">
            <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
              <Shield className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Dolor Sit</h3>
            <p className="text-gray-400">Adipiscing elit sed do eiusmod tempor</p>
          </div>

          <div className="bg-white to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center group hover:border-orange-500/50 transition-all duration-300">
            <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
              <Calculator className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Amet Consectetur</h3>
            <p className="text-gray-400">Incididunt ut labore et dolore magna</p>
          </div>
        </div>

       
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 animate-pulse" />
          
          <div className="relative z-10">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Lorem ipsum dolor!
            </h3>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-white hover:bg-gray-100 text-orange-600 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <Calculator className="w-6 h-6" />
                Lorem Ipsum
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                <Car className="w-6 h-6" />
                Dolor Sit Amet
              </button>
            </div>
          </div>


          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </div>
      </div>

  
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-orange-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-transparent rounded-full blur-3xl" />
    </section>
  )
}