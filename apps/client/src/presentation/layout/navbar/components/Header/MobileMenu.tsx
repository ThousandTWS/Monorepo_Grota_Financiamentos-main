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
          {["Inicio", "Pricing", "Testimonials", "FAQ"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-left px-4 py-3 text-lg font-medium text-white hover:text-white transition-colors rounded-lg hover:bg-background/50 cursor-pointer"
            >
              {item}
            </Link>
          ))}
          <div className="border-t border-border/50 pt-4 mt-4 flex flex-col space-y-3">
            <button
              onClick={onLoginClick}
              className="px-4 py-3 text-lg font-bold text-center bg-white text-orange-500 rounded-lg shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Area do Logista
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}