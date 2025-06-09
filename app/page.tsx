import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 lg:px-6 py-8">
        {/* Central Logo and Navigation Container */}
        <div className="text-center max-w-2xl mx-auto">
          {/* Main NYX Symbol - Increased Size */}
          <div className="mb-12">
            <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] mx-auto mb-8">
              <Image src="/images/nyx-logo.jpg" alt="Símbolo del Nyx Club" fill className="object-contain" priority />
            </div>

            {/* Tagline in Spanish */}
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed mb-12">
              Una comunidad exclusiva dedicada a la educación, seguridad y conexiones significativas en un ambiente
              sofisticado.
            </p>
          </div>

          {/* Vertical Navigation Menu with Custom Red */}
          <nav className="space-y-6">
            <Link href="/events" className="group relative block w-full max-w-xs mx-auto">
              <div className="bg-[#B20118]/20 border border-[#B20118]/40 rounded-lg p-6 hover:bg-[#B20118]/30 hover:border-[#B20118]/60 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-4">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src="/images/nyx-symbol.png"
                      alt="Símbolo NYX"
                      fill
                      className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="text-2xl font-semibold text-gray-200 group-hover:text-[#B20118] transition-colors">
                    Eventos
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Descubre nuestros talleres y reuniones
                </div>
              </div>
            </Link>

            <Link href="/contact" className="group relative block w-full max-w-xs mx-auto">
              <div className="bg-[#B20118]/20 border border-[#B20118]/40 rounded-lg p-6 hover:bg-[#B20118]/30 hover:border-[#B20118]/60 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-4">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src="/images/nyx-symbol.png"
                      alt="Símbolo NYX"
                      fill
                      className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="text-2xl font-semibold text-gray-200 group-hover:text-[#B20118] transition-colors">
                    Contacto
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Ponte en contacto con nuestra comunidad
                </div>
              </div>
            </Link>
          </nav>
        </div>

        {/* Enhanced Background Elements with Custom Red */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#B20118]/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#B20118]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B20118]/3 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-[#B20118]/4 rounded-full blur-2xl"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#B20118]/20 py-6">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="relative w-6 h-6">
                <Image src="/images/nyx-symbol.png" alt="Nyx Club" fill className="object-contain" />
              </div>
              <span className="text-lg font-bold text-white">NYX CLUB</span>
            </div>
            <div className="text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} Nyx Club. Todos los derechos reservados.</p>
              <p className="mt-1">
                <Link href="/privacy" className="hover:text-[#B20118] transition-colors">
                  Política de Privacidad
                </Link>
                {" • "}
                <Link href="/terms" className="hover:text-[#B20118] transition-colors">
                  Términos de Servicio
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
