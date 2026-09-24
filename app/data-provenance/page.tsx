'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Database,
  CheckCircle2,
  Lock,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { cn } from '@/lib/utils';

const SEVEN_TIERS = [
  {
    tier: 'Tier 1: Canonical',
    color: 'emerald',
    badge: 'CANONICAL',
    sources: 'Pyth Hermes Oracle, Solana Validator RPCs, Token-2022 State',
    desc: 'Cryptographically signed on-chain state with validator consensus. Provides price updates with millisecond timestamps and explicit ±$confidence intervals.',
    weight: '100% Deterministic',
  },
  {
    tier: 'Tier 2: Primary',
    color: 'teal',
    badge: 'PRIMARY',
    sources: 'SEC EDGAR (10-K, 10-Q, 8-K), Dinari 1:1 Custody Attestations',
    desc: 'Audited regulatory submissions and verified custodial reserve attestations directly from primary asset custodians and government registries.',
    weight: 'Audited Truth',
  },
  {
    tier: 'Tier 3: Verified',
    color: 'cyan',
    badge: 'VERIFIED',
    sources: 'Bloomberg Feeds, Finviz, Official Exchange Market Schedules',
    desc: 'Institutional financial market feeds used to corroborate corporate action dates, trading hours, and cross-market price references.',
    weight: 'Cross-Referenced',
  },
  {
    tier: 'Tier 4: Executable',
    color: 'blue',
    badge: 'EXECUTABLE',
    sources: 'Jupiter v6 Route API, Raydium CLMM, Meteora DLMM',
    desc: 'Active on-chain liquidity depth and price quotes that can be executed atomically inside a single Solana transaction.',
    weight: 'Live Liquidity',
  },
  {
    tier: 'Tier 5: Secondary',
    color: 'amber',
    badge: 'SECONDARY',
    sources: 'Financial Wire Releases, Earnings Call Transcripts',
    desc: 'Secondary news reporting and media coverage. Ingested for context, but never allowed to alter quantitative risk scores without Tier 1 or Tier 2 verification.',
    weight: 'Informational',
  },
  {
    tier: 'Tier 6: Social',
    color: 'purple',
    badge: 'SOCIAL',
    sources: 'X/Twitter Sentiment, Reddit Community Channels',
    desc: 'Natural language sentiment and retail chatter. Useful for monitoring speculative hype cycles, but isolated from execution guardrails.',
    weight: 'Sentiment Only',
  },
  {
    tier: 'Tier 7: Unconfirmed',
    color: 'rose',
    badge: 'UNCONFIRMED',
    sources: 'Anonymous Forum Rumors, Unverified Social Claims',
    desc: 'Raw internet rumors. Automatically tagged with prominent hazard warnings and blocked from triggering any automated trading action.',
    weight: 'Isolated / Flagged',
  },
];

export default function PublicProvenancePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <PublicNav />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Cryptographic Transparency · 7-Tier Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto">
            Zero Hallucinations.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              100% Corroborated Data.
            </span>
          </h1>

          <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Every data point powering MITIGATOR carries an immutable provenance stamp. No high-impact trading decision or risk rating is ever derived from unverified rumors.
          </p>
        </div>
      </section>

      {/* The 7 Tiers Hierarchy */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">The 7-Tier Data Provenance Hierarchy</h2>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            From cryptographically signed Pyth validator oracles down to isolated social signals.
          </p>
        </div>

        <div className="space-y-3">
          {SEVEN_TIERS.map((tier, idx) => (
            <GlassPanel
              key={tier.tier}
              className="p-4 sm:p-5 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="text-xs font-bold text-foreground font-mono">{tier.tier}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-secondary border border-border">
                    {tier.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tier.desc}
                </p>
                <div className="text-[11px] font-mono text-zinc-400 break-words">
                  <span className="text-muted-foreground">Sources: </span>
                  {tier.sources}
                </div>
              </div>

              <div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-border/40 shrink-0">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">{tier.weight}</span>
                <span className="text-[10px] text-muted-foreground">Verification Rank #{idx + 1}</span>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Cross-Corroboration Logic */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-card/25 border-y border-border/40">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-center">
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-foreground">
            The Golden Rule of MITIGATOR Data Provenance
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            DeFi protocols frequently suffer from oracle manipulation and social rumor front-running. In MITIGATOR, an alert or risk-band downgrade can only execute if corroborated by at least one Tier 1 (Canonical) or Tier 2 (Primary) source. Social and secondary claims remain strictly labeled and cannot trigger automated trade actions.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-primary/30 bg-card/60 p-6 sm:p-8 md:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
            Inspect Provenance Hashes Live in Terminal
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            View live cryptographic audit proofs, Pyth publisher slot numbers, and SEC submission timestamps.
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
