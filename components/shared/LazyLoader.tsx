'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  delayMs?: number;
  renderImmediately?: boolean;
}

/**
 * LazyLoader
 * Defers rendering and bundle hydration of heavy components until the component is
 * near the viewport or idle time is available, preventing main-thread freezes on slow networks.
 */
export function LazyLoader({
  children,
  fallback,
  rootMargin = '150px',
  threshold = 0.01,
  className = '',
  delayMs = 0,
  renderImmediately = false,
}: LazyLoaderProps) {
  const [shouldRender, setShouldRender] = useState(renderImmediately);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldRender) return;

    // Use requestIdleCallback if available, or IntersectionObserver
    let timeoutId: NodeJS.Timeout;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            if (delayMs > 0) {
              timeoutId = setTimeout(() => {
                setShouldRender(true);
              }, delayMs);
            } else {
              setShouldRender(true);
            }
            observer.disconnect();
          }
        },
        { rootMargin, threshold }
      );

      observer.observe(containerRef.current);
      return () => {
        observer.disconnect();
        if (timeoutId) clearTimeout(timeoutId);
      };
    } else {
      // Fallback for environments without IntersectionObserver
      timeoutId = setTimeout(() => {
        setShouldRender(true);
      }, delayMs || 100);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldRender, rootMargin, threshold, delayMs]);

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {shouldRender ? (
        children
      ) : (
        fallback || (
          <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-card/20 rounded-2xl animate-pulse">
            <div className="h-6 w-6 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
          </div>
        )
      )}
    </div>
  );
}
