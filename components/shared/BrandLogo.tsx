import React from 'react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: number | string;
  className?: string;
  glow?: boolean;
  withText?: boolean;
  textSize?: string;
}

export function BrandLogo({
  size = 28,
  className = '',
  glow = false,
  withText = false,
  textSize = 'text-lg',
}: BrandLogoProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-lg transition-transform hover:scale-105',
          glow && 'drop-shadow-[0_0_12px_rgba(63,185,138,0.45)]'
        )}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Shield Shell */}
          <path
            d="M50 8L74 20C74 48 64 74 50 92C36 74 26 48 26 20L50 8Z"
            fill="currentColor"
            className="text-foreground"
          />

          {/* Internal Geometric Facet Shield */}
          <path
            d="M50 14L69 24.5V56L50 84L31 56V24.5L50 14Z"
            fill="currentColor"
            className="text-background"
          />

          {/* Precision Emblem "M" */}
          <path
            d="M33 26.5H41V64L50 44L59 64V26.5H67V72L50 83L33 72V26.5Z"
            fill="currentColor"
            className="text-foreground"
          />
          {/* Inner V accent notch */}
          <path
            d="M44.5 48L50 36L55.5 48L50 59L44.5 48Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>

      {withText && (
        <span className={cn('font-bold tracking-tight font-sans text-foreground', textSize)}>
          MITIGATOR
        </span>
      )}
    </div>
  );
}
