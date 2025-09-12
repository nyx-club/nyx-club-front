export type EventCategory = 'shibari' | 'lecture' | 'cineforum'

import { LucideIcon } from 'lucide-react'

export type RecurrenceType = 'none' | 'weekly' | 'monthly';

export interface EventCategoryData {
  id?: number;
  name: string;
  slug: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

export interface BaseEvent {
  id: number;
  title: string;
  category: EventCategoryData | null;
  date: Date | string;
  time: string;
  location: string;
  capacity: string | null;
  description: string;
  mainImage: string | null;
  images?: string[];
  tags?: string[];
  link?: string | null;
  slug?: string;
}

export interface NonRecurrentEvent extends BaseEvent {
  recurrenceType?: 'none';
  recurrenceEndDate?: never;
  isRecurrent?: false;
}

export interface RecurrentEvent extends BaseEvent {
  recurrenceType: 'weekly' | 'monthly';
  recurrenceEndDate: string | null;
  isRecurrent: true;
}

export interface EventOccurrence extends BaseEvent {
  occurrenceId: string;
  isRecurrent?: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceEndDate?: string | null;
}

export type Event = NonRecurrentEvent | RecurrentEvent | EventOccurrence;

export interface EventFilters {
  categories: string[] // store category slugs
  viewMode: 'all' | 'upcoming' | 'past'
}
