"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Clock, Instagram, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [contact, setContact] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const mapUrl = "https://maps.app.goo.gl/oP7T5a6UUCnnvdPZ7";

  useEffect(() => {
    fetch("https://nyx-club-back.onrender.com/api/contact-infos?populate=*")
      .then((res) => res.json())
      .then(({ data }) => setContact(data[0]))
      .catch(() => setContact(undefined));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(mapUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
        Cargando información de contacto...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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

          <div className="max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8 mb-12">
              <h2 className="text-3xl font-semibold mb-8">Ponte en Contacto</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#B20118]/10 border-[#B20118]/30">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#B20118]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[#B20118]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Ubicación
                        </h3>
                        <p className="text-gray-300">
                          {contact.address.street}
                        </p>
                        <p className="text-gray-300">
                          {contact.address.city}, {contact.address.country}{" "}
                          {contact.address.postalCode}
                        </p>
                        {/* Google Maps Link Box */}
                        <div className="mt-4 p-3 bg-[#B20118]/10 border border-[#B20118]/30 rounded-lg flex items-center space-x-3">
                          <Link
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#B20118] font-medium hover:underline"
                          >
                            Ver en Google Maps
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#B20118]/10 border-[#B20118]/30">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#B20118]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Instagram className="w-6 h-6 text-[#B20118]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          Síguenos
                        </h3>
                        <div className="flex flex-col space-y-3">
                          <Link
                            href={contact.social.instagram}
                            className="flex items-center space-x-3 text-gray-400 hover:text-[#B20118] group"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="w-10 h-10 bg-[#B20118]/10 border border-[#B20118]/30 rounded-lg flex items-center justify-center group-hover:border-[#B20118] transition-colors">
                              <Instagram className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Instagram</span>
                          </Link>
                          <Link
                            href={contact.social.fetlife}
                            className="flex items-center space-x-3 text-gray-400 hover:text-[#B20118] group"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="w-10 h-10 bg-[#B20118]/10 border border-[#B20118]/30 rounded-lg flex items-center justify-center group-hover:border-[#B20118] transition-colors">
                              <Heart className="w-5 h-5" />
                            </div>
                            <span className="font-medium">FetLife</span>
                          </Link>
                        </div>
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
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Correo Electrónico
                        </h3>
                        <p className="text-gray-300">{contact.email}</p>
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
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Teléfono
                        </h3>
                        <p className="text-gray-300">{contact.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#B20118]/10 border-[#B20118]/30 md:col-span-2">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-[#B20118]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-8 h-8 text-[#B20118]" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-white mb-3">
                          Horarios
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                          <div className="space-y-2">
                            {contact.openingHours.map((hour: any) => (
                              <p className="flex justify-between" key={hour.id}>
                                <span className="font-medium">{hour.day}:</span>
                                <span>
                                  {hour.open} - {hour.close}
                                </span>
                              </p>
                            ))}
                          </div>
                          <div className="flex items-center md:justify-center">
                            <div className="px-4 py-2 bg-[#B20118]/20 rounded-lg">
                              <p className="text-center font-medium">
                                {contact.closedDays}:
                              </p>
                              <p className="text-center font-medium">
                                <b>Cerrado</b>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
