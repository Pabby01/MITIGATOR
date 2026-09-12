'use client';

import { motion } from 'framer-motion';
import { Cpu, TrendingUp, Users, Copy, FlaskConical, CheckCircle2 } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { RiskBadge } from '@/components/shared/SourceBadge';
import { getStrategies } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function StrategiesPage() {
  const strategies = getStrategies();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Strategy Marketplace</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Transparent, metrics-driven strategies. Follow, copy, or paper trade.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strategies.map((strat, i) => (
          <motion.div key={strat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassPanel hover className="p-5 h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2"><Cpu className="h-4 w-4 text-primary" /></div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold">{strat.name}</p>
                      {strat.verified && <CheckCircle2 className="h-3 w-3 text-primary" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">{strat.creator}</p>
                  </div>
                </div>
                <RiskBadge level={strat.riskLevel} />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{strat.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="rounded-lg bg-card/50 p-2">
                  <p className="text-muted-foreground">ROI</p>
                  <p className="font-bold tabular-nums text-emerald-400">+{strat.roi.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg bg-card/50 p-2">
                  <p className="text-muted-foreground">Max DD</p>
                  <p className="font-bold tabular-nums text-red-400">{strat.drawdown.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg bg-card/50 p-2">
                  <p className="text-muted-foreground">Sharpe</p>
                  <p className="font-bold tabular-nums">{strat.sharpe.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-card/50 p-2">
                  <p className="text-muted-foreground">Win Rate</p>
                  <p className="font-bold tabular-nums">{strat.winRate}%</p>
                </div>
                <div className="rounded-lg bg-card/50 p-2">
                  <p className="text-muted-foreground">Volatility</p>
                  <p className="font-bold tabular-nums">{strat.volatility}%</p>
                </div>
                <div className="rounded-lg bg-card/50 p-2">
                  <p className="text-muted-foreground">Frequency</p>
                  <p className="font-bold tabular-nums">{strat.tradeFrequency}/wk</p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground mb-4">
                <p>Hold: {strat.holdingPeriod}</p>
                <p>Concentration: {strat.concentration}%</p>
                <p>Method: {strat.methodology}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {strat.followers} followers</span>
                <span>{strat.copiers} copiers</span>
              </div>

              <div className="mt-auto grid grid-cols-3 gap-2">
                <button className="flex items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs hover:border-primary/30 transition-colors">
                  <TrendingUp className="h-3 w-3" /> Follow
                </button>
                <button className="flex items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs hover:border-primary/30 transition-colors">
                  <Copy className="h-3 w-3" /> Copy
                </button>
                <button className="flex items-center justify-center gap-1 rounded-lg bg-primary/10 border border-primary/20 py-2 text-xs text-primary hover:bg-primary/15 transition-colors">
                  <FlaskConical className="h-3 w-3" /> Paper
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 text-xs text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
        Copy sizing considers your risk profile and portfolio concentration. Past performance does not guarantee future results.
      </div>
    </div>
  );
}
