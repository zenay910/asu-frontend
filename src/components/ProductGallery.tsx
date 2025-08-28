'use client';
import React, { useState, useCallback, KeyboardEvent } from 'react';

export interface GalleryImage {
  path: string;
  url: string;      // full sized image
  thumb: string;    // thumbnail sized image
}

interface ProductGalleryProps {
  images: GalleryImage[];
  alt: string;
  className?: string;
}

/*
  Simple product gallery:
  - Shows main selected image (first by default)
  - Clicking / focusing + Enter on a thumbnail promotes it to main
  - Highlights active thumbnail
*/
export default function ProductGallery({ images, alt, className }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={className}>
        <div className="aspect-[4/3] w-full bg-silver rounded-xs flex items-center justify-center text-charcoal">No Image</div>
      </div>
    );
  }

  const select = useCallback((i: number) => setIndex(i), []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(i);
    }
    if (e.key === 'ArrowRight') select(Math.min(images.length - 1, i + 1));
    if (e.key === 'ArrowLeft') select(Math.max(0, i - 1));
  };

  const main = images[index];

  return (
    <div className={className}>
      <div className="aspect-[4/3] w-full bg-white rounded-xs shadow-sm overflow-hidden flex items-center justify-center mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={main.path}
          src={main.url}
          alt={alt}
          className="w-full h-full object-cover transition-opacity"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((g, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <button
              key={g.path}
              type="button"
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              className={`relative group rounded-xs overflow-hidden border aspect-square focus:outline-none focus:ring-2 focus:ring-charcoal ${
                i === index ? 'border-charcoal ring-1 ring-charcoal' : 'border-silver'
              }`}
            >
              <img src={g.thumb} alt="thumbnail" className="w-full h-full object-cover" />
              {i === index && <span className="absolute inset-0 ring-2 ring-inset ring-charcoal pointer-events-none" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
