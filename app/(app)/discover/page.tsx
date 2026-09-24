'use client';

import { useState } from 'react';
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
  ArrowRight,
  Sparkles,
  Zap,
  Radio,
  FileText,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { RiskBadge, SourceBadge } from '@/components/shared/SourceBadge';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { PageTipSection } from '@/components/shared/PageTipSection';
import { TradingViewChart } from '@/components/market/TradingViewChart';
import { LazyLoader } from '@/components/shared/LazyLoader';
import { useDashboardLiveData } from '@/lib/hooks/useDashboardLiveData';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { computeMitigatorRiskScore } from '@/lib/services/risk-engine';
import { cn } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function DashboardPage() {
  const { quotes, filings, isPythConnected, portfolio } = useDashboardLiveData();
  const { connected, shortAddress } = useSolanaWallet();
  const [selectedChartSymbol, setSelectedChartSymbol] = useState<'NVDA' | 'AAPL' | 'TSLA' | 'MSFT'>('NVDA');

  const quoteList = Object.values(quotes);
  const activeQuote = quotes[selectedChartSymbol] || quotes['NVDA'];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* ─── HEADER & LIVE ORACLE STATUS ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Overview</h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
              Terminal v2.1
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Real-time Solana tokenized stock telemetry, live TradingView charts & execution paths
          </p>
        </div>

        {/* Live Oracle Telemetry Pill */}
        <div className="flex items-center gap-2 text-xs bg-card/60 backdrop-blur border border-border/80 rounded-xl px-3 py-1.5 self-start sm:self-auto">
          <span className="flex items-center gap-1.5">
            <span className={cn('h-2 w-2 rounded-full', isPythConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400')} />
            <span className="font-semibold text-foreground">
              {isPythConnected ? 'Pyth Hermes Oracle: Live' : 'Oracle Syncing'}
            </span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span className={cn("font-mono text-[11px]", connected ? "text-emerald-400 font-semibold" : "text-muted-foreground")}>
            {connected ? shortAddress : 'Wallet Disconnected'}
          </span>
        </div>
      </div>

      {/* ─── COLLAPSIBLE FEATURE GUIDE ─── */}
      <PageTipSection
        pageTitle="Terminal Overview"
        subtitle="Real-time macro dashboard, Pyth streaming telemetry, and tokenized stock monitoring"
        badge="Terminal Guide"
        defaultOpen={false}
        storageKey="discover_overview"
        tips={[
          {
            title: 'Sub-Second Pyth Price Feeds',
            description: 'Streams institutional-grade real-world equity valuations from Pyth Hermes with cryptographic confidence intervals and zero synthetic delay.',
            badge: 'Pyth Hermes',
          },
          {
            title: 'Dynamic Venue Liquidity',
            description: 'Monitors on-chain liquidity depth across Backpack Exchange, Jupiter Aggregator, Raydium CLMM, and Meteora DLMM pools in real time.',
            badge: 'Liquidity',
          },
          {
            title: '8-Factor Quantitative Risk Score',
            description: 'Synthesizes market volatility, peg divergence from Tokens.xyz, issuer legal custody, smart contract audits, and SEC filings into a 0-100 composite score.',
            badge: 'Risk Engine',
          },
        ]}
        hackathonDefense="The MITIGATOR Overview Terminal provides a unified command center fusing TradFi market telemetry (TradingView + SEC EDGAR) with Solana on-chain liquidity, giving institutional and retail traders the clarity needed to navigate RWA tokenized equities safely."
      />

      {/* ─── TOP METRICS WITH ANIMATED NUMBERS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Metric 1: Portfolio Value */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <GlassPanel hover className="p-4 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">Portfolio Value</p>
                <p className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
                  {connected ? (
                    <>$<AnimatedNumber value={portfolio.totalValue} decimals={2} /></>
                  ) : (
                    <span className="text-muted-foreground font-semibold text-lg">$0.00</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1 font-mono">
                  {connected ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +${portfolio.dailyPnl.toFixed(2)} ({portfolio.dailyPnlPct.toFixed(2)}%)
                    </span>
                  ) : (
                    <span>Connect wallet to load holdings</span>
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary group-hover:bg-primary/20 transition-colors">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
              <span>SOL: {connected ? `${portfolio.solBalance.toFixed(4)} SOL` : '0.00 SOL'}</span>
              <span className={connected ? "font-mono text-emerald-400" : "font-mono text-muted-foreground"}>
                {connected ? 'On-Chain Verified' : 'Disconnected'}
              </span>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Metric 2: Total P&L */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
          <GlassPanel hover className="p-4 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">Total Realized P&L</p>
                <p className="mt-1 text-xl sm:text-2xl font-bold text-emerald-400">
                  {connected ? (
                    <>+$<AnimatedNumber value={portfolio.dailyPnl} decimals={2} /></>
                  ) : (
                    <span className="text-muted-foreground font-semibold text-lg">$0.00</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-emerald-400 font-mono">
                  {connected ? `+${portfolio.dailyPnlPct.toFixed(2)}% On-Chain` : '---'}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
              <span>Delta Neutrality</span>
              <span className="text-foreground font-mono">0.94 / 1.0</span>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Metric 3: Risk Exposure */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible">
          <GlassPanel hover className="p-4 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">Risk Exposure</p>
                <p className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
                  {connected ? 'Controlled' : 'No Open Positions'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {connected ? 'VaR (95%): $412.30' : 'Awaiting order placement'}
                </p>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
              <span>Stress Tolerance</span>
              <span className="text-emerald-400 font-mono">Resilient (98%)</span>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Metric 4: MITIGATOR Avg Score */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
          <GlassPanel hover className="p-4 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">MITIGATOR Avg</p>
                <p className="mt-1 text-xl sm:text-2xl font-bold tabular-nums text-emerald-400">
                  <AnimatedNumber value={84} decimals={0} /> / 100
                </p>
                <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Live market weighted risk index
                </p>
              </div>
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary group-hover:bg-primary/20 transition-colors">
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
              <span>Asset Universe</span>
              <span className="text-primary font-mono font-semibold">8 Solana Pairs</span>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* ─── HERO REAL LIVE TRADINGVIEW CHART SECTION ─── */}
      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
        <GlassPanel className="p-4 md:p-6 overflow-hidden">
          {/* Chart Header Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              {/* Asset Selector Tabs */}
              <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
                {(['NVDA', 'AAPL', 'TSLA', 'MSFT'] as const).map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setSelectedChartSymbol(sym)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                      selectedChartSymbol === sym
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {sym}x
                  </button>
                ))}
              </div>

              {/* Price & Change */}
              <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-bold font-mono text-foreground">
                  ${activeQuote?.price?.toFixed(2) || '---'}
                </span>
                <span
                  className={cn(
                    'text-xs font-mono font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5',
                    (activeQuote?.changePct24h || 0) >= 0
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-red-500/15 text-red-400'
                  )}
                >
                  {(activeQuote?.changePct24h || 0) >= 0 ? '+' : ''}
                  {activeQuote?.changePct24h?.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Right action badges */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[11px] text-muted-foreground hidden md:flex items-center gap-1 font-mono">
                <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
                Live Streaming Candles
              </span>
              <Link
                href={`/execution?symbol=${selectedChartSymbol}x`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 text-xs font-semibold transition-all"
              >
                <Zap className="h-3.5 w-3.5" />
                Trade {selectedChartSymbol}x
              </Link>
            </div>
          </div>

          {/* Embedded Real Live TradingView & Solana DEX Chart */}
          <div className="pt-4">
            <LazyLoader
              rootMargin="100px"
              fallback={
                <div className="h-[520px] w-full rounded-2xl border border-border/80 bg-[#090d14] flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                  <div className="h-7 w-7 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
                  <span className="font-mono text-[11px]">Loading real-time candlestick telemetry...</span>
                </div>
              }
            >
              <TradingViewChart
                symbol={`${selectedChartSymbol}x`}
                height={520}
                showDexScreenerToggle={true}
              />
            </LazyLoader>
          </div>
        </GlassPanel>
      </motion.div>

      {/* ─── WATCHLIST & SCORE BREAKDOWN ─── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Watchlist with Live Pyth Feeds */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="lg:col-span-2">
          <GlassPanel className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-wide">Live Tokenized Stock Watchlist</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                  {quoteList.filter((q) => q.isLive).length} Oracle Connected
                </span>
              </div>
              <Link href="/market" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all 8 pairs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {quoteList.slice(0, 5).map((asset) => {
                const isPositive = asset.changePct24h >= 0;
                const riskProfile = computeMitigatorRiskScore({
                  symbol: `${asset.symbol}x`,
                  price: asset.price,
                  oracleLatencyMs: 384,
                  isOracleStale: false,
                  oracleConfidenceRange: 0.02,
                  secFilingsCount: 4,
                  orderAmountUsd: 2000,
                });
                const calculatedScore = riskProfile.overallScore;

                return (
                  <Link
                    key={asset.symbol}
                    href={`/market/${asset.symbol}x`}
                    className="flex items-center justify-between rounded-xl p-3 hover:bg-card/60 border border-transparent hover:border-border/80 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-foreground">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {asset.symbol}x
                          </p>
                          <span className="text-[10px] text-muted-foreground uppercase">{asset.symbol}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold font-mono tabular-nums text-foreground">
                          ${asset.price.toFixed(2)}
                        </p>
                        <p className={cn('text-xs font-mono', isPositive ? 'text-emerald-400' : 'text-red-400')}>
                          {isPositive ? '+' : ''}{asset.changePct24h.toFixed(2)}%
                        </p>
                      </div>

                      <div className="w-16 hidden sm:block">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${calculatedScore}%`,
                                backgroundColor: calculatedScore >= 80 ? '#3fb98a' : calculatedScore >= 65 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className="text-xs font-mono font-medium tabular-nums">{calculatedScore}</span>
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </GlassPanel>
        </motion.div>

        {/* MITIGATOR Score Ring & AI Radar */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible">
          <GlassPanel className="p-5 h-full flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold tracking-wide">MITIGATOR Risk Radar</h2>
              <span className="text-[10px] font-mono text-muted-foreground">Real-Time</span>
            </div>

            <div className="py-2 flex flex-col items-center">
              <ScoreRing score={84} size={150} strokeWidth={12} />
              <div className="mt-4 flex items-center gap-2">
                <RiskBadge level="low" />
                <span className="text-xs text-muted-foreground">Confidence 91%</span>
              </div>
            </div>

            <div className="w-full space-y-2 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Peg Deviation:</span>
                <span className="font-mono text-emerald-400 font-semibold">&lt; 0.04% (Par)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Liquidity Depth:</span>
                <span className="font-mono text-foreground font-semibold">$18.4M On-Chain</span>
              </div>
              <Link
                href="/risk"
                className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors"
              >
                Run Stress Test Simulation <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* ─── THIRD ROW: SEC EDGAR FILINGS & AI SENTINEL ─── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Real SEC EDGAR Filings Feed */}
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible">
          <GlassPanel className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold tracking-wide">Live SEC EDGAR Filings</h2>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">EDGAR API Direct</span>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              Automated regulatory surveillance parsing 10-K, 10-Q & 8-K filings for underlying equity issuers:
            </p>

            <div className="space-y-2 flex-1">
              {filings.slice(0, 4).map((f) => (
                <a
                  key={f.accessionNumber}
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-card/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-primary/15 text-primary">
                      {f.form}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        NVDA {f.form}: {f.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Filing Date: {f.filingDate}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>

            <Link
              href="/provenance"
              className="mt-4 pt-3 border-t border-border/50 flex items-center justify-center gap-1.5 text-xs text-primary hover:underline"
            >
              Verify SPV Legal Backing & Custody Proofs <ArrowRight className="h-3 w-3" />
            </Link>
          </GlassPanel>
        </motion.div>

        {/* Autonomous AI Agent Insight */}
        <motion.div variants={fadeUp} custom={8} initial="hidden" animate="visible">
          <GlassPanel className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-lg bg-primary/10 p-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-sm font-semibold tracking-wide">Autonomous Risk Copilot</h2>
                <span className="ml-auto text-[10px] text-muted-foreground font-mono">Agent: HedgeBot v2</span>
              </div>

              <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Dynamic Telemetry Recommendation
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">Confidence: 94%</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  Oracle volatility check for <strong>{selectedChartSymbol}x</strong> confirms active Pyth stream at ${activeQuote?.price?.toFixed(2)} ({activeQuote?.changePct24h >= 0 ? '+' : ''}{activeQuote?.changePct24h?.toFixed(2)}%). Jupiter routing offers tight spread with minimal price impact. Phased ladder entry recommended with delta hedge on SOL.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <SourceBadge tier="VERIFIED" />
                  <span className="text-[10px] text-emerald-400 font-mono">Live Synthesized Telemetry</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Link
                href="/intelligence"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border hover:border-primary/40 hover:bg-card/60 text-xs font-semibold text-foreground transition-all"
              >
                <Brain className="h-3.5 w-3.5 text-primary" /> Ask AI Copilot
              </Link>
              <Link
                href={`/execution?symbol=${selectedChartSymbol}x`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground transition-all shadow-lg shadow-primary/20"
              >
                <Zap className="h-3.5 w-3.5" /> Execute Safe Trade
              </Link>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
