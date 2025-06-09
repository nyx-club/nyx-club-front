"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Film,
  RibbonIcon as Rope,
  Filter,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"

// Event categories with their properties in Spanish and custom red
const eventCategories = {
  shibari: {
    name: "Shibari",
    icon: Rope,
    color: "from-[#B20118] to-[#8B0112]",
    bgColor: "bg-[#B20118]/20",
    borderColor: "border-[#B20118]/50",
    hoverColor: "hover:bg-[#B20118]/30",
    textColor: "text-[#B20118]",
  },
  lecture: {
    name: "Día de Conferencia",
    icon: BookOpen,
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-600/50",
    hoverColor: "hover:bg-purple-900/30",
    textColor: "text-purple-400",
  },
  cineforum: {
    name: "Día de Cinefórum",
    icon: Film,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-600/50",
    hoverColor: "hover:bg-blue-900/30",
    textColor: "text-blue-400",
  },
}

// Mock event data with categories in Spanish
const events = [
  {
    id: 1,
    title: "Introducción al Shibari",
    category: "shibari",
    date: new Date(2025, 4, 15), // May 15, 2025
    time: "19:00 - 21:00",
    location: "Sala de Talleres",
    capacity: "20 asistentes",
    description:
      "Un taller introductorio sobre el arte del Shibari, enfocándose en seguridad, nudos básicos y técnicas fundamentales. Esta sesión está diseñada para principiantes sin experiencia previa. Se proporcionarán todos los materiales, y los participantes aprenderán sobre selección de cuerdas, consideraciones de seguridad y ataduras básicas. Nuestro instructor experimentado te guiará a través de cada paso con cuidadosa atención al detalle.",
    mainImage: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["Taller", "Principiante", "Práctico"],
  },
  {
    id: 2,
    title: "Conferencia sobre Consentimiento y Comunicación",
    category: "lecture",
    date: new Date(2025, 4, 22), // May 22, 2025
    time: "18:30 - 20:30",
    location: "Salón Principal",
    capacity: "40 asistentes",
    description:
      "Una conferencia integral sobre la importancia del consentimiento y la comunicación efectiva en todas las interacciones. Esta sesión educativa cubrirá el establecimiento de límites, comprensión de señales verbales y no verbales, y creación de una cultura de respeto. Dirigida por educadores certificados con amplia experiencia en educación sobre consentimiento, esta conferencia es esencial para todos los miembros independientemente de su nivel de experiencia.",
    mainImage: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["Educación", "Comunicación", "Esencial"],
  },
  {
    id: 3,
    title: "Noche de Cine Negro Clásico",
    category: "cineforum",
    date: new Date(2025, 4, 29), // May 29, 2025
    time: "20:00 - 23:00",
    location: "Sala de Proyección",
    capacity: "30 asistentes",
    description:
      "Únete a nosotros para una noche de cine negro clásico, con la proyección de una obra maestra reconocida seguida de una discusión moderada sobre sus temas, cinematografía e impacto cultural. Se servirán refrigerios ligeros, y se anima a los participantes a compartir sus perspectivas durante la conversación posterior a la película. Este cinefórum crea un espacio para el compromiso intelectual y la apreciación del arte cinematográfico.",
    mainImage: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["Película", "Discusión", "Social"],
  },
  {
    id: 4,
    title: "Técnicas Intermedias de Shibari",
    category: "shibari",
    date: new Date(2025, 5, 5), // June 5, 2025
    time: "19:30 - 22:00",
    location: "Sala de Talleres",
    capacity: "15 asistentes",
    description:
      "Basándose en los fundamentos, este taller intermedio explora patrones y técnicas más complejas de Shibari. Los participantes deben haber completado el taller introductorio o tener experiencia equivalente. La sesión cubrirá arneses intermedios, patrones decorativos y preparación para suspensión. Por favor trae tus propias cuerdas si las tienes, aunque habrá suministros disponibles para quienes los necesiten.",
    mainImage: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["Taller", "Intermedio", "Práctico"],
  },
  {
    id: 5,
    title: "Conferencia sobre Psicología de las Dinámicas de Poder",
    category: "lecture",
    date: new Date(2025, 5, 12), // June 12, 2025
    time: "19:00 - 21:00",
    location: "Área de Descanso",
    capacity: "35 asistentes",
    description:
      "Una conferencia educativa que explora los aspectos psicológicos de las dinámicas de poder en las relaciones. Esta sesión será presentada por la Dra. Elena Rodríguez, una psicóloga clínica especializada en dinámicas relacionales. Los temas incluirán la psicología del intercambio de poder, seguridad emocional y mantenimiento de límites saludables. La conferencia será seguida por una sesión de preguntas y respuestas donde los asistentes pueden interactuar con la presentadora.",
    mainImage: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["Educación", "Psicología", "Teoría"],
  },
  {
    id: 6,
    title: "Exploración del Cine de Vanguardia",
    category: "cineforum",
    date: new Date(2025, 5, 19), // June 19, 2025
    time: "20:30 - 23:30",
    location: "Sala de Proyección",
    capacity: "25 asistentes",
    description:
      "Un cinefórum especial dedicado al cine experimental y de vanguardia. Este evento presentará cortometrajes seleccionados que desafían las estructuras narrativas convencionales y exploran técnicas visuales innovadoras. Después de la proyección, nuestro curador de cine facilitará una discusión sobre los méritos artísticos y la significancia cultural del cine experimental. Este evento es perfecto para aquellos interesados en el lado más artístico y experimental del cine.",
    mainImage: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["Película", "Experimental", "Artístico"],
  },
]

