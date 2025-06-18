"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
  parseISO,
  isAfter,
  isBefore,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Circle,
  X,
  LucideIcon,
  ChevronLeft as LeftIcon,
  ChevronRight as RightIcon,
  X as CloseIcon,
  Maximize2,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Event } from "@/types/event";
import EventFilters from "@/components/events/EventFilters";

// Helper to check if a value is a valid Lucide icon
function isLucideComponent(value: any): value is LucideIcon {
  return (
    typeof value === "function" &&
    value.displayName &&
    value.displayName.startsWith("Lucide")
  );
}

// Fetch events from Strapi
const fetchEvents = async () => {
  try {
    // Use a specific populate query for all relations
    const res = await fetch(
      "https://nyx-club-back.onrender.com/api/events?populate=*"
    );
    if (!res.ok) throw new Error("Failed to fetch events");
    const { data } = await res.json();

    return data
      .map((item: any) => {
        // Support both Strapi v4 (attributes) and v3 (flat)
        const attrs = item.attributes || item;
        // Prefer large format, fallback to main url
        // Handle new API: mainImage is an object with formats and url
        let mainImageUrl = null;
        if (attrs.mainImage && typeof attrs.mainImage === "object") {
          const mainImage = attrs.mainImage;
          // Prefer large, fallback to url
          const url = mainImage.formats?.large?.url || mainImage.url;
          if (url) mainImageUrl = url;
        }
        // Category
        let category = null;
        if (attrs.category?.data) {
          const cat = attrs.category.data;
          const catAttrs = cat.attributes || cat;
          category = {
            id: cat.id,
            name: catAttrs.name,
            slug: catAttrs.slug,
            icon: catAttrs.icon,
            bgColor: catAttrs.bgColor || "bg-gray-500/20",
            textColor: catAttrs.textColor || "text-gray-300",
          };
        }
        // Images
        // New API: images is an array of objects or null
        let images: string[] = [];
        if (Array.isArray(attrs.images)) {
          images = attrs.images
            .map((img: any) => {
              // Prefer large, fallback to url
              const url = img.formats?.large?.url || img.url;
              return url || null;
            })
            .filter(Boolean);
        }
        // Date
        const date = attrs.date ? new Date(attrs.date) : new Date();
        return {
          id: item.id, // Always use the Strapi event id
          title: attrs.title || "",
          description: attrs.description || "",
          date,
          time: attrs.time || "",
          location: attrs.location || "NYX BDSM Club - Calle Amaniel 13",
          category,
          capacity: attrs.capacity || null,
          mainImage: mainImageUrl,
          images,
          tags: attrs.tags || [],
          slug: attrs.slug || "",
          link: attrs.link || null,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "upcoming" | "past">(
    "upcoming"
  );

  useEffect(() => {
    fetchEvents().then((fetchedEvents) => {
      if (Array.isArray(fetchedEvents)) {
        setEvents(fetchedEvents);
      } else {
        console.error("Fetched events is not an array:", fetchedEvents);
        setEvents([]);
      }
    });
  }, []);

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];

    let filtered = [...events];

    // Apply category filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(
        (event) => event.category && activeFilters.includes(event.category.slug)
      );
    }

    // Apply time-based filtering
    const now = new Date();
    switch (viewMode) {
      case "upcoming":
        filtered = filtered.filter(
          (event) => event.date && isAfter(event.date, now)
        );
        break;
      case "past":
        filtered = filtered.filter(
          (event) => event.date && isBefore(event.date, now)
        );
        break;
    }

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter(
        (event) => event.date && isSameDay(event.date, selectedDate)
      );
    }

    return filtered;
  }, [events, activeFilters, viewMode, selectedDate]);

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Eventos</h1>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-6">
          <Calendar
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            events={events}
          />
          <EventFilters
            activeFilters={activeFilters}
            viewMode={viewMode}
            onFilterChange={setActiveFilters}
            onViewModeChange={setViewMode}
          />
        </div>
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay eventos que coincidan con los filtros seleccionados.
            </p>
          )}
        </div>
      </div>
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
}

