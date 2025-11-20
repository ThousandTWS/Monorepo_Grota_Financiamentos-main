import { Button } from "@/src/presentation/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface MobileHeaderProps {
  isMobileMenuOpen: boolean
  onMenuToggle: () => void
}

export const MobileHeader = ({ isMobileMenuOpen, onMenuToggle }: MobileHeaderProps) => {
  return (
    <header className="sticky top-4 z-[9999] mx-4 flex w-auto flex-row items-center justify-between rounded-full bg-[#1B4B7C] backdrop-blur-sm border border-border/50 shadow-lg md:hidden px-4 py-3">
      <Link
        className="flex items-center justify-center gap-2"
        href="https://fichaveiculo.com.br/financ/stan/fichaVeiculo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/Grota_logo_horizontal_positivo-removebg-preview.png"
          alt="Logo"
          width={150}
          height={150}
          className="filter brightness-0 invert"
        />
      </Link>

      <Button
        onClick={onMenuToggle}
        aria-label="Toggle menu"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md cursor-pointer hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <div className="flex flex-col items-center justify-center w-6 h-6 space-y-1.5 ">
          <span
            className={`block h-0.5 w-6 rounded-sm bg-[#1B4B7C] transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-sm bg-[#1B4B7C] transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-sm bg-[#1B4B7C] transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
          />
        </div>
      </Button>

    </header>
  )
}