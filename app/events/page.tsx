"use client";

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
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useState, useEffect, useMemo } from "react";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  RotateCcw,
} from "lucide-react";

// ...existing code...

const fetchEvents = async () => {
  try {
    const res = await fetch("https://nyx-club-back.onrender.com/api/events?populate=*");
    if (!res.ok) throw new Error("Failed to fetch events");
    const { data } = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      title: item.title || "",
      description: item.description || [],
      date: item.date ? new Date(item.date) : null,
      time: item.time || "",
      location: "NYX BDSM Club - Calle Amaniel 13",
      mainImage: item.mainImage?.url || null,
      images: item.images?.map((img: any) => img.url) || [],
      tags: item.tags || [],
      link: item.link || null,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// Helper: get Madrid time at midnight (for day-based logic)
const MADRID_TZ = "Europe/Madrid";
function getMadridMidnight(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const madridDate = toZonedTime(d, MADRID_TZ);
  madridDate.setHours(0, 0, 0, 0);
  return madridDate;
}

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  // Only show events for the selected date, or all upcoming events if no date is selected
  const nowMadrid = toZonedTime(new Date(), MADRID_TZ);
  const filteredEvents = useMemo(() => {
    if (selectedDate) {
      // Show events for the selected date only (Madrid time)
      return events
        .filter((event: any) => event.date && isSameDay(getMadridMidnight(event.date), getMadridMidnight(selectedDate)))
        .sort((a: any, b: any) => a.date - b.date);
    }
    // Show all upcoming events (Madrid time)
    return events
      .filter((event: any) => event.date && getMadridMidnight(event.date) >= getMadridMidnight(nowMadrid))
      .sort((a: any, b: any) => a.date - b.date);
  }, [events, selectedDate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Eventos</h1>
      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white/80">Calendario</span>
            <button
              onClick={() => setSelectedDate(null)}
              className={`p-2 rounded-full hover:bg-[#B20118]/10 transition-colors ${selectedDate ? '' : 'opacity-60'}`}
              aria-label="Resetear selección de fecha"
              title="Resetear selección de fecha"
              disabled={!selectedDate}
            >
              <RotateCcw className="w-5 h-5 text-[#B20118]" />
            </button>
          </div>
          <Calendar
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            events={events}
          />
        </div>
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay eventos para esta fecha.
            </p>
          )}
        </div>
      </div>
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
  events: any[];
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
    // Compare using Madrid midnight
    return events.some((event) => event.date && getMadridMidnight(event.date).getTime() === getMadridMidnight(date).getTime());
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
const EventCard = ({ event }: { event: any }) => {
  return (
    <div className="border border-[#B20118]/20 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <CalendarIcon className="w-4 h-4 mr-1" />
  <span>{event.date ? format(toZonedTime(event.date, MADRID_TZ), "EEEE d MMMM yyyy", { locale: es }) : ""}</span>
      </div>
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <Clock className="w-4 h-4 mr-1" />
        <span>{event.time}</span>
      </div>
      <div className="flex items-center text-sm text-gray-400 mb-3">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{event.location}</span>
      </div>
      {event.mainImage && (
        <img src={event.mainImage} alt={event.title} className="w-full max-h-64 object-cover rounded mb-2" />
      )}
      {event.link && (
        <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-[#B20118] underline">Ver más</a>
      )}
    </div>
  );
};

// ...existing code...
