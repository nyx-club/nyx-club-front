import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Mail, Phone, Clock, Instagram, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#B20118]/20 bg-black/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image src="/images/nyx-symbol.png" alt="Nyx Club" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold text-white">NYX CLUB</span>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link href="/events" className="text-gray-300 hover:text-[#B20118] transition-colors">
              Eventos
            </Link>
            <Link href="/contact" className="text-[#B20118] transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B20118] to-[#8B0112]">
                Contáctanos
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              ¿Tienes preguntas sobre membresía o nuestros eventos?
              <br />
              Estamos aquí para ayudarte.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold mb-8">Ponte en Contacto</h2>

                <div className="space-y-6">
                  <Card className="bg-[#B20118]/10 border-[#B20118]/30">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-[#B20118]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-[#B20118]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Ubicación</h3>
                          <p className="text-gray-300">Calle de Amaniel 13</p>
                          <p className="text-gray-300">Madrid, Madrid España 28015</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#B20118]/10 border-[#B20118]/30">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-[#B20118]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-[#B20118]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Correo Electrónico</h3>
                          <p className="text-gray-300">info@clubnyx.net</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#B20118]/10 border-[#B20118]/30">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-[#B20118]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-[#B20118]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Teléfono</h3>
                          <p className="text-gray-300">+34 602 08 30 14</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#B20118]/10 border-[#B20118]/30">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-[#B20118]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-[#B20118]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Horarios</h3>
                          <div className="space-y-1 text-gray-300">
                            <p>Lunes - Jueves: 16:00 p.m. - 04:00 a.m.</p>
                            <p>Viernes - Domingo: 16:00 p.m. - 06:00 a.m.</p>
                            <p>Lunes: Cerrado</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
                <div className="flex space-x-4">
                  <Link
                    href="https://www.instagram.com/nyx_club_madrid"
                    className="w-12 h-12 bg-[#B20118]/10 border border-[#B20118]/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#B20118] hover:border-[#B20118] transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link
                    href="https://fetlife.com/NYX_BDSM_CLUB"
                    className="w-12 h-12 bg-[#B20118]/10 border border-[#B20118]/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#B20118] hover:border-[#B20118] transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <Card className="bg-[#B20118]/10 border-[#B20118]/30 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Consultas de Membresía</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  ¿Interesado en convertirte en miembro? Damos la bienvenida a solicitudes de personas de 18 años o más
                  que estén comprometidas con nuestros valores comunitarios de respeto, seguridad y educación. Todos los
                  miembros potenciales deben interiorizar los valores de la comunidad.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="border-[#B20118] text-[#B20118] hover:bg-[#B20118] hover:text-white"
                  >
                    Descargar Solicitud de Membresía
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#B20118]/20 py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="relative w-6 h-6">
                <Image src="/images/nyx-symbol.png" alt="Nyx Club" fill className="object-contain" />
              </div>
              <span className="text-lg font-bold text-white">NYX CLUB</span>
            </div>

            <div className="text-sm text-gray-400 text-center md:text-right">
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
