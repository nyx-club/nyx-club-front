import { X, MapPin, Clock, Users, Calendar as CalendarIcon } from "lucide-react"
import { Event } from "@/types/event"
import { eventCategories } from "@/data/events"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EventModalProps {
  event: Event | null
  onClose: () => void
}

export default function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null

  const category = eventCategories[event.category]
  const formattedDate = format(event.date, "EEEE d 'de' MMMM yyyy", { locale: es })
  
  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 p-0">
        <div className="p-6 pb-0">
          <div className="relative">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-0 top-0 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar</span>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
            <Image
              src={event.mainImage}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 75vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={`${category.bgColor} ${category.borderColor} border`}>
                  {category.name}
                </Badge>
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                <p className="text-gray-300 whitespace-pre-line">{event.description}</p>
              </div>

              {event.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Galería</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${event.title} - Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Detalles del evento</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="w-5 h-5 text-[#B20118] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Fecha</p>
                      <p className="text-white">{formattedDate}</p>
                      <p className="text-white">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#B20118] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Ubicación</p>
                      <p className="text-white">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#B20118] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Capacidad</p>
                      <p className="text-white">{event.capacity}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-[#B20118] hover:bg-[#8B0112] mt-4">
                  Reservar plaza
                </Button>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Categoría</h3>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.bgColor} border ${category.borderColor}`} />
                  <span>{category.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
