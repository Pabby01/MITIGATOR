'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Sparkles, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/shared/BrandLogo';

const TYPEWRITER_WORDS = [
  'context.',
  'information.',
  'intelligence.',
  'precision.',
  'provenance.',
  'confidence.',
  'zero blindspots.',
];

export function InteractiveCtaSection() {
  // Cursor Interactive Coordinates
  const containerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 400, y: 250 });
  const [isHovered, setIsHovered] = useState(false);

  // Typewriter Engine
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const currentWord = TYPEWRITER_WORDS[wordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        // Typing characters
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, 85);
      } else {
        // Finished typing word, hold
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (text.length > 0) {
        // Deleting characters
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1));
        }, 45);
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative py-32 md:py-44 px-6 overflow-hidden border-t border-border/30"
    >
      {/* Dynamic Cursor Reactive Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0.6,
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(63, 185, 138, 0.18), rgba(76, 201, 240, 0.10) 35%, transparent 75%)`,
        }}
      />

      {/* Grid Pattern Behind Spotlight */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      {/* Center ambient glow fallback */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
        <BrandLogo size={60} glow className="mx-auto" />

        {/* Dynamic Typewriter Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
          <span>Trade with</span>
          <span className="text-gradient-primary inline-flex items-center min-w-[200px] sm:min-w-[320px] text-left">
            {text}
            <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse shadow-sm shadow-primary" />
          </span>
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Not another trading clone. A serious intelligence and execution layer for the tokenized economy on Solana.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/60 border border-border/70 text-xs font-mono text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Zero-Frontrunning Jito Bundles
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/60 border border-border/70 text-xs font-mono text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Pyth Hermes 384ms Oracles
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-xl shadow-primary/25"
          >
            Explore Markets
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/intelligence"
            className="inline-flex items-center justify-center gap-2 rounded-xl hairline-card px-8 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-all hover:scale-[1.02]"
          >
            <Brain className="h-4 w-4 text-primary" />
            Ask AI Copilot
          </Link>
        </div>
      </div>
    </section>
  );
}
