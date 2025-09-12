// Type guard para imagen Cloudinary
interface CloudinaryImage {
  url?: string;
  formats?: {
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

function isCloudinaryImage(img: unknown): img is CloudinaryImage {
  return typeof img === 'object' && img !== null && ('formats' in img || 'url' in img);
}
import { eventCategories } from "@/data/events"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
    export default function EventCard({ event, className = "" }: { event: any; className?: string }) {
  const category = event.category ? eventCategories[event.category as keyof typeof eventCategories] : undefined;

  // Imagen: si no hay, mostrar placeholder visual
  let imageUrl = '/images/default-event.jpg';
  let hasImage = false;
  if (event.mainImage) {
    if (typeof event.mainImage === 'string') {
      imageUrl = event.mainImage;
      hasImage = true;
    } else if (isCloudinaryImage(event.mainImage)) {
      const img = event.mainImage as CloudinaryImage;
      if (img.formats && img.formats.small && img.formats.small.url) {
        imageUrl = img.formats.small.url;
        hasImage = true;
      } else if (img.formats && img.formats.thumbnail && img.formats.thumbnail.url) {
        imageUrl = img.formats.thumbnail.url;
        hasImage = true;
      } else if (img.url) {
        imageUrl = img.url;
        hasImage = true;
      }
    }
  }

  return (
    <Link href={`/events/${event.id}`} className={`block ${className}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 hover:border-[#B20118]/50 transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-video">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
              <span className="text-4xl">🖼️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute top-4 right-4">
            {category ? (
              <Badge
                className={`${category.bgColor ?? ''} border text-sm font-medium`}
              >
                {category.name}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 group-hover:text-[#B20118] transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {format(typeof event.date === 'string' ? new Date(event.date) : event.date, "d 'de' MMMM yyyy", { locale: es })}
            </div>
            <p className="text-gray-300 line-clamp-3">{event.description}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {event.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