// Calendar component
const Calendar = ({
  currentMonth,
  onMonthChange,
  selectedDate,
  onDateSelect,
  events,
}: {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  events: Event[];
}) => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // Add padding for days from previous month
  const startDay = firstDayOfMonth.getDay() || 7; // Convert Sunday (0) to 7
  const paddingDays = Array(startDay - 1).fill(null);

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const hasEventOnDay = (date: Date) => {
    return events.some((event) => event.date && isSameDay(event.date, date));
  };

  return (
    <div className="bg-black/30 border border-[#B20118]/20 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-[#B20118]/10 transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-[#B20118]/10 transition-colors"
          aria-label="Siguiente mes"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="h-10" />
        ))}
        {daysInMonth.map((day, index) => {
          const hasEvent = hasEventOnDay(day);
          const isSelected = selectedDate
            ? isSameDay(day, selectedDate)
            : false;

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={`
                h-10 rounded-full flex items-center justify-center text-sm
                ${isToday(day) ? "font-bold" : ""}
                ${
                  isSelected
                    ? "bg-[#B20118] text-white"
                    : "hover:bg-[#B20118]/20 hover:text-[#B20118]"
                }
                ${
                  !isSameMonth(day, currentMonth)
                    ? "text-gray-600"
                    : "text-white"
                }
                ${hasEvent ? "relative" : ""}
                transition-colors
              `}
            >
              {format(day, "d")}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 bg-[#B20118] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// EventCard component
const EventCard = ({
  event,
  onClick,
}: {
  event: Event;
  onClick: () => void;
}) => {
  let IconComponent = Circle;
  if (event.category?.icon) {
    const DynamicIcon =
      LucideIcons[event.category.icon as keyof typeof LucideIcons];
    if (isLucideComponent(DynamicIcon)) {
      IconComponent = DynamicIcon;
    }
  }

  return (
    <div
      className="border border-[#B20118]/20 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition-all hover:border-[#B20118]/40 hover:bg-[#B20118]/5"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        {event.category && (
          <span
            className={`${event.category.bgColor} ${event.category.textColor} text-xs px-2 py-1 rounded-full flex items-center gap-1`}
          >
            <IconComponent className="w-4 h-4 mr-1" />
            {event.category.name}
          </span>
        )}
      </div>
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <CalendarIcon className="w-4 h-4 mr-1" />
        <span>{format(event.date, "EEEE d MMMM yyyy", { locale: es })}</span>
      </div>
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <Clock className="w-4 h-4 mr-1" />
        <span>{event.time}</span>
      </div>
      <div className="flex items-center text-sm text-gray-400 mb-3">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{event.location}</span>
      </div>
      {event.capacity && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <Users className="w-4 h-4 inline mr-1" />
            {event.capacity}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to render rich text content
const renderRichText = (content: any) => {
  if (!content) return null;

  if (typeof content === "string") {
    return <p className="mb-4">{content}</p>;
  }

  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <div key={index} className="mb-4">
        {item.children?.map((child: any, i: number) => {
          if (child.type === "text") {
            let className = "";
            if (child.bold) className += " font-bold";
            if (child.italic) className += " italic";
            if (child.underline) className += " underline";

            return (
              <span key={i} className={className}>
                {child.text}
              </span>
            );
          }
          return null;
        })}
      </div>
    ));
  }

  return null;
};

// Image Gallery Component
const ImageGallery = ({
  images,
  title,
}: {
  images: string[];
  title: string;
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const openImage = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const navigate = (direction: "prev" | "next") => {
    if (selectedImage === null) return;

    if (direction === "prev") {
      setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
    } else {
      setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
    }
  };

  // Close modal when clicking outside the image
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeImage();
      }
    };

    if (selectedImage !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeImage();
        if (e.key === "ArrowLeft") navigate("prev");
        if (e.key === "ArrowRight") navigate("next");
      });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", () => {});
    };
  }, [selectedImage]);

  if (!images || images.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-zoom-in"
            onClick={() => openImage(index)}
          >
            <img
              src={image}
              alt={`${title} - Imagen ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 text-white hover:text-[#B20118] transition-colors p-2"
            aria-label="Cerrar"
          >
            <CloseIcon className="w-8 h-8" />
          </button>

          <div
            className="relative w-full max-w-5xl h-full flex items-center"
            ref={modalRef}
          >
            <button
              onClick={() => navigate("prev")}
              className="absolute left-4 p-2 text-white hover:text-[#B20118] transition-colors z-10"
              aria-label="Imagen anterior"
            >
              <LeftIcon className="w-8 h-8" />
            </button>

            <div className="w-full h-full flex items-center justify-center">
              <img
                src={images[selectedImage]}
                alt={`${title} - Imagen ${selectedImage + 1}`}
                className="max-h-[90vh] max-w-full object-contain"
              />
            </div>

            <button
              onClick={() => navigate("next")}
              className="absolute right-4 p-2 text-white hover:text-[#B20118] transition-colors z-10"
              aria-label="Siguiente imagen"
            >
              <RightIcon className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// EventModal component
const EventModal = ({
  event,
  onClose,
  isOpen,
}: {
  event: Event | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  if (!isOpen || !event) return null;

  let IconComponent = Circle;
  if (event.category?.icon) {
    const DynamicIcon =
      LucideIcons[event.category.icon as keyof typeof LucideIcons];
    if (isLucideComponent(DynamicIcon)) {
      IconComponent = DynamicIcon;
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-black border border-[#B20118]/30 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Event header with title and category */}
        <div className="sticky top-0 bg-black/90 backdrop-blur-sm z-10 p-4 border-b border-gray-800 pr-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white pr-4">
              {event.title}
            </h2>
            {event.category && (
              <span
                className={`${event.category.bgColor || "bg-gray-800"} ${
                  event.category.textColor || "text-white"
                } text-sm px-4 py-2 rounded-full flex items-center w-fit shrink-0`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {event.category.name}
              </span>
            )}
          </div>
        </div>
        {/* Main content */}
        <div className="p-6">
          {/* Event metadata */}
          {event.mainImage && (
            <div className="mb-6 rounded-lg overflow-hidden group relative">
              <img
                src={event.mainImage}
                alt={event.title}
                className="w-full h-auto max-h-[70vh] object-contain mx-auto bg-black"
                style={{ maxWidth: "100%", height: "auto" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder-event.jpg"; // Fallback image
                }}
                loading="lazy"
              />
            </div>
          )}
          <div className="space-y-3 mb-6 text-gray-300">
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-3 text-[#B20118]" />
              <span>
                {event.date
                  ? format(event.date, "EEEE d 'de' MMMM yyyy", { locale: es })
                  : "Fecha no disponible"}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-[#B20118]" />
              <span>{event.time || "Hora por confirmar"}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 mt-0.5 text-[#B20118] flex-shrink-0" />
              <span>{event.location || "Ubicación por confirmar"}</span>
            </div>
            {event.capacity && (
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-[#B20118]" />
                <span>Aforo: {event.capacity} personas</span>
              </div>
            )}
          </div>

          {/* Event description */}
          {event.description && (
            <div className="prose prose-invert max-w-none mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Descripción del evento
              </h3>
              <div className="space-y-4 text-gray-300">
                {renderRichText(event.description)}
              </div>
            </div>
          )}
{/* Main image and gallery */}
<div className="space-y-6">
            {/* Additional images */}
            {event.images && event.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {event.images
                  .filter((img) => img)
                  .map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-lg bg-gray-900"
                    >
                      <img
                        src={image}
                        alt={`${event.title} - Imagen ${index + 1}`}
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder-event.jpg"; // Fallback image
                        }}
                        loading="lazy"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action button */}
          {event.link && (
            <div className="pt-6 mt-6 border-t border-gray-800">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#B20118] text-white rounded-lg hover:bg-[#8B0112] transition-colors font-medium text-center"
                onClick={(e) => e.stopPropagation()}
              >
                Reservar plaza
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
