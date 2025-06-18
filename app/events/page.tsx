"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Event } from "@/types/event";
import EventFilters from "@/components/events/EventFilters";

// Helper to check if a value is a valid Lucide icon
function isLucideComponent(value: any): value is LucideIcon {
  return typeof value === 'function' && 
    value.displayName && 
    value.displayName.startsWith('Lucide');
}

// Fetch events from Strapi
const fetchEvents = async () => {
  try {
    const res = await fetch(
      "https://nyx-club-back.onrender.com/api/events?populate=*"
    );
    if (!res.ok) throw new Error('Failed to fetch events');
    const { data } = await res.json();
    
    return data.map((item: any) => {
      // Support both Strapi v4 (attributes) and v3 (flat)
      const attrs = item.attributes || item;
      // Prefer large format, fallback to main url
      let mainImageUrl = null;
      if (attrs.mainImage?.data) {
        const mainImage = attrs.mainImage.data;
        if (mainImage.attributes?.formats?.large?.url) {
          mainImageUrl = mainImage.attributes.formats.large.url.startsWith("http")
            ? mainImage.attributes.formats.large.url
            : `https://nyx-club-back.onrender.com${mainImage.attributes.formats.large.url}`;
        } else if (mainImage.attributes?.url) {
          mainImageUrl = mainImage.attributes.url.startsWith("http")
            ? mainImage.attributes.url
            : `https://nyx-club-back.onrender.com${mainImage.attributes.url}`;
        }
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
          bgColor: catAttrs.bgColor || 'bg-gray-500/20',
          textColor: catAttrs.textColor || 'text-gray-300',
        };
      }
      // Images
      let images: string[] = [];
      if (attrs.images?.data) {
        images = attrs.images.data.map((img: any) => {
          const imgAttrs = img.attributes || img;
          return imgAttrs.url.startsWith("http")
            ? imgAttrs.url
            : `https://nyx-club-back.onrender.com${imgAttrs.url}`;
        });
      }
      // Date
      const date = attrs.date ? new Date(attrs.date) : new Date();
      return {
        id: item.id,
        title: attrs.title || '',
        description: attrs.description || '',
        date,
        time: attrs.time || '',
        location: attrs.location || "NYX BDSM Club - Calle Amaniel 13",
        category,
        capacity: attrs.capacity || null,
        mainImage: mainImageUrl,
        images,
        tags: attrs.tags || [],
        slug: attrs.slug || '',
        link: attrs.link || null,
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Error fetching events:', error);
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
  const [viewMode, setViewMode] = useState<'all' | 'upcoming' | 'past'>("upcoming");

  useEffect(() => {
    fetchEvents().then((fetchedEvents) => {
      if (Array.isArray(fetchedEvents)) {
        setEvents(fetchedEvents);
      } else {
        console.error('Fetched events is not an array:', fetchedEvents);
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
        filtered = filtered.filter((event) => event.date && isAfter(event.date, now));
        break;
      case "past":
        filtered = filtered.filter((event) => event.date && isBefore(event.date, now));
        break;
    }

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter((event) => 
        event.date && isSameDay(event.date, selectedDate)
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
    const DynamicIcon = LucideIcons[event.category.icon as keyof typeof LucideIcons];
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
          <span className={`${event.category.bgColor} ${event.category.textColor} text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
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
    const DynamicIcon = LucideIcons[event.category.icon as keyof typeof LucideIcons];
    if (isLucideComponent(DynamicIcon)) {
      IconComponent = DynamicIcon;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-[#B20118]/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#B20118] transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {event.category && (
            <div className="mb-4">
              <span className={`${event.category.bgColor} ${event.category.textColor} text-sm px-3 py-1 rounded-full flex items-center w-fit`}>
                <IconComponent className="w-4 h-4 mr-2" />
                {event.category.name}
              </span>
            </div>
          )}
          <div className="space-y-2 mb-4 text-gray-300">
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>
                {event.date ? format(event.date, "EEEE d MMMM yyyy", { locale: es }) : ''}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location}</span>
            </div>
            {event.capacity && (
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>{event.capacity}</span>
              </div>
            )}
          </div>
          {/* Event description */}
          {event.description && (
            <div className="prose prose-invert max-w-none mb-6">
              {typeof event.description === 'string' ? event.description : null}
            </div>
          )}
          {/* Event images */}
          {event.mainImage && (
            <div className="mb-6">
              <img
                src={event.mainImage}
                alt={event.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          {event.images && event.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {event.images.map((image, index) => (
                image ? (
                  <img
                    key={index}
                    src={image}
                    alt={`${event.title} - Imagen ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : null
              ))}
            </div>
          )}
          {/* Event link */}
          {event.link && (
            <div className="mt-6">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#B20118] text-white rounded-lg hover:bg-[#B20118]/80 transition-colors"
              >
                Más información
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
