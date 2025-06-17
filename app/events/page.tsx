"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, addMonths, subMonths, parseISO, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Ribbon,
  Filter,
  X,
  Film as FilmIcon,
} from "lucide-react";
import { eventCategories } from "@/data/events";
import { Event, EventCategory, EventCategoryData } from '@/types/event';

// Fetch events from Strapi
const fetchEvents = async () => {
  const res = await fetch("https://nyx-club-back.onrender.com/api/events?populate=*");
  const { data } = await res.json();
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    date: new Date(item.date),
    time: item.time,
    location: item.location || "NYX BDSM Club - Calle Amaniel 13",
    category: item.category,
    capacity: item.capacity,
    mainImage: item.mainImage ? (item.mainImage.url.startsWith('http') ? item.mainImage.url : `https://nyx-club-back.onrender.com${item.mainImage.url}`) : null,
    images: item.images ? item.images.map((img: any) => img.url.startsWith('http') ? img.url : `https://nyx-club-back.onrender.com${img.url}`) : [],
    tags: item.tags || [],
    slug: item.slug,
  }));
};

// Types
type ViewMode = 'all' | 'upcoming' | 'past';

// Define event categories with icons
const EVENT_CATEGORIES = {
  shibari: {
    ...eventCategories.shibari,
    icon: Ribbon
  },
  lecture: {
    ...eventCategories.lecture,
    icon: BookOpen
  },
  cineforum: {
    ...eventCategories.cineforum,
    icon: FilmIcon
  }
} as const;

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
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
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
    return events.some(event => isSameDay(event.date, date));
  };

  return (
    <div className="bg-black/30 border border-[#B20118]/20 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Siguiente mes"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="h-10" />
        ))}
        {daysInMonth.map((day, index) => {
          const hasEvent = hasEventOnDay(day);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={`
                h-10 rounded-full flex items-center justify-center
                ${isToday(day) ? 'font-bold' : ''}
                ${isSelected ? 'bg-[#B20118] text-white' : 'hover:bg-[#B20118]/20 hover:text-[#B20118]'}
                ${!isSameMonth(day, currentMonth) ? 'text-gray-600' : 'text-white'}
                ${hasEvent ? 'relative' : ''}
                transition-colors
              `}
            >
              {format(day, 'd')}
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
  const category = EVENT_CATEGORIES[event.category];
  const Icon = category.icon;
  
  return (
    <div 
      className="border border-[#B20118]/20 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition-all hover:border-[#B20118]/40 hover:bg-[#B20118]/5"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <span className={`${category.bgColor} ${category.textColor} text-xs px-2 py-1 rounded-full`}>
          {category.name}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <CalendarIcon className="w-4 h-4 mr-1" />
        <span>
          {format(event.date, 'EEEE d MMMM yyyy', { locale: es })}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <Clock className="w-4 h-4 mr-1" />
        <span>{event.time}</span>
      </div>
      <div className="flex items-center text-sm text-gray-300 mb-3">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{event.location}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {event.capacity}
        </div>
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-200 rounded-full">
                {tag}
              </span>
            ))}
            {event.tags.length > 2 && (
              <span className="text-xs text-gray-400">+{event.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
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
  
  const category = EVENT_CATEGORIES[event.category];
  const Icon = category.icon;
  
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
          
          {event.mainImage && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={event.mainImage} 
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <div className="text-gray-400 mb-6">
                {Array.isArray(event.description) ? event.description.map((block, i) => (
                  <p key={i} className="mb-2">{block.children.map(child => child.text).join('')}</p>
                )) : <p>{event.description}</p>}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Detalles del evento</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${category.bgColor}`}>
                      <Icon className={`w-5 h-5 ${category.textColor}`} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Categoría</p>
                    <p className="text-sm">{category.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800">
                      <CalendarIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Fecha y hora</p>
                    <p className="text-sm">
                      {format(event.date, 'EEEE d MMMM yyyy', { locale: es })}
                      <br />
                      {event.time}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Ubicación</p>
                    <p className="text-sm">{event.location}</p>
                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Etiquetas</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {event.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Capacidad section only if event.capacity is present */}
                {event.capacity && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Capacidad</p>
                      <p className="text-sm">{event.capacity}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:border-l md:pl-6">
              <div className="bg-[#0a0a0a] border border-[#B20118]/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Resumen</h3>
                <div className="text-green-500 font-medium mb-4">
                  {event.capacity}
                </div>
                
                <button
                  className="w-full bg-[#B20118] text-white py-2 px-4 rounded-md hover:bg-[#8B0112] transition-colors"
                >
                  Más información
                </button>
                
                <p className="text-sm text-gray-400 mt-4 text-center">
                  Para más detalles o reservas, contáctanos directamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// EventFilters component
const EventFilters = ({
  activeFilters,
  onFilterChange,
  viewMode,
  onViewModeChange,
}: {
  activeFilters: EventCategory[];
  onFilterChange: (filters: EventCategory[]) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) => {
  const toggleFilter = (category: EventCategory) => {
    if (activeFilters.includes(category)) {
      onFilterChange(activeFilters.filter(c => c !== category));
    } else {
      onFilterChange([...activeFilters, category]);
    }
  };

  return (
    <div className="bg-[#B20118]/10 rounded-lg shadow p-4 mb-6">
      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-white">Ver</h3>
        <div className="flex flex-wrap gap-2">
          {(['all', 'upcoming', 'past'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-3 py-1 text-sm rounded-full ${
                viewMode === mode
                  ? 'bg-[#B20118] text-white'
                  : 'bg-[#B20118]/20 text-white hover:bg-[#B20118]/30'
              }`}
            >
              {mode === 'all' && 'Todos'}
              {mode === 'upcoming' && 'Próximos'}
              {mode === 'past' && 'Pasados'}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2 text-white">Filtrar por categoría</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(EVENT_CATEGORIES) as [EventCategory, EventCategoryData & { icon: any }][]).map(([key, cat]) => {
            const isActive = activeFilters.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isActive
                    ? 'bg-[#B20118] text-white border border-[#B20118]'
                    : 'bg-[#B20118]/10 text-white hover:bg-[#B20118]/20 border border-[#B20118]/20'
                }`}
              >
                <cat.icon className="w-4 h-4 mr-1" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main EventsPage component
export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<EventCategory[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('upcoming');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from Strapi
  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setError('No se pudieron cargar los eventos.'))
      .finally(() => setLoading(false));
  }, []);

  // Filter events based on selected date and filters
  useEffect(() => {
    let result = viewMode === 'upcoming' 
      ? [...events.filter(event => isAfter(event.date, new Date()))] 
      : viewMode === 'past' 
        ? [...events.filter(event => isBefore(event.date, new Date()))]
        : [...events];

    // Apply category filters
    if (activeFilters.length > 0) {
      result = result.filter(event => activeFilters.includes(event.category));
    }

    // Apply date filter if a date is selected
    if (selectedDate) {
      result = result.filter(event => isSameDay(event.date, selectedDate));
    }

    setFilteredEvents(result);
  }, [events, activeFilters, viewMode, selectedDate]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const groups: Record<string, Event[]> = {};
    
    filteredEvents.forEach(event => {
      const dateKey = format(event.date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });
    
    return groups;
  }, [filteredEvents]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(prev => 
      prev && isSameDay(prev, date) ? null : date
    );
  }, []);

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleFilterChange = useCallback((filters: EventCategory[]) => {
    setActiveFilters(filters);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    // Clear selected date when changing view mode for better UX
    setSelectedDate(null);
  }, []);

  // Reset selected date when it has no events
  useEffect(() => {
    if (selectedDate && !filteredEvents.some(e => isSameDay(e.date, selectedDate))) {
      setSelectedDate(null);
    }
  }, [filteredEvents, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Cargando eventos...</h2>
          <p className="text-gray-400">Por favor, espera un momento.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error al cargar eventos</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchEvents()
                .then(setEvents)
                .catch(() => setError('No se pudieron cargar los eventos.'))
                .finally(() => setLoading(false));
            }}
            className="mt-4 px-4 py-2 bg-[#B20118] text-white rounded-md hover:bg-[#8B0112] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Eventos</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <EventFilters
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
            />
            
            <Calendar
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              events={filteredEvents}
            />
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {selectedDate && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Eventos para {format(selectedDate, 'EEEE d MMMM yyyy', { locale: es })}
                </h2>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar fecha
                </button>
              </div>
            )}
            
            {Object.keys(eventsByDate).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(eventsByDate).map(([date, events]) => (
                  <div key={date}>
                    {!selectedDate && (
                      <h3 className="text-lg font-semibold mb-4">
                        {format(new Date(date), 'EEEE d MMMM yyyy', { locale: es })}
                      </h3>
                    )}
                    <div className="space-y-4">
                      {events.map(event => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onClick={() => handleEventClick(event)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg shadow p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-[#B20118]/10 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-[#B20118]" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">
                  No hay eventos programados
                </h3>
                <p className="text-gray-400">
                  {activeFilters.length > 0 || selectedDate
                    ? 'Prueba a ajustar los filtros o selecciona otra fecha.'
                    : '¡Vuelve pronto para ver los próximos eventos!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
