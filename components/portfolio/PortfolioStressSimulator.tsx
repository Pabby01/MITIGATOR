'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Zap,
  Activity,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { cn } from '@/lib/utils';

interface PositionHolding {
  symbol: string;
  quantity: number;
  currentPrice: number;
  valueUsd: number;
}

interface PortfolioStressSimulatorProps {
  cashBalance: number;
  holdings: PositionHolding[];
  totalValue: number;
}

export function PortfolioStressSimulator({
  cashBalance,
  holdings,
  totalValue,
}: PortfolioStressSimulatorProps) {
  // Shock percentage: -50% to +50%
  const [shockPct, setShockPct] = useState<number>(-15);

  const presets = [
    { label: 'Macro Tech Selloff', shock: -20, desc: 'Nasdaq & Tech heavy correction' },
    { label: 'TradFi Liquidity Crunch', shock: -12, desc: 'Rates surge & dollar liquidity squeeze' },
    { label: 'AI Supercycle Rally', shock: 25, desc: 'Semis & cloud hyperscalers beat earnings' },
    { label: 'Flash Crash & Peg Stress', shock: -35, desc: 'Extreme liquidity gap & de-peg scenario' },
  ];

  // Calculate shocked values
  const multiplier = 1 + shockPct / 100;
  const currentInvestedValue = holdings.reduce((sum, h) => sum + h.valueUsd, 0);
  const shockedInvestedValue = currentInvestedValue * multiplier;
  const shockedTotalPortfolioValue = cashBalance + shockedInvestedValue;
  const pnlDeltaUsd = shockedInvestedValue - currentInvestedValue;
  const pnlDeltaPct = totalValue > 0 ? (pnlDeltaUsd / totalValue) * 100 : 0;

  // VaR 99% estimation based on shock level
  const estimatedVaR99 = totalValue * Math.min(0.5, Math.abs(shockPct) / 100 * 1.65);
  const maxDrawdown = Math.abs(Math.min(0, pnlDeltaPct));

  return (
    <GlassPanel className="p-5 space-y-5 border border-primary/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">PRD §18 Position Shock Scenario Simulator</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                STRESS LAB
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Simulate extreme market drawdowns, regulatory shocks, and liquidity stresses on your holdings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShockPct(0)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-mono self-start sm:self-auto"
        >
          <RotateCcw className="h-3 w-3" /> Reset Shock
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setShockPct(p.shock)}
            className={cn(
              'p-2.5 rounded-xl border text-left transition-all text-xs space-y-1',
              shockPct === p.shock
                ? 'bg-primary/15 border-primary/50 text-foreground ring-1 ring-primary/40'
                : 'bg-card/40 border-border/70 hover:border-border hover:bg-card/70 text-muted-foreground'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{p.label}</span>
              <span
                className={cn(
                  'font-mono font-bold text-[11px]',
                  p.shock >= 0 ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                {p.shock >= 0 ? '+' : ''}
                {p.shock}%
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground line-clamp-1">{p.desc}</p>
          </button>
        ))}
      </div>

      {/* Interactive Range Slider */}
      <div className="space-y-2 p-4 rounded-xl bg-card/40 border border-border/70">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Custom Market Stress Level:</span>
          <span
            className={cn(
              'font-mono font-bold text-base px-2 py-0.5 rounded',
              shockPct > 0
                ? 'text-emerald-400 bg-emerald-500/10'
                : shockPct < 0
                ? 'text-red-400 bg-red-500/10'
                : 'text-foreground'
            )}
          >
            {shockPct > 0 ? '+' : ''}
            {shockPct}%
          </span>
        </div>

        <input
          type="range"
          min="-50"
          max="50"
          step="1"
          value={shockPct}
          onChange={(e) => setShockPct(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />

        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>-50% (Black Swan)</span>
          <span>0% (Neutral)</span>
          <span>+50% (Historic Rally)</span>
        </div>
      </div>

      {/* Shocked Metrics Output */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-card/60 border border-border">
          <span className="text-[11px] text-muted-foreground block">Projected Portfolio Value</span>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">
            ${shockedTotalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span
            className={cn(
              'text-[10px] font-mono font-semibold',
              pnlDeltaUsd >= 0 ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {pnlDeltaUsd >= 0 ? '+' : ''}${pnlDeltaUsd.toFixed(2)} ({pnlDeltaPct.toFixed(2)}%)
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-card/60 border border-border">
          <span className="text-[11px] text-muted-foreground block">Simulated Value at Risk (VaR 99%)</span>
          <p className="text-lg font-bold font-mono text-red-400 mt-0.5">
            ${estimatedVaR99.toFixed(2)}
          </p>
          <span className="text-[10px] font-mono text-muted-foreground">1-Day 99% Confidence Cap</span>
        </div>

        <div className="p-3.5 rounded-xl bg-card/60 border border-border">
          <span className="text-[11px] text-muted-foreground block">Projected Max Drawdown</span>
          <p className="text-lg font-bold font-mono text-amber-400 mt-0.5">
            {maxDrawdown.toFixed(2)}%
          </p>
          <span className="text-[10px] font-mono text-muted-foreground">Peak-to-Trough Decline</span>
        </div>

        <div className="p-3.5 rounded-xl bg-card/60 border border-border">
          <span className="text-[11px] text-muted-foreground block">Liquidity Stress Buffer</span>
          <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
            ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] font-mono text-muted-foreground">Liquid USD / USDC Reserve</span>
        </div>
      </div>

      {/* Position Breakdown Table */}
      {holdings.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-card/60 text-muted-foreground uppercase font-mono text-[10px]">
                <th className="text-left px-3 py-2">Asset</th>
                <th className="text-right px-3 py-2">Shares</th>
                <th className="text-right px-3 py-2">Current Value</th>
                <th className="text-right px-3 py-2">Shocked Value</th>
                <th className="text-right px-3 py-2">Projected Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {holdings.map((h) => {
                const shockedVal = h.valueUsd * multiplier;
                const delta = shockedVal - h.valueUsd;
                return (
                  <tr key={h.symbol} className="hover:bg-card/40">
                    <td className="px-3 py-2 font-bold text-foreground font-mono">{h.symbol}</td>
                    <td className="px-3 py-2 text-right font-mono">{h.quantity.toFixed(4)}</td>
                    <td className="px-3 py-2 text-right font-mono">${h.valueUsd.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold">${shockedVal.toFixed(2)}</td>
                    <td
                      className={cn(
                        'px-3 py-2 text-right font-mono font-bold',
                        delta >= 0 ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {delta >= 0 ? '+' : ''}${delta.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </GlassPanel>
  );
}
