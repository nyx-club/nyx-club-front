import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-[#B20118]/20 py-8">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="relative w-6 h-6">
              <Image src="/images/nyx-symbol.png" alt="NYX BDSM CLUB" fill className="object-contain" />
            </div>
            <span className="text-lg font-bold text-white">NYX BDSM CLUB</span>
          </div>

          <div className="text-sm text-gray-400 text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} NYX BDSM CLUB</p>
            <p>Todos los derechos reservados.</p>
            <p className="mt-1">
              <Link href="/privacy" className="hover:text-[#B20118] transition-colors">
                Política de Privacidad
              </Link>
              {" • "}
              <Link href="/terms" className="hover:text-[#B20118] transition-colors">
                Términos de Servicio
              </Link>
            </p>
            <p className="mt-1 text-xs">
              Created by{" "}
              <a 
                href="https://sojobo.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#B20118] transition-colors"
              >
                Sojobo
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
