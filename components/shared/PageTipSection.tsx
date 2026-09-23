'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, Sparkles, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TipItem {
  title: string;
  description: string;
  badge?: string;
}

export interface PageTipSectionProps {
  pageTitle: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  tips: TipItem[];
  hackathonDefense?: string;
  storageKey?: string;
}

export function PageTipSection({
  pageTitle,
  subtitle = 'How this feature works & technical defense',
  badge = 'Feature Playbook',
  defaultOpen = false,
  tips,
  hackathonDefense,
  storageKey,
}: PageTipSectionProps) {
  const key = storageKey ? `mitigator_tip_open_${storageKey}` : `mitigator_tip_open_${pageTitle.toLowerCase().replace(/\s+/g, '_')}`;

  // Initialize with defaultOpen so server HTML and initial client hydration match 100%
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Sync with user's saved preference in localStorage after hydration completes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        setIsOpen(saved === 'true');
      }
    } catch {
      // Gracefully ignore storage errors in restricted contexts
    }
  }, [key]);

  const toggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(key, String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card/50 to-primary/5 backdrop-blur-md overflow-hidden transition-all shadow-sm">
      {/* Header Bar: Click to Toggle */}
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between p-3.5 md:p-4 text-left hover:bg-primary/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0 text-primary group-hover:scale-105 transition-transform">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                How {pageTitle} Works
              </h3>
              {badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 border border-primary/30 text-primary">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary hidden sm:inline" suppressHydrationWarning>
            {isOpen ? 'Collapse Guide' : 'Expand Guide'}
          </span>
          <div className={cn('p-1 rounded-lg border border-border/80 bg-card/60 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="tip-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-5 pt-0 border-t border-primary/10 space-y-4">
              {/* Tip Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
                {tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-1.5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {tip.title}
                      </h4>
                      {tip.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-muted text-muted-foreground border border-border">
                          {tip.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Hackathon Defense / Technical Backing */}
              {hackathonDefense && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-xs text-muted-foreground leading-relaxed">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-400">Technical Defense & Hackathon Rationale: </span>
                    <span>{hackathonDefense}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
