'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Wallet, TrendingUp, TrendingDown, PieChart, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import { GlassPanel, MetricCard } from '@/components/shared/GlassPanel';
import { RiskBadge } from '@/components/shared/SourceBadge';
import { getPortfolio } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
  const portfolio = getPortfolio();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Position analysis, risk exposure, and portfolio intelligence</p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard label="Total Value" value={`$${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={Wallet} />
        <MetricCard label="Cash" value={`$${portfolio.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={Wallet} />
        <MetricCard label="Total P&L" value={`+$${portfolio.totalPnl.toFixed(2)}`} change={`+${portfolio.totalPnlPct.toFixed(2)}%`} changePct={portfolio.totalPnlPct} icon={TrendingUp} />
        <MetricCard label="Daily P&L" value={`+$${portfolio.dailyPnl.toFixed(2)}`} change={`+${portfolio.dailyPnlPct.toFixed(2)}%`} changePct={portfolio.dailyPnlPct} icon={TrendingUp} />
        <MetricCard label="Cost Basis" value={`$${portfolio.costBasis.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={PieChart} />
      </div>

      {/* Risk metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassPanel className="p-4">
          <p className="text-xs text-muted-foreground">Drawdown</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-amber-400">{portfolio.drawdown.toFixed(1)}%</p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <p className="text-xs text-muted-foreground">Max Drawdown</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-red-400">{portfolio.maxDrawdown.toFixed(1)}%</p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <p className="text-xs text-muted-foreground">Risk Budget</p>
          <p className="mt-1 text-xl font-bold tabular-nums">{portfolio.riskBudgetUsed}/{portfolio.riskBudget}</p>
          <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
            <div className="h-full rounded-full bg-amber-400" style={{ width: `${(portfolio.riskBudgetUsed / portfolio.riskBudget) * 100}%` }} />
          </div>
        </GlassPanel>
        <GlassPanel className="p-4">
          <p className="text-xs text-muted-foreground">Positions</p>
          <p className="mt-1 text-xl font-bold tabular-nums">{portfolio.positions.length}</p>
        </GlassPanel>
      </div>

      {/* Positions */}
      <GlassPanel className="p-5">
        <h2 className="text-sm font-semibold tracking-wide mb-4">Positions</h2>
        <div className="space-y-2">
          {portfolio.positions.map((pos, i) => (
            <motion.div key={pos.symbol} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/market/${pos.symbol}`} className="flex items-center justify-between rounded-lg p-3 hover:bg-card/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold">
                    {pos.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{pos.symbol}</p>
                    <p className="text-xs text-muted-foreground">{pos.quantity} shares · ${pos.avgCost.toFixed(2)} avg</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium tabular-nums">${pos.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className={cn('text-xs tabular-nums', pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)} ({pos.pnlPct >= 0 ? '+' : ''}{pos.pnlPct.toFixed(1)}%)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className={cn('text-sm font-bold tabular-nums', pos.riskScore >= 75 ? 'text-emerald-400' : 'text-amber-400')}>{pos.riskScore}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Alloc</p>
                    <p className="text-sm font-medium tabular-nums">{((pos.marketValue / portfolio.totalValue) * 100).toFixed(1)}%</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </GlassPanel>

      {/* Allocation + Sector */}
      <div className="grid lg:grid-cols-2 gap-4">
        <GlassPanel className="p-5">
          <h2 className="text-sm font-semibold tracking-wide mb-4">Concentration</h2>
          <div className="space-y-3">
            {portfolio.concentration.map((c) => (
              <div key={c.symbol}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{c.symbol}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{c.weight.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.weight}%` }}
                    transition={{ duration: 0.6 }}
                    className={cn('h-full rounded-full', c.weight > 30 ? 'bg-amber-400' : 'bg-primary')}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h2 className="text-sm font-semibold tracking-wide mb-4">Sector Exposure</h2>
          <div className="space-y-3">
            {portfolio.sectorExposure.map((s, i) => (
              <div key={s.sector}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{s.sector}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{s.weight}%</span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.weight}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: ['#3fb98a', '#4cc9f0', '#a78bfa', '#f59e0b'][i % 4] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Correlation */}
      <GlassPanel className="p-5">
        <h2 className="text-sm font-semibold tracking-wide mb-4">Correlation Matrix</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {portfolio.correlation.map((c) => (
            <div key={`${c.a}-${c.b}`} className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">{c.a} / {c.b}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className={cn(
                  'text-lg font-bold tabular-nums',
                  c.value > 0.7 ? 'text-red-400' : c.value > 0.5 ? 'text-amber-400' : 'text-emerald-400'
                )}>
                  {c.value.toFixed(2)}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${c.value * 100}%`,
                      backgroundColor: c.value > 0.7 ? '#ef4444' : c.value > 0.5 ? '#f59e0b' : '#3fb98a',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/risk" className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
          <div className="rounded-lg bg-amber-500/10 p-2"><AlertTriangle className="h-4 w-4 text-amber-400" /></div>
          <div><p className="text-sm font-medium">Scenario Simulator</p><p className="text-xs text-muted-foreground">Test portfolio scenarios</p></div>
        </Link>
        <Link href="/robo" className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
          <div className="rounded-lg bg-primary/10 p-2"><Activity className="h-4 w-4 text-primary" /></div>
          <div><p className="text-sm font-medium">Rebalance / DCA</p><p className="text-xs text-muted-foreground">Automate adjustments</p></div>
        </Link>
        <Link href="/alerts" className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
          <div className="rounded-lg bg-cyan-500/10 p-2"><AlertTriangle className="h-4 w-4 text-cyan-400" /></div>
          <div><p className="text-sm font-medium">Portfolio Alerts</p><p className="text-xs text-muted-foreground">Concentration warnings</p></div>
        </Link>
      </div>
    </div>
  );
}
