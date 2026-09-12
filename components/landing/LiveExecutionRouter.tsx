'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDownUp, Zap, ShieldCheck } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { cn } from '@/lib/utils';

type VenueQuote = {
  id: string;
  venue: string;
  price: number;
  spread: number;
  slip: number;
  fee: number;
  type: 'Indicative' | 'Executable';
  status: string;
  priceChange?: 'up' | 'down' | null;
};

const INITIAL_VENUES: VenueQuote[] = [
  { id: 'jupiter', venue: 'Jupiter V6 Aggregator', price: 184.28, spread: 0.05, slip: 0.08, fee: 0.00, type: 'Indicative', status: 'Active' },
  { id: 'orca', venue: 'Orca Whirlpools', price: 184.25, spread: 0.04, slip: 0.06, fee: 0.20, type: 'Indicative', status: 'Active' },
  { id: 'raydium', venue: 'Raydium CPMM', price: 184.32, spread: 0.08, slip: 0.10, fee: 0.25, type: 'Indicative', status: 'Active' },
  { id: 'meteora', venue: 'Meteora DLMM', price: 184.29, spread: 0.06, slip: 0.09, fee: 0.15, type: 'Indicative', status: 'Active' },
  { id: 'xchange', venue: 'xChange RFQ', price: 184.22, spread: 0.03, slip: 0.02, fee: 0.10, type: 'Executable', status: 'Active' },
  { id: 'phoenix', venue: 'Phoenix DEX CLOB', price: 184.26, spread: 0.04, slip: 0.05, fee: 0.08, type: 'Executable', status: 'Active' },
];

function calcNetCost(v: VenueQuote): number {
  return v.price * (1 + (v.slip / 100) + (v.fee / 100));
}

export function LiveExecutionRouter() {
  const [venues, setVenues] = useState<VenueQuote[]>(() => {
    return [...INITIAL_VENUES].sort((a, b) => calcNetCost(a) - calcNetCost(b));
  });
  const [tickCount, setTickCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVenues((prev) => {
        // Pick 1 to 3 random venues to update price & slippage
        const updated: VenueQuote[] = prev.map((v): VenueQuote => {
          const shouldUpdate = Math.random() > 0.4;
          if (!shouldUpdate) return { ...v, priceChange: null };

          const priceDelta = (Math.random() - 0.48) * 0.18; // -0.09 to +0.09
          const newPrice = Math.max(183.8, Math.min(184.8, +(v.price + priceDelta).toFixed(2)));
          const slipDelta = (Math.random() - 0.5) * 0.04;
          const newSlip = Math.max(0.01, +(v.slip + slipDelta).toFixed(2));
          const spreadDelta = (Math.random() - 0.5) * 0.02;
          const newSpread = Math.max(0.02, +(v.spread + spreadDelta).toFixed(2));

          const priceChange: 'up' | 'down' | null =
            newPrice > v.price ? 'up' : newPrice < v.price ? 'down' : null;

          return {
            ...v,
            price: newPrice,
            slip: newSlip,
            spread: newSpread,
            priceChange,
          };
        });

        // Sort by net effective cost ascending so the best route floats to the top
        return [...updated].sort((a, b) => calcNetCost(a) - calcNetCost(b));
      });

      setTickCount((c) => c + 1);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const bestVenue = venues[0];

  return (
    <section className="relative py-28 px-6 border-b border-border/30">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold tracking-widest text-primary uppercase">
              Execution Architecture
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE ARB ROUTING
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Route every trade to the optimal venue.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Compare live indicative and executable quotes across Solana AMMs, CLOBs, and RFQ providers. As liquidity shifts, MITIGATOR dynamically promotes the lowest net-cost venue to the top of the route.
          </p>
        </div>

        <GlassPanel className="overflow-hidden hairline-card rounded-3xl p-1 sm:p-2">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-border/50 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">OPTIMAL CURRENT ROUTE:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <Zap className="h-3 w-3 text-emerald-400" />
                {bestVenue.venue} (${calcNetCost(bestVenue).toFixed(2)} Net)
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
              <span className="flex items-center gap-1">
                <ArrowDownUp className="h-3 w-3 text-primary" /> Auto-sorted by lowest slippage + fee
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">Ticks: #{tickCount}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 text-xs font-mono text-muted-foreground uppercase tracking-wider bg-card/40">
                  <th className="text-left font-medium px-5 py-4">Venue</th>
                  <th className="text-right font-medium px-4 py-4">Quoted Price</th>
                  <th className="text-right font-medium px-4 py-4">Spread</th>
                  <th className="text-right font-medium px-4 py-4">Est. Slippage</th>
                  <th className="text-right font-medium px-4 py-4">Fee</th>
                  <th className="text-right font-medium px-4 py-4">Effective Net</th>
                  <th className="text-center font-medium px-4 py-4">Quote Type</th>
                  <th className="text-right font-medium px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {venues.map((row, idx) => {
                  const isBest = idx === 0;
                  const net = calcNetCost(row);

                  return (
                    <motion.tr
                      key={row.id}
                      layout
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 28,
                      }}
                      className={cn(
                        'border-b border-border/40 transition-colors',
                        isBest ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-card/50'
                      )}
                    >
                      <td className="px-5 py-3.5 font-medium">
                        <div className="flex items-center gap-2">
                          <span className={cn('font-semibold', isBest ? 'text-foreground font-bold' : '')}>
                            {row.venue}
                          </span>
                          {isBest && (
                            <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                              BEST ROUTE
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quoted Price */}
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                        <span
                          className={cn(
                            'transition-colors px-1 py-0.5 rounded',
                            row.priceChange === 'up'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : row.priceChange === 'down'
                              ? 'text-red-400 bg-red-500/10'
                              : 'text-foreground'
                          )}
                        >
                          ${row.price.toFixed(2)}
                        </span>
                      </td>

                      {/* Spread */}
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums text-muted-foreground">
                        {row.spread.toFixed(2)}%
                      </td>

                      {/* Slippage */}
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                        <span className={cn(row.slip <= 0.05 ? 'text-emerald-400 font-semibold' : 'text-muted-foreground')}>
                          {row.slip.toFixed(2)}%
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums text-muted-foreground">
                        {row.fee.toFixed(2)}%
                      </td>

                      {/* Effective Net */}
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums font-bold">
                        <span className={isBest ? 'text-emerald-400' : 'text-foreground'}>
                          ${net.toFixed(2)}
                        </span>
                      </td>

                      {/* Quote Type */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={cn(
                            'text-[10px] font-mono font-medium px-2 py-0.5 rounded',
                            row.type === 'Executable'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          )}
                        >
                          {row.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-right font-mono text-xs text-emerald-400">
                        Active
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
