import { ArrowUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DesktopHeaderProps {
  isScrolled: boolean
  onLoginClick: () => void
}

export const DesktopHeader = ({ isScrolled, onLoginClick }: DesktopHeaderProps) => {
  return (
    <header
      className={`sticky top-4 z-[9999] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-orange-500 md:flex backdrop-blur-sm border border-border/50 shadow-lg transition-all duration-300 ${isScrolled ? "max-w-6xl px-10" : "max-w-7xl px-6"
        } py-3`}
      style={{
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        perspective: "1000px",
      }}
    >
      <Link
        className={`z-50 flex items-center justify-center gap-2 transition-all duration-300 ${isScrolled ? "ml-4" : ""
          }`}
        href="/"
      >
        <Image
          src="/Grota_logo_horizontal_positivo-removebg-preview.png"
          alt="Logo"
          width={150}
          height={150}
          className="filter brightness-0 invert"
        />
      </Link>

      <nav className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-muted-foreground transition duration-200 hover:text-foreground md:flex md:space-x-2">
        {[
          { name: "Inicio", href: "/" },
          { name: "Nossa Historia", href: "/nossa-historia" },
          { name: "Soluções", href: "/solucoes" },
          { name: "Financiamento", href: "#" },
          { name: "Blog", href: "#" },
          { name: "Contato", href: "/contato" }
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="relative px-4 py-2 text-white transition-colors cursor-pointer text-[1rem] 
             after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white 
             after:transition-all after:duration-300 hover:after:w-full"
          >
            <span className="relative z-20">{item.name}</span>
          </Link>

        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={onLoginClick}
          type="submit"
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-2 mx-auto text-[1rem] font-semibold border-2 text-orange-500 hover:text-white border-gray-200 rounded-full shadow-xl bg-white backdrop-blur-md overflow-hidden group cursor-pointer"
        >
          <span className="relative z-10">Area do cliente</span>
          {/* Efeito de background animado */}
          <span className="absolute inset-0 transition-all duration-700 -z-10 group-hover:scale-150 group-hover:bg-orange-500 hover:text-white rounded-full"></span>
        </button>
      </div>
    </header>
  )
}