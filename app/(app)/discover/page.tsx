'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Brain,
  Activity,
  Bell,
  Eye,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { GlassPanel, MetricCard, PriceChange } from '@/components/shared/GlassPanel';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { RiskBadge, SourceBadge } from '@/components/shared/SourceBadge';
import { getAllAssets, getPortfolio, getAlerts } from '@/lib/mock-data';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function DashboardPage() {
  const assets = getAllAssets();
  const portfolio = getPortfolio();
  const alerts = getAlerts();
  const topMovers = [...assets].sort((a, b) => Math.abs(b.quote.changePct24h) - Math.abs(a.quote.changePct24h));
  const watchlist = assets.slice(0, 4);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your command center for tokenized stock intelligence</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
          <span>·</span>
          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} EST</span>
        </div>
      </div>

      {/* Top metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <MetricCard label="Portfolio Value" value={`$${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} change={`+$${portfolio.dailyPnl.toFixed(2)}`} changePct={portfolio.dailyPnlPct} icon={Wallet} />
        </motion.div>
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
          <MetricCard label="Total P&L" value={`+$${portfolio.totalPnl.toFixed(2)}`} change={`+${portfolio.totalPnlPct.toFixed(2)}%`} changePct={portfolio.totalPnlPct} icon={TrendingUp} />
        </motion.div>
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible">
          <GlassPanel hover className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">Risk Exposure</p>
                <p className="mt-1 text-2xl font-bold">Moderate</p>
                <p className="mt-1 text-xs text-muted-foreground">Budget: {portfolio.riskBudgetUsed}/{portfolio.riskBudget}</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
              </div>
            </div>
          </GlassPanel>
        </motion.div>
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
          <GlassPanel hover className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">MITIGATOR Avg</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-400">82</p>
                <p className="mt-1 text-xs text-emerald-400">+2.4 from yesterday</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <Brain className="h-4 w-4 text-primary" />
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Watchlist */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="lg:col-span-2">
          <GlassPanel className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wide">Watchlist</h2>
              <Link href="/market" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {watchlist.map((asset) => (
                <Link
                  key={asset.tokenizedAsset.symbol}
                  href={`/market/${asset.tokenizedAsset.symbol}`}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-card/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                      {asset.tokenizedAsset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{asset.tokenizedAsset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{asset.tokenizedAsset.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium tabular-nums">${asset.quote.price.toFixed(2)}</p>
                      <PriceChange change={asset.quote.change24h} pct={asset.quote.changePct24h} className="text-xs" />
                    </div>
                    <div className="w-16">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${asset.riskScore.overall}%`,
                              backgroundColor: asset.riskScore.overall >= 75 ? '#3fb98a' : asset.riskScore.overall >= 60 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium tabular-nums">{asset.riskScore.overall}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* MITIGATOR Score */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible">
          <GlassPanel className="p-5 h-full flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold tracking-wide mb-4 self-start">MITIGATOR Score</h2>
            <ScoreRing score={82} size={140} />
            <div className="mt-4 flex items-center gap-2">
              <RiskBadge level="moderate" />
              <span className="text-xs text-muted-foreground">Confidence 87%</span>
            </div>
            <Link href="/market/NVDAx" className="mt-4 text-xs text-primary hover:underline flex items-center gap-1">
              View NVDAx breakdown <ArrowRight className="h-3 w-3" />
            </Link>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Second row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Top movers */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="lg:col-span-2">
          <GlassPanel className="p-5">
            <h2 className="text-sm font-semibold tracking-wide mb-4">Top Movers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {topMovers.slice(0, 4).map((asset) => (
                <Link
                  key={asset.tokenizedAsset.symbol}
                  href={`/market/${asset.tokenizedAsset.symbol}`}
                  className="rounded-lg border border-border p-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{asset.tokenizedAsset.symbol}</span>
                    {asset.quote.changePct24h >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </div>
                  <p className="text-lg font-bold tabular-nums">${asset.quote.price.toFixed(2)}</p>
                  <PriceChange change={asset.quote.change24h} pct={asset.quote.changePct24h} className="text-xs" />
                </Link>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Risk alerts */}
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible">
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wide">Risk Alerts</h2>
              <Link href="/alerts" className="text-xs text-primary hover:underline flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-card/50 transition-colors">
                  <div className={`mt-0.5 rounded p-1 ${alert.triggered ? 'bg-amber-500/10' : 'bg-card'}`}>
                    {alert.triggered ? (
                      <Bell className="h-3 w-3 text-amber-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {alert.symbol} {alert.type.replace(/_/g, ' ')} {alert.condition} {alert.threshold}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {alert.triggered ? `Triggered · ${alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}` : `Current: ${alert.current}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Third row: AI insight + Market timeline */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* AI insight */}
        <motion.div variants={fadeUp} custom={8} initial="hidden" animate="visible">
          <GlassPanel hover className="p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-primary/10 p-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold tracking-wide">AI Insight</h2>
              <span className="ml-auto text-[10px] text-muted-foreground">mitigator-v2.1</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-1">Verdict</p>
                <p className="text-sm">NVDAx shows strong trade readiness (Score 84). Consider phased entry: $750 now, $1,250 DCA.</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <SourceBadge tier="VERIFIED" />
                  <span className="text-[10px] text-muted-foreground">82% confidence</span>
                </div>
              </div>
              <Link href="/intelligence" className="flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors">
                <Brain className="h-3.5 w-3.5" />
                Ask AI Copilot
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Market timeline */}
        <motion.div variants={fadeUp} custom={9} initial="hidden" animate="visible">
          <GlassPanel className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wide">Market Timeline</h2>
              <Link href="/market/NVDAx" className="text-xs text-primary hover:underline flex items-center gap-1">
                NVDAx <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="relative pl-4 space-y-3">
              <div className="absolute left-0 top-1 bottom-1 w-px bg-border" />
              {[
                { type: 'Earnings', title: 'NVDA Q4 Beat', time: '2d ago', impact: 'positive', importance: 'high' },
                { type: 'News', title: 'Blackwell Announcement', time: '3d ago', impact: 'positive', importance: 'high' },
                { type: 'Filing', title: '10-K Filed', time: '14d ago', impact: 'neutral', importance: 'medium' },
                { type: 'Risk', title: 'Score improved to 84', time: '4d ago', impact: 'positive', importance: 'medium' },
              ].map((event, i) => (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-[18px] top-1 h-2 w-2 rounded-full ${
                      event.impact === 'positive' ? 'bg-emerald-400' : event.impact === 'negative' ? 'bg-red-400' : 'bg-cyan-400'
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">{event.title}</p>
                      <p className="text-[10px] text-muted-foreground">{event.type} · {event.time}</p>
                    </div>
                    {event.importance === 'high' && (
                      <span className="text-[9px] font-semibold text-amber-400 uppercase tracking-wider">High</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Portfolio snapshot */}
      <motion.div variants={fadeUp} custom={10} initial="hidden" animate="visible">
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold tracking-wide">Portfolio Snapshot</h2>
            <Link href="/portfolio" className="text-xs text-primary hover:underline flex items-center gap-1">
              Full portfolio <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Value</p>
              <p className="text-lg font-bold tabular-nums">${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cash</p>
              <p className="text-lg font-bold tabular-nums">${portfolio.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Drawdown</p>
              <p className="text-lg font-bold tabular-nums text-amber-400">{portfolio.drawdown.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Drawdown</p>
              <p className="text-lg font-bold tabular-nums text-red-400">{portfolio.maxDrawdown.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Positions</p>
              <p className="text-lg font-bold tabular-nums">{portfolio.positions.length}</p>
            </div>
          </div>
          {/* Sector exposure bar */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Sector Exposure</p>
            <div className="flex h-2 rounded-full overflow-hidden">
              {portfolio.sectorExposure.map((sector, i) => (
                <div
                  key={sector.sector}
                  className="h-full"
                  style={{
                    width: `${sector.weight}%`,
                    backgroundColor: ['#3fb98a', '#4cc9f0', '#a78bfa', '#f59e0b'][i % 4],
                  }}
                  title={`${sector.sector}: ${sector.weight}%`}
                />
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
              {portfolio.sectorExposure.map((sector, i) => (
                <span key={sector.sector} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ['#3fb98a', '#4cc9f0', '#a78bfa', '#f59e0b'][i % 4] }} />
                  {sector.sector} {sector.weight}%
                </span>
              ))}
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
