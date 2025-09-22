import { Button } from "@/src/presentation/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface MobileHeaderProps {
  isMobileMenuOpen: boolean
  onMenuToggle: () => void
}

export const MobileHeader = ({ isMobileMenuOpen, onMenuToggle }: MobileHeaderProps) => {
  return (
    <header className="sticky top-4 z-[9999] mx-4 flex w-auto flex-row items-center justify-between rounded-full bg-orange-500 backdrop-blur-sm border border-border/50 shadow-lg md:hidden px-4 py-3">
      <Link
        className="flex items-center justify-center gap-2"
        href="https://v0.app"
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
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white transition-colors cursor-pointer"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col items-center justify-center w-5 h-5 space-y-1">
          <span
            className={`block w-4 h-0.5 bg-orange-500 transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block w-4 h-0.5 bg-orange-500 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-4 h-0.5 bg-orange-500 transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </div>
      </Button>
    </header>
  )
}