import { cn } from '@/lib/utils';

export function GlassPanel({
  children,
  className,
  hover = false,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        'glass-panel rounded-xl',
        hover && 'glass-panel-hover',
        glow && 'glow-primary',
        className
      )}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  change,
  changePct,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  change?: string;
  changePct?: number;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <GlassPanel hover className={cn('p-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
          {change && (
            <p className={cn(
              'mt-1 text-xs font-medium tabular-nums',
              changePct !== undefined && changePct >= 0 ? 'text-emerald-400' : 'text-red-400'
            )}>
              {changePct !== undefined && changePct >= 0 ? '+' : ''}{change}
              {changePct !== undefined && ` (${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%)`}
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
    </GlassPanel>
  );
}

export function PriceChange({ change, pct, className }: { change: number; pct: number; className?: string }) {
  const positive = pct >= 0;
  return (
    <span className={cn('tabular-nums font-medium', positive ? 'text-emerald-400' : 'text-red-400', className)}>
      {positive ? '+' : ''}{change.toFixed(2)} ({positive ? '+' : ''}{pct.toFixed(2)}%)
    </span>
  );
}
