"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { X, Calendar as CalendarIcon, Clock, MapPin, Repeat, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { MADRID_TZ } from "@/app/events/page"; // reuse constant (export it)
import Image from "next/image";
import { AnyEvent } from "@/types/event";

interface Props {
  event: AnyEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Render rich description blocks coming from API (very simple mapping)
function DescriptionRenderer({ blocks }: { blocks: any[] }) {
  if (!Array.isArray(blocks)) return null;
  return (
    <div className="space-y-3 leading-relaxed text-gray-300 text-sm">
      {blocks.map((block: any, idx: number) => {
        if (block.type === 'paragraph') {
          const text = (block.children || []).map((c: any) => c.text).join('');
            if (!text.trim()) return null;
          return <p key={idx}>{text}</p>;
        }
        if (block.type === 'list') {
          const items = (block.children || []).filter((c: any) => c.type === 'list-item');
          return (
            <ul key={idx} className="list-disc list-inside space-y-1">
              {items.map((li: any, liIdx: number) => (
                <li key={liIdx}>{(li.children || []).map((c: any) => c.text).join('')}</li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function EventDetailsModal({ event, open, onOpenChange }: Props) {
  if (!event) return null;
  const zoned = event.date ? toZonedTime(event.date, MADRID_TZ) : null;
  const dateStr = zoned ? format(zoned, "EEEE d 'de' MMMM yyyy", { locale: es }) : '';
  const recurrenceInfo = event.recurrenceType === 'weekly' && event.recurrenceEndDate ?
    `Evento semanal hasta ${format(new Date(event.recurrenceEndDate), "d MMM yyyy", { locale: es })}` : null;
  const tags: string[] = Array.isArray(event.tags) ? event.tags : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] bg-neutral-950/95 border border-[#B20118]/30 backdrop-blur-xl p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-white/5 relative">
          <DialogTitle className="pr-12 text-2xl font-semibold leading-snug tracking-tight text-white">{event.title}</DialogTitle>
          <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {event.mainImage && (
            <div className="relative w-full aspect-video overflow-hidden rounded-lg ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.mainImage} alt={event.title} className="object-cover w-full h-full brightness-105" />
            </div>
          )}
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-4 md:col-span-1 lg:col-span-2">
              <div className="flex items-start gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-[#ff445c] mt-0.5" />
                <div>
                  <p className="font-medium text-white/90">{dateStr}</p>
                  {event.time && <p className="text-gray-400">{event.time}</p>}
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[#ff445c] mt-0.5" />
                <p className="text-gray-300">{event.location}</p>
              </div>
              {recurrenceInfo && (
                <div className="flex items-start gap-2 text-sm">
                  <Repeat className="w-4 h-4 text-[#ff445c] mt-0.5" />
                  <p className="text-gray-300">{recurrenceInfo}</p>
                </div>
              )}
              {tags.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Tag className="w-4 h-4 text-[#ff445c] mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-xs rounded bg-[#ff445c]/15 text-[#ff445c] border border-[#ff445c]/30 backdrop-blur-sm">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center mt-2 text-xs font-semibold tracking-wide px-3 py-1.5 rounded-md bg-[#ff445c] text-white hover:bg-[#ff445c]/90 transition shadow-sm"
                >
                  Ver más en Fetlife
                </a>
              )}
            </div>
            <div className="text-sm leading-relaxed space-y-4 md:col-span-1 lg:col-span-3">
              <h4 className="font-semibold mb-1 uppercase tracking-wide text-[11px] text-[#ff445c]">Descripción</h4>
              <DescriptionRenderer blocks={event.description} />
            </div>
          </div>
          {event.images && event.images.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wide text-[#ff445c]">Galería</h4>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {event.images.map((src, i) => (
                  <div key={i} className="relative w-full rounded-lg ring-1 ring-white/10 bg-black/40 p-2 flex items-center justify-center group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${event.title} ${i + 1}`}
                      className="max-h-60 w-auto object-contain transition duration-300 group-hover:scale-[1.02] drop-shadow-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-white/5 bg-neutral-950/60 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-300 hover:text-white hover:bg-white/10">Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
