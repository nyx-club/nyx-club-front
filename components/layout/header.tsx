import Link from "next/link"
import Image from "next/image"

export default function Header({ currentPage = 'home' }: { currentPage?: 'home' | 'events' | 'contact' }) {
  return (
    <header className="border-b border-[#B20118]/20 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <Image src="/images/nyx-symbol.png" alt="Nyx Club" fill className="object-contain" priority />
          </div>
          <span className="text-xl font-bold text-white">NYX CLUB</span>
        </Link>

        <nav className="flex items-center space-x-8">
          <Link 
            href="/events" 
            className={`transition-colors ${currentPage === 'events' ? 'text-[#B20118]' : 'text-gray-300 hover:text-[#B20118]'}`}
          >
            Eventos
          </Link>
          <Link 
            href="/contact" 
            className={`transition-colors ${currentPage === 'contact' ? 'text-[#B20118]' : 'text-gray-300 hover:text-[#B20118]'}`}
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  )
}
