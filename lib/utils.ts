import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Expand recurring events (currently only 'weekly') into concrete occurrences up to recurrenceEndDate (inclusive)
import { addWeeks, isAfter, isBefore, isEqual } from 'date-fns'
import { AnyEvent, RawEvent, EventOccurrence } from '@/types/event'

interface ExpandRecurrenceOptions {
  // safety cap to avoid infinite loops if data is malformed
  maxOccurrences?: number
}

export function expandRecurringEvents(events: RawEvent[], options: ExpandRecurrenceOptions = {}): AnyEvent[] {
  const { maxOccurrences = 260 } = options // ~5 years of weekly events
  const expanded: AnyEvent[] = []

  events.forEach(evt => {
    if (!evt.date) return; // skip invalid
    const baseDate = evt.date
    const recurrenceType = evt.recurrenceType || 'none'
    const recurrenceEndISO = evt.recurrenceEndDate

    // Always push the original (mark as such)
    expanded.push({
      ...evt,
      occurrenceDate: baseDate,
      date: baseDate,
      originalEventId: evt.id,
      isOriginal: true,
    } as EventOccurrence)

    if (recurrenceType !== 'weekly') return;
    if (!recurrenceEndISO) return; // no end date -> treat as single occurrence for now
    const endDate = new Date(recurrenceEndISO)
    if (isBefore(endDate, baseDate)) return; // malformed

    let cursor = addWeeks(baseDate, 1)
    let counter = 1
    while ((isBefore(cursor, endDate) || isEqual(cursor, endDate)) && counter < maxOccurrences) {
      expanded.push({
        ...evt,
        occurrenceDate: cursor,
        date: cursor, // maintain existing code expectations
        originalEventId: evt.id,
        isOriginal: false,
      } as EventOccurrence)
      cursor = addWeeks(cursor, 1)
      counter++
    }
  })

  return expanded.sort((a, b) => {
    const da = a.date ? new Date(a.date as any).getTime() : 0
    const db = b.date ? new Date(b.date as any).getTime() : 0
    return da - db
  })
}

