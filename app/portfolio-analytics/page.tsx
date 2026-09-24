'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { GlassPanel } from '@/components/shared/GlassPanel';

const PORTFOLIO_FEATURES = [
  {
    title: 'Real-Time Mark-to-Market',
    desc: 'Values all tokenized equities using streaming Pyth Hermes canonical prices with sub-second latency, avoiding stale AMM pool distortions.',
    badge: 'Pyth Hermes',
  },
  {
    title: 'Sector & Concentration Guardrails',
    desc: 'Calculates portfolio exposure across Mega-Cap Tech, Index ETFs, and Pre-IPOs. Flags dangerous overconcentration before you add more risk.',
    badge: 'Risk Engine',
  },
  {
    title: '$100k Virtual Paper Sandbox',
    desc: 'Hone trading strategies and test execution routing with zero capital risk in our full-fidelity simulated order engine.',
    badge: 'Zero Risk',
  },
  {
    title: 'Multi-Wallet Aggregation',
    desc: 'Connect Solflare, Phantom, or Backpack. View aggregate on-chain tokenized equities and claimable dividends across multiple addresses.',
    badge: 'Solana Native',
  },
];

export default function PublicPortfolioPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <PublicNav />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-background to-background" />

        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-400">
            <Wallet className="h-3.5 w-3.5" />
            <span>Real-Time Portfolio Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto">
            Solana Portfolio Health.{' '}
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              Audited in Real Time.
            </span>
          </h1>

          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Monitor mark-to-market valuations, sector exposure skews, and risk concentrations across all tokenized US equities in your Solana wallet.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PORTFOLIO_FEATURES.map((feat) => (
            <GlassPanel key={feat.title} className="p-6 space-y-3 hover:border-teal-500/30 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">{feat.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {feat.badge}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feat.desc}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Integrated in Terminal</span>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-teal-500/30 bg-card/60 p-8 md:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-black text-foreground">
            Connect Your Wallet or Trade Paper Risk-Free
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Launch the MITIGATOR terminal to track real positions or execute virtual paper trades.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              href="/discover"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
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