export default function EventsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [calendarDays, setCalendarDays] = useState([])
  const [activeFilters, setActiveFilters] = useState(Object.keys(eventCategories))
  const [viewMode, setViewMode] = useState("all")

  // Generate calendar days for the current month
  useEffect(() => {
    const firstDay = startOfMonth(currentMonth)
    const lastDay = endOfMonth(currentMonth)

    // Get all days in the current month
    const days = eachDayOfInterval({ start: firstDay, end: lastDay })

    setCalendarDays(days)
  }, [currentMonth])

  // Filter events based on active filters
  const filteredEvents = events.filter((event) => activeFilters.includes(event.category))

  // Navigate to previous month
  const previousMonth = () => {
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentMonth(prevMonth)
  }

  // Navigate to next month
  const nextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
  }

  // Check if a day has an event (respecting filters)
  const hasEvent = (day) => {
    return filteredEvents.some((event) => isSameDay(event.date, day))
  }

  // Get event for a specific day (respecting filters)
  const getEvent = (day) => {
    return filteredEvents.find((event) => isSameDay(event.date, day))
  }

  // Get event category for a specific day
  const getEventCategory = (day) => {
    const event = filteredEvents.find((event) => isSameDay(event.date, day))
    return event ? event.category : null
  }

  // Handle day click
  const handleDayClick = (day) => {
    const event = getEvent(day)
    if (event) {
      setSelectedEvent(event)
      // Scroll to event details
      setTimeout(() => {
        document.getElementById("event-details")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  // Toggle a filter
  const toggleFilter = (category) => {
    setActiveFilters((prev) => {
      // If the category is already in the filters, remove it
      if (prev.includes(category)) {
        // Don't allow removing all filters
        if (prev.length === 1) return prev
        return prev.filter((c) => c !== category)
      }
      // Otherwise add it
      return [...prev, category]
    })
  }

  // Set all filters
  const setAllFilters = () => {
    setActiveFilters(Object.keys(eventCategories))
    setViewMode("all")
  }

  // Set a single filter
  const setSingleFilter = (category) => {
    setActiveFilters([category])
    setViewMode(category)
  }

  // Get the category icon component
  const CategoryIcon = ({ category, className = "h-4 w-4" }) => {
    if (!category || !eventCategories[category]) return null
    const Icon = eventCategories[category].icon
    return <Icon className={className} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#B20118]/20 bg-black/95 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image src="/images/nyx-symbol.png" alt="Club NYX" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold text-white">CLUB NYX</span>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link href="/events" className="text-[#B20118] transition-colors">
              Eventos
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-[#B20118] transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B20118] to-[#8B0112]">
                Calendario
              </span>{" "}
              de Eventos
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Descubre nuestros próximos talleres, reuniones sociales y eventos educativos
            </p>
          </div>

          {/* Filtering Options */}
          <div className="mb-8">
            {/* Desktop Tabs */}
            <div className="hidden md:block">
              <Tabs
                value={viewMode}
                onValueChange={(value) => {
                  if (value === "all") {
                    setAllFilters()
                  } else {
                    setSingleFilter(value)
                  }
                }}
              >
                <TabsList className="bg-[#B20118]/10 border border-[#B20118]/30">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-[#B20118]/30 data-[state=active]:text-white"
                  >
                    Todos los Eventos
                  </TabsTrigger>
                  {Object.entries(eventCategories).map(([key, category]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className={`data-[state=active]:${category.bgColor} data-[state=active]:${category.textColor}`}
                    >
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-[#B20118]/30 bg-[#B20118]/10">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>
                        {activeFilters.length === Object.keys(eventCategories).length
                          ? "Todos los Eventos"
                          : `${activeFilters.length} ${activeFilters.length === 1 ? "Categoría" : "Categorías"}`}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  <DropdownMenuCheckboxItem
                    checked={activeFilters.length === Object.keys(eventCategories).length}
                    onCheckedChange={() => setAllFilters()}
                  >
                    Todos los Eventos
                  </DropdownMenuCheckboxItem>
                  {Object.entries(eventCategories).map(([key, category]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={activeFilters.includes(key)}
                      onCheckedChange={() => toggleFilter(key)}
                      className="flex items-center"
                    >
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilters.length < Object.keys(eventCategories).length && (
                <>
                  <div className="text-sm text-gray-400 flex items-center mr-1">Filtros activos:</div>
                  {activeFilters.map((filter) => (
                    <Badge
                      key={filter}
                      className={`${eventCategories[filter].bgColor} ${eventCategories[filter].textColor} border-none flex items-center gap-1 pl-2`}
                    >
                      <CategoryIcon category={filter} />
                      {eventCategories[filter].name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => toggleFilter(filter)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Eliminar filtro {eventCategories[filter].name}</span>
                      </Button>
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-400 hover:text-white p-0 h-6"
                    onClick={setAllFilters}
                  >
                    Limpiar filtros
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Calendar Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{format(currentMonth, "MMMM yyyy", { locale: es })}</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousMonth}
                  className="border-[#B20118]/20 text-gray-300 hover:text-[#B20118] hover:border-[#B20118]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  className="border-[#B20118]/20 text-gray-300 hover:text-[#B20118] hover:border-[#B20118]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers in Spanish */}
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-400">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before the start of the month */}
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="aspect-square p-1"></div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day) => {
                const dayHasEvent = hasEvent(day)
                const eventCategory = getEventCategory(day)
                const categoryStyles = eventCategory ? eventCategories[eventCategory] : null

                return (
                  <div
                    key={day.toString()}
                    className={`aspect-square p-1 ${dayHasEvent ? "cursor-pointer" : ""}`}
                    onClick={() => dayHasEvent && handleDayClick(day)}
                  >
                    <div
                      className={`h-full w-full flex flex-col items-center justify-center rounded-lg border 
                        ${
                          dayHasEvent
                            ? `${categoryStyles.borderColor} ${categoryStyles.bgColor} ${categoryStyles.hoverColor}`
                            : "border-gray-800"
                        } transition-colors`}
                    >
                      <span className="text-sm font-medium">{format(day, "d")}</span>
                      {dayHasEvent && (
                        <div className="mt-1 flex items-center">
                          <CategoryIcon category={eventCategory} className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Empty cells for days after the end of the month */}
              {Array.from({ length: 6 - endOfMonth(currentMonth).getDay() }).map((_, index) => (
                <div key={`empty-end-${index}`} className="aspect-square p-1"></div>
              ))}
            </div>
          </div>

          {/* Event Details Section */}
          {selectedEvent ? (
            <div id="event-details" className="scroll-mt-24">
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Badge
                    className={`${eventCategories[selectedEvent.category].bgColor} ${eventCategories[selectedEvent.category].textColor} border-none`}
                  >
                    <CategoryIcon category={selectedEvent.category} className="mr-1" />
                    {eventCategories[selectedEvent.category].name}
                  </Badge>
                  <h2 className="text-3xl font-bold">{selectedEvent.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedEvent.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-[#B20118]/10 text-gray-300 border border-[#B20118]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Main Event Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={selectedEvent.mainImage || "/placeholder.svg"}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Event Details */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CalendarIcon className="h-5 w-5 text-[#B20118]" />
                      <span>{format(selectedEvent.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="h-5 w-5 text-[#B20118]" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-5 w-5 text-[#B20118]" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="h-5 w-5 text-[#B20118]" />
                      <span>{selectedEvent.capacity}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Acerca de Este Evento</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                  </div>

                  <Button className="w-full md:w-auto bg-[#B20118] hover:bg-[#8B0112] text-white">
                    Registrarse para el Evento
                  </Button>
                </div>
              </div>

              {/* Image Carousel */}
              {selectedEvent.images.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-6">Galería del Evento</h3>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {selectedEvent.images.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <Card className="border-[#B20118]/20 bg-black">
                              <CardContent className="flex aspect-video items-center justify-center p-0">
                                <div className="relative w-full h-full">
                                  <Image
                                    src={image || "/placeholder.svg"}
                                    alt={`${selectedEvent.title} - Imagen ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/70 border-[#B20118]/20 text-white" />
                    <CarouselNext className="right-2 bg-black/50 hover:bg-black/70 border-[#B20118]/20 text-white" />
                  </Carousel>
                </div>
              )}

              {/* Related Events */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Otros Eventos Próximos</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents
                    .filter((event) => event.id !== selectedEvent.id)
                    .slice(0, 3)
                    .map((event) => (
                      <Card key={event.id} className="bg-[#B20118]/10 border-[#B20118]/30 text-white overflow-hidden">
                        <div className="relative h-48">
                          <Image
                            src={event.mainImage || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge
                              className={`${eventCategories[event.category].bgColor} ${eventCategories[event.category].textColor} border-none`}
                            >
                              <CategoryIcon category={event.category} className="mr-1" />
                              {eventCategories[event.category].name}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{format(event.date, "d MMM yyyy", { locale: es })}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-[#B20118]/20 text-[#B20118] hover:bg-[#B20118]/20"
                            onClick={() => {
                              setSelectedEvent(event)
                              document.getElementById("event-details")?.scrollIntoView({ behavior: "smooth" })
                            }}
                          >
                            Ver Detalles
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-[#B20118] mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Selecciona una Fecha con Evento</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Haz clic en cualquier fecha resaltada en el calendario para ver información detallada sobre el evento.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#B20118]/20 py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="relative w-6 h-6">
                <Image src="/images/nyx-symbol.png" alt="Club NYX" fill className="object-contain" />
              </div>
              <span className="text-lg font-bold text-white">CLUB NYX</span>
            </div>

            <div className="text-sm text-gray-400 text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} Club NYX. Todos los derechos reservados.</p>
              <p className="mt-1">
                <Link href="#" className="hover:text-[#B20118] transition-colors">
                  Política de Privacidad
                </Link>
                {" • "}
                <Link href="#" className="hover:text-[#B20118] transition-colors">
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
