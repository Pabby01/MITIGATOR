'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Layers,
  Lock,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { getAllAssets } from '@/lib/mock-data';
import { useDashboardLiveData } from '@/lib/hooks/useDashboardLiveData';
import { cn } from '@/lib/utils';

export default function PublicMarketsPage() {
  const assets = getAllAssets();
  const { quotes } = useDashboardLiveData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'TECH' | 'ETF' | 'PRE_IPO' | 'CRYPTO'>('ALL');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        asset.tokenizedAsset.symbol.toLowerCase().includes(q) ||
        asset.tokenizedAsset.name.toLowerCase().includes(q) ||
        asset.tokenizedAsset.underlying.ticker.toLowerCase().includes(q) ||
        asset.tokenizedAsset.issuer.name.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedCategory === 'ALL') return true;
      if (selectedCategory === 'TECH') {
        return ['NVDAx', 'AAPLx', 'MSFTx', 'AMZNx', 'GOOGLx', 'METAx', 'AMDx', 'TSMx', 'AVGOx'].includes(asset.tokenizedAsset.symbol);
      }
      if (selectedCategory === 'ETF') {
        return ['SPYx', 'QQQx', 'VTIx', 'VOOx'].includes(asset.tokenizedAsset.symbol);
      }
      if (selectedCategory === 'PRE_IPO') {
        return ['SPCXx', 'OPENAI.T', 'KALSHI.T', 'CRCLx'].includes(asset.tokenizedAsset.symbol);
      }
      if (selectedCategory === 'CRYPTO') {
        return ['COINx', 'SOL', 'USDC'].includes(asset.tokenizedAsset.symbol);
      }
      return true;
    });
  }, [assets, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <PublicNav />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Globe className="h-3.5 w-3.5" />
            <span>Solana Tokenized Stock Directory · 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto">
            Institutional Equities.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              24/7 on Solana.
            </span>
          </h1>

          <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Explore 22+ tokenized US equities, ETFs, and pre-IPO instruments trading on Solana. Verified 1:1 audited custody backing, sub-second Pyth Hermes oracles, and atomic DEX liquidity.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto pt-2 sm:pt-4">
            <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-sm text-center">
              <p className="text-lg sm:text-2xl font-black font-mono text-foreground">22+</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">Tokenized Equities</p>
            </div>
            <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-sm text-center">
              <p className="text-lg sm:text-2xl font-black font-mono text-emerald-400">24/7</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">Continuous Trading</p>
            </div>
            <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-sm text-center">
              <p className="text-lg sm:text-2xl font-black font-mono text-cyan-400">400ms</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">Solana Finality</p>
            </div>
            <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-sm text-center">
              <p className="text-lg sm:text-2xl font-black font-mono text-amber-400">1:1</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">Custody Backed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Asset Directory */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by symbol, stock name, or issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/70 bg-card/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Filter Pills with horizontal scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
            {(
              [
                { id: 'ALL', label: 'All Assets' },
                { id: 'TECH', label: 'Mega-Cap Tech' },
                { id: 'ETF', label: 'Index ETFs' },
                { id: 'PRE_IPO', label: 'Pre-IPO Tokens' },
                { id: 'CRYPTO', label: 'Crypto Ecosystem' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0',
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/20'
                    : 'bg-card/40 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-card'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const sym = asset.tokenizedAsset.symbol;
            const quote = quotes[sym] || quotes[sym.replace(/x$/i, '')] || asset.quote;
            const currentPrice = quote?.price || asset.quote.price;
            const change24h = quote?.changePct24h ?? asset.quote.changePct24h;
            const isPositive = change24h >= 0;

            return (
              <GlassPanel
                key={sym}
                className="p-5 space-y-4 hover:border-primary/40 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-xl bg-secondary/80 border border-border flex items-center justify-center font-bold text-xs text-foreground group-hover:scale-105 transition-transform">
                        {sym.slice(0, 4)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-foreground font-mono">{sym}</h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-primary/10 border border-primary/20 text-primary">
                            SPL
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                          {asset.tokenizedAsset.name}
                        </p>
                      </div>
                    </div>

                    {/* MITIGATOR Score Ring */}
                    <div className="flex flex-col items-center shrink-0">
                      <ScoreRing score={asset.riskScore.overall} size={44} strokeWidth={3.5} showLabel={false} />
                      <span className="text-[9px] font-mono text-muted-foreground mt-1">Risk Score</span>
                    </div>
                  </div>

                  {/* Price & 24h Stats */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <p className="text-xl font-bold font-mono text-foreground">${currentPrice.toFixed(2)}</p>
                      <p className="text-[10px] text-muted-foreground">Pyth Hermes Streaming</p>
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded-lg',
                        isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      )}
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span>{isPositive ? '+' : ''}{change24h.toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* Issuer & Reserve Info */}
                  <div className="p-2.5 rounded-xl border border-border/50 bg-secondary/30 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Canonical Issuer:</span>
                      <span className="font-semibold text-foreground">{asset.tokenizedAsset.issuer.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Backing Verification:</span>
                      <span className="font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> 1:1 Inspected
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action -> Opens the App Dashboard Terminal */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Token-2022
                  </span>
                  <Link
                    href={`/market/${encodeURIComponent(sym)}`}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Trade in Terminal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </section>

      {/* Comparison Table: Solana Tokenized Stocks vs TradFi Brokerages */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-card/20 border-y border-border/40">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-2.5 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Why Solana Tokenized Equities Outperform TradFi
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
              Traditional brokers restrict you to 6.5 market hours per day with T+1 custody clearing. Solana transforms equities into programmable 24/7 collateral.
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="min-w-[620px] w-full text-left text-xs border border-border/70 rounded-2xl overflow-hidden bg-card/40">
              <thead>
                <tr className="border-b border-border/70 bg-secondary/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="p-3.5 sm:p-4">Feature</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400">Solana Tokenized Stocks (MITIGATOR)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground">Traditional Brokerages (Schwab / Robinhood)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Trading Window</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-mono font-bold">24/7/365 Non-stop</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground font-mono">Mon-Fri 9:30 AM - 4:00 PM EST only</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Settlement Speed</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-mono font-bold">~400ms Sub-second Finality</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground font-mono">T+1 (1-2 business days clearinghouse)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Asset Custody</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-mono font-bold">Self-Custodial (Your Solana Wallet)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground font-mono">Custodian / Street name (DTC)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Share Divisibility</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-mono font-bold">Up to 9 Decimal Fractions ($1 tradeable)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground font-mono">Whole shares or restricted fractions</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Pre-Trade Risk Inspection</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-mono font-bold">8-Factor Real-Time MITIGATOR Score</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground font-mono">None (Raw market order risk)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">DeFi Composability</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-mono font-bold">Lend, Borrow, LP in DLMM pools</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground font-mono">Walled garden (No DeFi interop)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/70 to-primary/5 p-6 sm:p-8 md:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
            Ready to trade tokenized stocks with active risk guardrails?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Connect your Solana wallet or launch our risk-free paper trading sandbox with $100,000 virtual balance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/discover"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/risk-engine"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/60 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-card transition-all"
            >
              <span>Read Risk Methodology</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
