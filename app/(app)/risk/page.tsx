'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, TrendingUp, Activity, Zap } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { RiskBadge } from '@/components/shared/SourceBadge';
import { getAsset, getAllAssets } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const RISK_CATEGORIES = [
  { key: 'market', label: 'Market Risk', icon: TrendingUp, level: 'low', score: 82 },
  { key: 'fundamental', label: 'Fundamental Risk', icon: ShieldCheck, level: 'low', score: 85 },
  { key: 'news', label: 'News Risk', icon: Activity, level: 'moderate', score: 72 },
  { key: 'social', label: 'Social Risk', icon: Activity, level: 'moderate', score: 68 },
  { key: 'event', label: 'Event Risk', icon: AlertTriangle, level: 'elevated', score: 58 },
  { key: 'liquidity', label: 'Liquidity Risk', icon: Zap, level: 'low', score: 88 },
  { key: 'execution', label: 'Execution Risk', icon: Zap, level: 'moderate', score: 75 },
  { key: 'token', label: 'Token Risk', icon: ShieldCheck, level: 'low', score: 92 },
  { key: 'oracle', label: 'Oracle Risk', icon: Activity, level: 'low', score: 95 },
  { key: 'onchain', label: 'Onchain Risk', icon: ShieldCheck, level: 'low', score: 90 },
  { key: 'portfolio', label: 'Portfolio Risk', icon: TrendingUp, level: 'moderate', score: 70 },
  { key: 'correlation', label: 'Correlation Risk', icon: Activity, level: 'elevated', score: 62 },
];

export default function RiskPage() {
  const assets = getAllAssets();
  const [symbol, setSymbol] = useState('NVDAx');
  const [amount, setAmount] = useState(2000);
  const [slippage, setSlippage] = useState(0.5);
  const [dca, setDca] = useState(true);

  const asset = getAsset(symbol);
  const recommendedNow = dca ? Math.round(amount * 0.375) : amount;
  const recommendedDca = dca ? Math.round(amount * 0.625) : 0;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Risk Center</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Multi-factor risk analysis, trade simulation, and mitigation</p>
      </div>

      {/* Risk categories grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {RISK_CATEGORIES.map((cat, i) => (
          <motion.div key={cat.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <GlassPanel hover className="p-4">
              <div className="flex items-start justify-between mb-2">
                <cat.icon className={cn(
                  'h-4 w-4',
                  cat.level === 'low' ? 'text-emerald-400' : cat.level === 'moderate' ? 'text-cyan-400' : cat.level === 'elevated' ? 'text-amber-400' : 'text-red-400'
                )} />
                <RiskBadge level={cat.level} />
              </div>
              <p className="text-xs text-muted-foreground">{cat.label}</p>
              <p className={cn(
                'mt-1 text-2xl font-bold tabular-nums',
                cat.score >= 80 ? 'text-emerald-400' : cat.score >= 65 ? 'text-amber-400' : 'text-red-400'
              )}>{cat.score}</p>
              <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${cat.score}%`,
                    backgroundColor: cat.score >= 80 ? '#3fb98a' : cat.score >= 65 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Trade Simulator */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassPanel className="p-5">
          <h2 className="text-sm font-semibold tracking-wide mb-4">Trade Simulator</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Asset</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm outline-none"
              >
                {assets.map((a) => (
                  <option key={a.tokenizedAsset.symbol} value={a.tokenizedAsset.symbol}>
                    {a.tokenizedAsset.symbol} — {a.tokenizedAsset.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Investment Amount</label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="flex-1 bg-transparent text-sm outline-none tabular-nums"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Max Slippage: {slippage.toFixed(2)}%</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.05"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Enable DCA</label>
              <button
                onClick={() => setDca(!dca)}
                className={cn('relative h-5 w-9 rounded-full transition-colors', dca ? 'bg-primary' : 'bg-border')}
              >
                <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', dca ? 'translate-x-4' : 'translate-x-0.5')} />
              </button>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h2 className="text-sm font-semibold tracking-wide mb-4">Impact Analysis</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Entry Price</span>
              <span className="text-sm font-medium tabular-nums">${asset.quote.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Position Size</span>
              <span className="text-sm font-medium tabular-nums">{(amount / asset.quote.price).toFixed(2)} {symbol.replace('x', '')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Est. Slippage</span>
              <span className="text-sm font-medium tabular-nums text-amber-400">~0.12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Price Impact</span>
              <span className="text-sm font-medium tabular-nums text-amber-400">~0.08%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Portfolio Concentration</span>
              <span className={cn('text-sm font-medium tabular-nums', amount > 1500 ? 'text-amber-400' : 'text-emerald-400')}>
                {((amount / 42840) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Sector Exposure</span>
              <span className="text-sm font-medium tabular-nums">{asset.tokenizedAsset.underlying.sector}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Event Risk</span>
              <RiskBadge level="elevated" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Liquidity</span>
              <span className="text-sm font-medium tabular-nums text-emerald-400">{asset.liquidityScore}/100</span>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h2 className="text-sm font-semibold tracking-wide mb-4">MITIGATOR Recommendation</h2>
          <div className="space-y-3">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs text-amber-400 font-medium mb-1">Recommendation</p>
              <p className="text-sm">
                {amount > 1500
                  ? 'Consider reducing initial exposure. DCA recommended.'
                  : 'Position size is reasonable. Proceed with standard execution.'}
              </p>
            </div>
            {dca && amount > 1500 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                  <p className="text-xs text-emerald-400 font-medium">Now</p>
                  <p className="text-xl font-bold tabular-nums text-emerald-400">${recommendedNow.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-center">
                  <p className="text-xs text-cyan-400 font-medium">DCA (3 entries)</p>
                  <p className="text-xl font-bold tabular-nums text-cyan-400">${recommendedDca.toLocaleString()}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Mitigation Options</p>
              {[
                'Smaller initial position',
                'DCA over 3 entries',
                `Max slippage: ${slippage.toFixed(2)}%`,
                'Use Jupiter routing',
                'Event blackout enabled',
                'Set stop-loss alert',
              ].map((opt) => (
                <div key={opt} className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* MITIGATOR Score for selected asset */}
      <GlassPanel className="p-5 flex flex-col items-center">
        <h2 className="text-sm font-semibold tracking-wide mb-4 self-start">{symbol} MITIGATOR Score</h2>
        <ScoreRing score={asset.riskScore.overall} size={160} />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
          {asset.riskScore.factors.slice(0, 4).map((factor) => (
            <div key={factor.key} className="text-center">
              <p className="text-xs text-muted-foreground">{factor.label}</p>
              <p className={cn(
                'text-lg font-bold tabular-nums',
                factor.score >= 75 ? 'text-emerald-400' : factor.score >= 60 ? 'text-amber-400' : 'text-red-400'
              )}>{factor.score}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
