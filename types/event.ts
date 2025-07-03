export type EventCategory = 'shibari' | 'lecture' | 'cineforum'

export interface EventCategoryData {
  id: number
  name: string
  slug: string
  icon: string
  bgColor?: string
  textColor?: string
}

export interface Event {
  id: number
  title: string
  category: EventCategoryData | null
  date: Date
  time: string
  location: string
  capacity: string
  description: string
  mainImage: string | null
  images: string[]
  tags: string[]
  link?: string | null
  occurrenceId?: string // Unique ID for each event occurrence (for recurrent events)
}

export interface EventFilters {
  categories: string[] // store category slugs
  viewMode: 'all' | 'upcoming' | 'past'
}
