"use client";
import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryLightboxProps {
  images: string[];
  index: number; // starting index
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export default function GalleryLightbox({ images, index, onClose, onIndexChange }: GalleryLightboxProps) {
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const prev = useCallback(() => {
    if (hasPrev) onIndexChange(index - 1);
  }, [index, hasPrev, onIndexChange]);

  const next = useCallback(() => {
    if (hasNext) onIndexChange(index + 1);
  }, [index, hasNext, onIndexChange]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, onClose]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-xs text-white/60">
        <span>{index + 1} / {images.length}</span>
        <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition" aria-label="Cerrar galería">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {hasPrev && (
          <button onClick={prev} aria-label="Anterior" className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {hasNext && (
          <button onClick={next} aria-label="Siguiente" className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition">
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
        <div className="max-h-full max-w-full flex items-center justify-center p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt={`Imagen ${index + 1}`}
            className="object-contain max-h-[80vh] max-w-full select-none shadow-2xl"
            draggable={false}
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto border-t border-white/10 bg-black/60">
        <div className="flex gap-2 p-3 min-w-max">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={`relative h-16 aspect-video overflow-hidden rounded-md ring-1 ${i === index ? 'ring-[#ff445c]' : 'ring-white/10'} transition`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="thumb" className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
