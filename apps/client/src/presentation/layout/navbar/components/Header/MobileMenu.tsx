import Link from "next/link"

interface MobileMenuProps {
  isOpen: boolean
  onLoginClick: () => void
}

export const MobileMenu = ({ isOpen, onLoginClick }: MobileMenuProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden">
      <div className="absolute top-20 left-4 right-4 mt-10 bg-orange-500 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl p-6">
        <nav className="flex flex-col space-y-4">
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
             after:transition-all after:duration-300 hover:after:w-40"
            >
              <span className="relative z-20">{item.name}</span>
            </Link>
          ))}
          <div className="border-t border-border/50 pt-4 mt-4 flex flex-col space-y-3">
            <button
              onClick={onLoginClick}
              type="button"
              className="relative flex items-center justify-center cursor-pointer w-full px-4 py-3 text-base font-semibold text-orange-500 bg-white rounded-full shadow-md transition-colors duration-300 hover:bg-orange-500 hover:text-white border-2 border-white"
            >
              <span className="relative z-10">Área do Cliente</span>
            </button>

          </div>
        </nav>
      </div>
    </div>
  )
}