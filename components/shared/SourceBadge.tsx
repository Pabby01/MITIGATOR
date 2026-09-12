import { cn } from '@/lib/utils';
import type { SourceTier } from '@/types';

const tierStyles: Record<string, { bg: string; text: string; label: string }> = {
  CANONICAL: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Canonical' },
  PRIMARY: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', label: 'Primary Source' },
  VERIFIED: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Verified' },
  SECONDARY: { bg: 'bg-violet-500/10', text: 'text-violet-400', label: 'Secondary' },
  SOCIAL: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Social Signal' },
  UNCONFIRMED: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', label: 'Unconfirmed' },
  CONFLICTING: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Conflicting' },
  EXECUTABLE: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Executable DEX' },
  ONCHAIN: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'On-Chain' },
};

const DEFAULT_TIER_STYLE = { bg: 'bg-zinc-500/10', text: 'text-zinc-400', label: 'Verified' };

export function SourceBadge({ tier, className }: { tier?: SourceTier | string; className?: string }) {
  const normalizedKey = (tier || '').toString().toUpperCase();
  const style = tierStyles[normalizedKey] || DEFAULT_TIER_STYLE;
  const label = tierStyles[normalizedKey]?.label || (tier ? String(tier) : 'Verified');

  return (
    <span className={cn('inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide', style.bg, style.text, className)}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function FreshnessBadge({ freshness }: { freshness?: 'live' | 'recent' | 'stale' | 'delayed' | string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    live: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400 animate-pulse' },
    recent: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
    stale: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    delayed: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  };
  const key = (freshness || 'live').toString().toLowerCase();
  const s = styles[key] || styles.live;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[10px] font-medium', s.bg, s.text)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {freshness || 'live'}
    </span>
  );
}

export function RiskBadge({ level }: { level?: string }) {
  const styles: Record<string, string> = {
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    moderate: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    elevated: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const key = (level || 'elevated').toString().toLowerCase();
  return (
    <span className={cn('inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', styles[key] || styles.elevated)}>
      {level || 'ELEVATED'}
    </span>
  );
}
