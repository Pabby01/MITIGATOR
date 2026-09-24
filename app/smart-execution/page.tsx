'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  TrendingDown,
  Repeat,
  Sliders,
  ExternalLink,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { GlassPanel } from '@/components/shared/GlassPanel';

const EXECUTION_PILLARS = [
  {
    title: 'Jupiter v6 Aggregation & DLMM Routing',
    desc: 'Automatically splits orders across Meteora DLMM discrete price bins and Raydium CLMM concentrated liquidity pools to capture the tightest spread and lowest gas fee.',
    badge: 'Multi-DEX',
    stat: '0.04%',
    statLabel: 'Avg Slippage',
  },
  {
    title: 'Automated DCA Tranche Staging',
    desc: 'For orders larger than $2,000, MITIGATOR recommends splitting entry into an immediate 37.5% base fill and three staged 20.8% tranches to prevent market impact spikes.',
    badge: 'Guardrail',
    stat: '3 Tranches',
    statLabel: 'Staged Entry',
  },
  {
    title: 'Dynamic Slippage Caps (Anti-MEV)',
    desc: 'Calculates asset-specific liquidity thresholds. Enforces a strict 0.15% to 0.50% slippage ceiling to protect users against predatory sandwich attacks and front-running.',
    badge: 'Protection',
    stat: '0.50%',
    statLabel: 'Max Hard Cap',
  },
  {
    title: 'Real Solana Devnet Settlement',
    desc: 'Transactions are broadcast directly to Solana Devnet validators via official RPCs, utilizing the Solana Memo program to stamp cryptographic audit hashes on-chain.',
    badge: 'Verifiable',
    stat: '~400ms',
    statLabel: 'Confirmation',
  },
];

export default function PublicExecutionPage() {
  const [orderSize, setOrderSize] = useState(5000);

  const immediateFill = Math.round(orderSize * 0.375);
  const stagedFill = Math.round(orderSize * 0.625);
  const estimatedSlippage = (0.04 * (orderSize / 1000)).toFixed(2);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <PublicNav />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />

        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Smart Routing &amp; Risk Guardrails</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto">
            Institutional Execution.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Zero Price Impact.
            </span>
          </h1>

          <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Execute tokenized equities on Solana with algorithmic DCA order staging, cross-venue DLMM routing across Jupiter v6, and automated slippage caps.
          </p>
        </div>
      </section>

      {/* Interactive Staging Simulator */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <GlassPanel className="p-5 sm:p-8 space-y-5 sm:space-y-6 border-primary/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Interactive DCA Guardrail Simulator</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Drag to see how MITIGATOR automatically splits large orders into staged tranches to safeguard execution price.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/25 self-start sm:self-auto">
              Order Size: ${orderSize.toLocaleString()}
            </span>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="500"
              max="25000"
              step="500"
              value={orderSize}
              onChange={(e) => setOrderSize(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>$500</span>
              <span>$10,000</span>
              <span>$25,000</span>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-400">Unprotected Raw Market Order</span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">${orderSize.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Executed in one single swap. AMM pool takes full price impact.</p>
              <div className="pt-2 text-xs font-mono text-rose-400">
                Estimated Slippage: ~{estimatedSlippage}%
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">MITIGATOR Staged Route</span>
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">${immediateFill.toLocaleString()}</span>
                <span className="text-xs font-mono text-muted-foreground">Now (37.5%)</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 sm:ml-2">${stagedFill.toLocaleString()}</span>
                <span className="text-xs font-mono text-muted-foreground">DCA (62.5%)</span>
              </div>
              <p className="text-xs text-muted-foreground">Staged over 3 tranches with dynamic 0.50% maximum slippage cap.</p>
              <div className="pt-2 text-xs font-mono text-emerald-400">
                Max Price Impact: &lt; 0.05%
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* 4 Pillars Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">Execution Engine Architecture</h2>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Built on Jupiter v6, Raydium CLMM, and Meteora DLMM with real on-chain cryptographic settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXECUTION_PILLARS.map((pillar) => (
            <GlassPanel key={pillar.title} className="p-5 sm:p-6 space-y-4 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{pillar.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {pillar.badge}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">{pillar.statLabel}</span>
                <span className="font-bold text-emerald-400">{pillar.stat}</span>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-emerald-500/30 bg-card/60 p-6 sm:p-8 md:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
            Execute With Live Solana Devnet Wallets
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Test smart routing, simulate paper trades with $100k virtual cash, or sign real transactions on Devnet.
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
