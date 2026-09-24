'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  avifSrc?: string;
  placeholderSrc?: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export function ProgressiveImage({
  src,
  avifSrc,
  placeholderSrc,
  alt,
  className = '',
  aspectRatio,
  ...props
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Auto-detect AVIF equivalent if not explicitly provided
  const resolvedAvifSrc = avifSrc || (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png')
    ? src.replace(/\.(jpg|jpeg|png)$/, '.avif')
    : undefined);

  // Auto-detect placeholder if not provided
  const resolvedPlaceholder = placeholderSrc || (src.includes('-preview')
    ? src.replace(/\.(jpg|jpeg)$/, '-placeholder.jpg')
    : undefined);

  return (
    <div
      className={cn('relative overflow-hidden bg-card/40', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blurred Low-Res Placeholder or Skeleton Pulse */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-card/60">
          {resolvedPlaceholder ? (
            <img
              src={resolvedPlaceholder}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover scale-110 blur-xl opacity-70 transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-card/30 via-secondary/40 to-card/30 animate-pulse" />
          )}
        </div>
      )}

      {/* Picture element with AVIF modern format and lazy loading */}
      <picture>
        {resolvedAvifSrc && (
          <source type="image/avif" srcSet={resolvedAvifSrc} />
        )}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={cn(
            'w-full h-full object-cover transition-all duration-700 relative z-10',
            isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm',
            hasError && 'opacity-60'
          )}
          {...props}
        />
      </picture>
    </div>
  );
}
