export type EventCategory = 'shibari' | 'lecture' | 'cineforum'

export interface EventCategoryData {
  name: string
  icon: any // Lucide Icon component type
  color: string
  bgColor: string
  borderColor: string
  hoverColor: string
  textColor: string
}

export interface Event {
  id: number
  title: string
  category: EventCategory
  date: Date
  time: string
  location: string
  capacity: string
  description: string
  mainImage: string
  images: string[]
  tags: string[]
}

export interface EventFilters {
  categories: EventCategory[]
  viewMode: 'all' | 'upcoming' | 'past'
}
