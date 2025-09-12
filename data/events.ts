import { Event, EventCategory, EventCategoryData } from "@/types/event"
import { BookOpen, Film, Ribbon } from "lucide-react"

export const eventCategories: Record<EventCategory, EventCategoryData> = {
  shibari: {
    name: "Shibari: Ata2",
    icon: Ribbon,
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
    name: "Cinefórum: La Butaca Roja",
    icon: Film,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-600/50",
    hoverColor: "hover:bg-blue-900/30",
    textColor: "text-blue-400",
  },
}

// Generate upcoming events (next 30 days)
const generateUpcomingEvents = (): Event[] => {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  return [
    {
      id: 1,
      title: 'Taller de Shibari Avanzado',
      description: 'Aprende técnicas avanzadas de Shibari con nuestros expertos.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString(),
      time: '18:00 - 20:00',
      location: 'Sala Principal',
      category: 'shibari',
      capacity: '20 asistentes',
      mainImage: '/images/events/shibari-advanced.jpg',
      images: [
        '/images/events/shibari-1.jpg',
        '/images/events/shibari-2.jpg',
        '/images/events/shibari-3.jpg'
      ],
      tags: ['Taller', 'Avanzado', 'Práctico']
    },
    {
      id: 2,
      title: 'Conferencia: Arte y Cultura Japonesa',
      description: 'Explora la rica tradición cultural japonesa a través de sus expresiones artísticas.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      time: '17:00 - 19:00',
      location: 'Auditorio',
      category: 'lecture',
      capacity: '50 asistentes',
      mainImage: '/images/events/lecture.jpg',
      images: ['/images/events/lecture-1.jpg'],
      tags: ['Cultura', 'Arte', 'Conferencia']
    },
    {
      id: 3,
      title: 'Cinefórum: Cine Asiático Contemporáneo',
      description: 'Proyección y análisis de películas destacadas del cine asiático actual.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
      time: '19:00 - 21:00',
      location: 'Sala de Proyecciones',
      category: 'cineforum',
      capacity: '30 asistentes',
      mainImage: '/images/events/cineforum.jpg',
      images: [
        '/images/events/cineforum-1.jpg',
        '/images/events/cineforum-2.jpg'
      ],
      tags: ['Cine', 'Análisis', 'Cultural']
    },
    {
      id: 4,
      title: 'Taller de Shibari para Principiantes',
      description: 'Introducción al arte del Shibari. Aprende los nudos y técnicas básicas de forma segura.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
      time: '16:00 - 18:00',
      location: 'Sala de Talleres',
      category: 'shibari',
      capacity: '15 asistentes',
      mainImage: '/images/events/shibari-beginner.jpg',
      images: [
        '/images/events/shibari-beginner-1.jpg',
        '/images/events/shibari-beginner-2.jpg'
      ],
      tags: ['Taller', 'Principiantes', 'Práctico']
    },
    {
      id: 5,
      title: 'Ciclo de Cine Japonés',
      description: 'Proyección de clásicos del cine japonés con introducción y coloquio posterior.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
      time: '18:30 - 20:30',
      location: 'Sala de Proyecciones',
      category: 'cineforum',
      capacity: '40 asistentes',
      mainImage: '/images/events/japanese-cinema.jpg',
      images: [],
      tags: ['Cine', 'Japón', 'Clásicos']
    }
  ];
};

// Generate past events (last 30 days)
const generatePastEvents = (): Event[] => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  return [
    {
      id: 6,
      title: 'Introducción al Shibari',
      description: 'Primeros pasos en el arte del Shibari. Técnicas básicas y consideraciones de seguridad.',
      date: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 5),
      time: '16:00 - 18:00',
      location: 'Sala de Talleres',
      category: 'shibari',
      capacity: '25 asistentes',
      mainImage: '/images/events/shibari-intro.jpg',
      images: [],
      tags: ['Taller', 'Introducción', 'Práctico']
    },
    {
      id: 7,
      title: 'Conferencia: Historia del Cine Japonés',
      description: 'Un recorrido por la evolución del cine japonés y su influencia global.',
      date: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - 12),
      time: '18:00 - 20:00',
      location: 'Auditorio',
      category: 'lecture',
      capacity: '60 asistentes',
      mainImage: '/images/events/cinema-history.jpg',
      images: [],
      tags: ['Cine', 'Historia', 'Japón']
    }
  ];
};

export const events: Event[] = [
  ...generateUpcomingEvents(),
  ...generatePastEvents()
];

// Get events by category
function getEventsByCategory(category: EventCategory): Event[] {
  return events.filter(event => event.category === category);
}

// Get featured events (first 2 upcoming events as featured)
function getFeaturedEvents(): Event[] {
  return getUpcomingEvents().slice(0, 2);
}

// Get upcoming events (today and future)
function getUpcomingEvents(): Event[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return events.filter(event => new Date(event.date) >= today);
}

// Get past events (before today)
function getPastEvents(): Event[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return events.filter(event => new Date(event.date) < today);
}

// Get event by ID
function getEventById(id: number): Event | undefined {
  return events.find(event => event.id === id);
}

export {
  getEventsByCategory,
  getFeaturedEvents,
  getUpcomingEvents,
  getPastEvents,
  getEventById
};
