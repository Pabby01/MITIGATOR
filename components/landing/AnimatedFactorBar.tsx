'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type AnimatedFactorBarProps = {
  label: string;
  weight: string;
  score: number;
  index: number;
};

export function AnimatedFactorBar({
  label,
  weight,
  score,
  index,
}: AnimatedFactorBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setCurrentNumber(0);
      return;
    }

    const delay = index * 70; // stagger start
    const duration = 1200; // ms
    let startTime: number | null = null;
    let animId: number;

    const timeout = setTimeout(() => {
      const step = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(ease * score);
        setCurrentNumber(val);

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isInView, score, index]);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-muted-foreground text-[11px]">{weight}</span>
          <span className="font-bold text-emerald-400 tabular-nums">
            {currentNumber}/100
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-border/60 dark:bg-white/5 overflow-hidden p-[1px]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-sm"
          initial={{ width: '0%' }}
          animate={{ width: isInView ? `${score}%` : '0%' }}
          transition={{
            duration: 1.2,
            delay: index * 0.07,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  );
}
