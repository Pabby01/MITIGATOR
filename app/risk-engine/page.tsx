'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Clock,
  Layers,
  Scale,
  Lock,
  Cpu,
  Zap,
} from 'lucide-react';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { cn } from '@/lib/utils';

const EIGHT_FACTORS = [
  {
    num: '01',
    name: 'Oracle Staleness & Publisher Consensus',
    weight: '15%',
    icon: Clock,
    color: 'emerald',
    desc: 'Tracks milliseconds since last Pyth Hermes publisher update. If latency exceeds 60s or confidence interval widens above ±1.5%, trading guardrails engage automatically.',
  },
  {
    num: '02',
    name: 'TradFi vs 24/7 On-Chain Divergence',
    weight: '18%',
    icon: Scale,
    color: 'teal',
    desc: 'TradFi equity markets close at 4:00 PM EST, while Solana trades 24/7. Evaluates price skew between off-market AMM pricing and official NYSE/NASDAQ closing NAV.',
  },
  {
    num: '03',
    name: 'AMM Liquidity & Slippage Depth',
    weight: '15%',
    icon: Activity,
    color: 'cyan',
    desc: 'Simulates market impact against Jupiter v6, Raydium CLMM, and Meteora DLMM pool reserves. Calculates estimated price impact for orders up to $50,000.',
  },
  {
    num: '04',
    name: 'Corporate Actions & Dividend Multipliers',
    weight: '12%',
    icon: Layers,
    color: 'blue',
    desc: 'Monitors ex-dividend dates, forward stock splits, and ticker renames to verify the tokenized contract preserves true economic equivalence with underlying stock.',
  },
  {
    num: '05',
    name: 'Token-2022 Security & Freeze Authorities',
    weight: '12%',
    icon: Lock,
    color: 'amber',
    desc: 'Inspects on-chain Solana mint account configurations. Audits transfer hook program IDs, permanent delegate keys, and freeze authority permissions.',
  },
  {
    num: '06',
    name: 'SEC Regulatory & XBRL Recency',
    weight: '10%',
    icon: Cpu,
    color: 'purple',
    desc: 'Parses SEC EDGAR for latest 10-K, 10-Q, and 8-K filings. Flags upcoming earnings blackout windows and regulatory investigations before trade execution.',
  },
  {
    num: '07',
    name: 'Implied Volatility & Realized ATR',
    weight: '10%',
    icon: TrendingDown,
    color: 'rose',
    desc: 'Computes Average True Range (ATR) across 1-day and 30-day lookbacks. Adjusts recommended stop-loss and limit order spreads to prevent predatory liquidations.',
  },
  {
    num: '08',
    name: 'Portfolio Concentration & Fit',
    weight: '8%',
    icon: ShieldCheck,
    color: 'emerald',
    desc: 'Evaluates your overall portfolio sector exposure. If entering an asset causes tech or semiconductor exposure to exceed 40%, DCA tranche staging is enforced.',
  },
];

export default function PublicRiskEnginePage() {
  const [selectedScore, setSelectedScore] = useState(82);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <PublicNav />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-background to-background" />

        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Proprietary 8-Factor Quant Methodology</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto">
            Know The Risk.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Before You Trade.
            </span>
          </h1>

          <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            In tokenized equities, risk is multidimensional. MITIGATOR synthesizes oracle health, AMM liquidity, off-hours TradFi divergence, and Token-2022 security into a single 0–100 Trade Readiness Score.
          </p>
        </div>
      </section>

      {/* The 8 Factors Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">The 8 Quantitative Risk Factors</h2>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Every factor is continuously calculated in real time using canonical on-chain and regulatory inputs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {EIGHT_FACTORS.map((factor) => {
            const Icon = factor.icon;
            return (
              <GlassPanel key={factor.num} className="p-4 sm:p-5 space-y-3 hover:border-primary/40 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      Factor {factor.num}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">Weight: {factor.weight}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug">{factor.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{factor.desc}</p>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Real-Time Monitored</span>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </section>

      {/* Risk Scoring Bands & Defense */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-card/25 border-y border-border/40">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-2.5 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">Score Bands &amp; Automated Guardrails</h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
              How MITIGATOR automatically adjusts trade execution rules according to the asset's risk score.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400">80 – 100</span>
              <h4 className="text-sm font-bold text-foreground">Prime Readiness</h4>
              <p className="text-xs text-muted-foreground">Tight spreads, fresh oracles, normal market hours. Single market order allowed.</p>
            </div>
            <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-500/10 space-y-2">
              <span className="text-xs font-mono font-bold text-teal-400">60 – 79</span>
              <h4 className="text-sm font-bold text-foreground">Moderate Caution</h4>
              <p className="text-xs text-muted-foreground">Slight liquidity skew or minor divergence. DCA tranche staging recommended.</p>
            </div>
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">40 – 59</span>
              <h4 className="text-sm font-bold text-foreground">Elevated Risk</h4>
              <p className="text-xs text-muted-foreground">Off-market hours divergence or earnings blackout window. 0.50% slippage cap enforced.</p>
            </div>
            <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 space-y-2">
              <span className="text-xs font-mono font-bold text-rose-400">0 – 39</span>
              <h4 className="text-sm font-bold text-foreground">High Hazard</h4>
              <p className="text-xs text-muted-foreground">Stale oracle or deep AMM liquidity imbalance. Automated circuit breaker engaged.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Defense for Judges */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
        <GlassPanel className="p-5 sm:p-8 space-y-4 border-primary/30 bg-gradient-to-r from-primary/5 via-card/50 to-primary/5">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Stocklana Hackathon 2026 Defense</span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-foreground">
            Why Tokenized Equities on Solana Demand MITIGATOR
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            As Real-World Assets (RWAs) migrate to Solana, the primary hazard for retail and institutional traders is the structural friction between traditional Wall Street hours (closed weekends, T+1 settlement) and Solana's continuous 24/7/365 atomic market. Without active divergence detection and oracle staleness caps, traders fall prey to predatory arbitrage skews and off-hours liquidity traps. MITIGATOR solves this foundational vulnerability.
          </p>
        </GlassPanel>
      </section>

      {/* CTA Box */}
      <section className="py-14 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-primary/30 bg-card/60 p-6 sm:p-8 md:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Audit Any Tokenized Stock Risk Score Live
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Open the MITIGATOR terminal to inspect factor weights, oracle latency, and historical divergence charts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <Link
              href="/discover"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
