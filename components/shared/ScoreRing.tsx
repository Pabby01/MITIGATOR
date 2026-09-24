'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type ScoreRingProps = {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
};

function getScoreColor(score: number) {
  if (score >= 85) return '#3fb98a';
  if (score >= 70) return '#4cc9f0';
  if (score >= 55) return '#f59e0b';
  return '#ef4444';
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  label = 'MITIGATOR SCORE',
  className = '',
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setDisplayScore(0);
      return;
    }

    let start = 0;
    const duration = 1400; // ms
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easeOut * score);

      setDisplayScore(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    const animId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animId);
  }, [isInView, score]);

  return (
    <div ref={containerRef} className={`relative inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: isInView ? offset : circumference }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <span
          className="font-black tabular-nums transition-all leading-none text-center"
          style={{
            color,
            fontSize:
              size < 48
                ? '13px'
                : size < 64
                ? '16px'
                : size < 90
                ? '20px'
                : size < 140
                ? '28px'
                : '38px',
          }}
        >
          {displayScore}
        </span>
        {showLabel && size >= 85 && (
          <span
            className="font-semibold tracking-wider text-muted-foreground text-center uppercase leading-tight"
            style={{ fontSize: size >= 140 ? '9px' : '8px', marginTop: size >= 140 ? '4px' : '2px' }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
