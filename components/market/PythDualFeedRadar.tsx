'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Layers,
  Zap,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PythDualFeedData } from '@/lib/services/pyth-service';
import { cn } from '@/lib/utils';

interface PythDualFeedRadarProps {
  initialSymbol?: string;
  className?: string;
  showSelector?: boolean;
}

const SUPPORTED_DUAL_SYMBOLS = [
  'NVDAx',
  'AAPLx',
  'TSLAx',
  'MSFTx',
  'AMZNx',
  'GOOGLx',
  'METAx',
  'SPYx',
  'QQQx',
  'OPENAI.T',
  'KALSHI.T',
];

export function PythDualFeedRadar({
  initialSymbol = 'NVDAx',
  className,
  showSelector = true,
}: PythDualFeedRadarProps) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [data, setData] = useState<PythDualFeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setSymbol(initialSymbol);
  }, [initialSymbol]);

  const fetchDualFeed = async (sym: string, isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(`/api/pyth/dual-feed?symbol=${encodeURIComponent(sym)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('[PythDualFeedRadar] Fetch error:', err);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setRefreshing(false), 400);
    }
  };

  useEffect(() => {
    fetchDualFeed(symbol);
    const interval = setInterval(() => fetchDualFeed(symbol), 4000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading && !data) {
    return (
      <GlassPanel className={cn('p-5 space-y-4 animate-pulse', className)}>
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-5 w-24 bg-muted rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 bg-muted/40 rounded-xl" />
          <div className="h-28 bg-muted/40 rounded-xl" />
        </div>
      </GlassPanel>
    );
  }

  const feedData = data;
  const isParity = !feedData || Math.abs(feedData.spreadBps) <= 5;
  const isPremium = feedData && feedData.spreadBps > 5;
  const isDiscount = feedData && feedData.spreadBps < -5;

  return (
    <GlassPanel className={cn('p-5 space-y-4 border-primary/20 shadow-lg', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Pyth Network Dual-Feed &amp; Peg Radar</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                Pyth Market Data Bounty
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Institutional TradFi NAV vs. Solana On-Chain Secondary Price Arbitrage Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showSelector && (
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="rounded-lg border border-border bg-card/70 px-2.5 py-1 text-xs font-mono font-bold text-foreground outline-none focus:border-primary"
            >
              {SUPPORTED_DUAL_SYMBOLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => fetchDualFeed(symbol, true)}
            disabled={refreshing}
            className="p-1.5 rounded-lg border border-border/70 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
            title="Refresh Pyth Feeds"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin text-primary')} />
          </button>
        </div>
      </div>

      {/* Dual Feed Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Feed 1: Underlying TradFi Equity Feed */}
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Reference US Equity NAV
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Pyth TradFi Oracle</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold font-mono text-foreground tabular-nums">
                ${feedData?.equityFeed.price.toFixed(2) || '0.00'}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {feedData?.equityFeed.ticker} · Conf: ±${feedData?.equityFeed.conf.toFixed(3)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
                NYSE/NASDAQ Mark
              </span>
            </div>
          </div>
        </div>

        {/* Feed 2: Solana On-Chain Tokenized Asset Feed */}
        <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              Solana On-Chain Market
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Token-2022 AMM Pool</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold font-mono text-foreground tabular-nums">
                ${feedData?.cryptoFeed.price.toFixed(2) || '0.00'}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {feedData?.cryptoFeed.ticker} · Conf: ±${feedData?.cryptoFeed.conf.toFixed(3)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                Solana DEX Secondary
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Basis Points Spread & Peg Parity Meter */}
      <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Basis Points Parity Spread:</span>
            <span
              className={cn(
                'text-sm font-mono font-bold px-2 py-0.5 rounded-md border',
                isParity
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isPremium
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              )}
            >
              {feedData && feedData.spreadBps > 0 ? '+' : ''}
              {feedData?.spreadBps || 0} bps (${feedData?.spreadUsd.toFixed(3)} USD)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {isParity ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Strict Parity (<span className="font-mono">≤ 5 bps</span>)
              </span>
            ) : isPremium ? (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> On-Chain Premium
              </span>
            ) : (
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <TrendingDown className="h-3.5 w-3.5" /> On-Chain Discount
              </span>
            )}
          </div>
        </div>

        {/* Visual Spread Bar */}
        <div className="space-y-1">
          <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden relative">
            {/* Center zero line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/40 z-10" />
            {/* Spread fill */}
            <div
              className={cn(
                'h-full transition-all duration-500',
                isParity ? 'bg-emerald-400' : isPremium ? 'bg-amber-400' : 'bg-cyan-400'
              )}
              style={{
                width: `${Math.min(50, Math.abs(feedData?.spreadBps || 0) * 1.5)}%`,
                marginLeft:
                  feedData && feedData.spreadBps >= 0
                    ? '50%'
                    : `${Math.max(0, 50 - Math.min(50, Math.abs(feedData?.spreadBps || 0) * 1.5))}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground px-0.5">
            <span>-30 bps (Discount)</span>
            <span>0 bps (Parity)</span>
            <span>+30 bps (Premium)</span>
          </div>
        </div>

        {/* Interpretation & Arbitrage Context */}
        <div className="pt-1 flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="text-foreground font-medium">{feedData?.parityText}</span>{' '}
            MITIGATOR uses this sub-second Pyth spread to dynamically adjust routing between Backpack RFQ (atomic NAV)
            and Raydium/Meteora DLMM pools to protect traders against de-peg MEV extraction.
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
