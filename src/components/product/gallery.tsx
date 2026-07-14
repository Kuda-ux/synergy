"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";

interface GalleryImage {
  url: string;
  alt: string;
}

export function ProductGallery({ images, videoUrl }: { images: GalleryImage[]; videoUrl?: string | null }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = images[index] ?? images[0];
  const isPlaceholder = !current || current.url.startsWith("placeholder:");

  return (
    <div>
      <button
        type="button"
        onClick={() => !isPlaceholder && setZoomed((z) => !z)}
        aria-label={zoomed ? "Zoom out of product image" : "Zoom into product image"}
        className={cn(
          "block w-full overflow-hidden rounded-card border border-border",
          !isPlaceholder && "cursor-zoom-in",
          zoomed && "cursor-zoom-out",
        )}
      >
        <ProductImage
          url={current?.url ?? null}
          alt={current?.alt ?? "Product image"}
          className={cn("aspect-square w-full transition-transform duration-300", zoomed && "scale-150")}
          iconSize={110}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </button>
      {(images.length > 1 || videoUrl) && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
          {images.map((image, i) => (
            <button
              key={image.url + i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`View image ${i + 1}`}
              onClick={() => {
                setIndex(i);
                setZoomed(false);
              }}
              className={cn(
                "w-18 shrink-0 overflow-hidden rounded-lg border-2",
                i === index ? "border-primary" : "border-border hover:border-border-strong",
              )}
            >
              <ProductImage url={image.url} alt="" className="aspect-square w-full" iconSize={24} />
            </button>
          ))}
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-18 shrink-0 items-center justify-center rounded-lg border-2 border-border text-xs font-medium text-muted hover:border-border-strong"
            >
              Video
            </a>
          )}
        </div>
      )}
    </div>
  );
}
