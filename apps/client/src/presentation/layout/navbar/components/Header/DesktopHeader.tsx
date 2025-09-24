import Image from "next/image"
import Link from "next/link"

interface DesktopHeaderProps {
  isScrolled: boolean
  onLoginClick: () => void
}

export const DesktopHeader = ({ isScrolled, onLoginClick }: DesktopHeaderProps) => {
  return (
    <header
      className={`sticky top-4 z-[9999] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-orange-500 md:flex backdrop-blur-sm border border-border/50 shadow-lg transition-all duration-300 ${
        isScrolled ? "max-w-5xl px-2" : "max-w-7xl px-6"
      } py-2`}
      style={{
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        perspective: "1000px",
      }}
    >
      <Link
        className={`z-50 flex items-center justify-center gap-2 transition-all duration-300 ${
          isScrolled ? "ml-4" : ""
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
            className="relative px-4 py-2 text-white hover:text-foreground transition-colors cursor-pointer"
          >
            <span className="relative z-20">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={onLoginClick}
          className="rounded-md font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center bg-white text-black shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] px-4 py-2 text-sm"
        >
          Area do Logista
        </button>
      </div>
    </header>
  )
}