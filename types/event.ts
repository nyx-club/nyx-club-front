// Event & recurrence related types used across the app.
// These mirror the API fields (Strapi) plus some client-only helpers for expanded occurrences.

export type RecurrenceType = 'weekly' | 'none' | null | undefined;

// Raw event shape as received from the API (after simple mapping in fetchEvents)
export interface RawEvent {
	id: number;
	title: string;
	description: any; // Rich text blocks array
	date: Date | null; // Converted to Date object in the fetch layer
	time: string;
	location?: string;
	mainImage?: string | null;
	images?: string[];
	tags?: any;
	link?: string | null;
	recurrenceType?: RecurrenceType;
	recurrenceEndDate?: string | null; // ISO string from API (can be null)
}

// Client-side expanded occurrence (for recurring events)
export interface EventOccurrence extends RawEvent {
	occurrenceDate: Date; // Concrete date for this occurrence (also duplicated in `date` for compatibility)
	originalEventId: number; // id of the original master event
	isOriginal: boolean; // true only for the first (master) instance
}

export type AnyEvent = RawEvent | EventOccurrence;

