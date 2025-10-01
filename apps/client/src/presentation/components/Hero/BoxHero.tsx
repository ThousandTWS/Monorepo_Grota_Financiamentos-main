import Image from "next/image"
import { useEffect, useState } from "react"
import { slides } from "./data/slider"

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[49rem] overflow-hidden -mt-24">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-5xl whitespace-pre-line  font-bold leading-tight transition-all duration-500">
              Financiamento com Segurança<br/> e Confiança
            </h1>
            <p className="text-2xl whitespace-pre-line text-gray-300 leading-relaxed max-w-2xl mx-auto transition-all duration-500">
              Há mais de 30 anos conectando clientes, lojistas<br/> e instituições financeiras.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              className="relative flex items-center justify-center cursor-pointer w-80 px-4 py-3 text-base font-semibold text-white bg-[#1B4B7C] rounded-full shadow-md transition-colors duration-300 hover:bg-[#164574] hover:text-white animate-[blink_1s_infinite]"
            >
              <span className="relative z-10 text-xl">Simule seu Financiamento</span>
            </button>


           <button
              type="button"
              className="relative flex items-center justify-center cursor-pointer w-80 px-4 py-3 text-base font-semibold text-[#1B4B7C] bg-[#F8FAFC] rounded-full shadow-md transition-colors duration-300 hover:bg-[#1B4B7C] hover:text-white animate-[blink_1s_infinite]"
            >
              <span className="relative z-10 text-xl">Seja nosso Parceiro</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;