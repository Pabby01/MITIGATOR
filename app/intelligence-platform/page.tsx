'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Search,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Database,
  Lock,
} from 'lucide-react';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { GlassPanel } from '@/components/shared/GlassPanel';

const SAMPLE_FILINGS = [
  {
    ticker: 'NVDAx',
    company: 'NVIDIA Corporation',
    form: 'Form 4',
    date: '2026-09-22',
    description: 'Statement of Changes in Beneficial Ownership of Securities',
    tier: 'PRIMARY' as const,
    cik: '0001045810',
    impact: 'Executive stock grant disposition. Regular trading plan compliant.',
  },
  {
    ticker: 'TSLAx',
    company: 'Tesla, Inc.',
    form: '10-Q',
    date: '2026-08-14',
    description: 'Quarterly Report for the Period Ended June 30',
    tier: 'PRIMARY' as const,
    cik: '0001318605',
    impact: 'Automotive regulatory credits up 14% QoQ. Energy storage margin expansion.',
  },
  {
    ticker: 'AAPLx',
    company: 'Apple Inc.',
    form: '8-K',
    date: '2026-09-08',
    description: 'Current Report: Material Corporate Announcement',
    tier: 'PRIMARY' as const,
    cik: '0000320193',
    impact: 'Special product launch event confirmed. Dividend distribution scheduled.',
  },
];

const AGENT_SWARM = [
  {
    name: 'Pre-Trade Guardian',
    role: 'Real-Time Sanity Checker',
    desc: 'Intercepts large market orders before broadcast. Simulates slippage against live AMM depth and validates that the token price is within ±15 bps of TradFi NAV.',
    badge: 'Execution Guard',
  },
  {
    name: 'Oracle Staleness Sentinel',
    role: 'Heartbeat Monitor',
    desc: 'Continuously queries the Pyth Hermes gateway for publisher latency. Triggers automatic trading circuit-breakers if latency exceeds 60,000ms or confidence interval widens beyond 1.5%.',
    badge: 'Pyth Health',
  },
  {
    name: 'SEC EDGAR XBRL Extractor',
    role: 'Audited Truth Ingestion',
    desc: 'Parses raw SEC submissions to verify corporate share counts, voting rights, and legal custody disclosures directly from government registries.',
    badge: 'Tier 1 Primary',
  },
  {
    name: 'Liquidity & Route Optimizer',
    role: 'Cross-Venue Routing',
    desc: 'Splits trade tranches across Jupiter v6, Raydium CLMM, and Meteora DLMM pools. Computes optimal DCA intervals for positions over $2,500.',
    badge: 'DEX Efficiency',
  },
];

export default function PublicIntelligencePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <PublicNav />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-background to-background" />

        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <Brain className="h-3.5 w-3.5" />
            <span>AI-Driven Pre-Trade Intelligence · Zero Hallucinations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto">
            Institutional Truth.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Verified Before You Trade.
            </span>
          </h1>

          <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            MITIGATOR unites raw SEC EDGAR government filings, Pyth cryptographic oracles, and autonomous AI agents to give Solana tokenized equity traders verifiable market intelligence.
          </p>
        </div>
      </section>

      {/* SEC EDGAR Official Pipeline */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              <span>Direct Government Ingestion</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mt-1">
              SEC EDGAR Filings Pipeline (Tier 1 Primary Data)
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Unlike generic LLM wrappers that fabricate financial statistics, MITIGATOR streams directly from the U.S. Securities &amp; Exchange Commission CIK registry.
            </p>
          </div>
          <Link
            href="/discover"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline self-start md:self-auto"
          >
            <span>Query Live Filings in Terminal</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Filings Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SAMPLE_FILINGS.map((filing) => (
            <GlassPanel key={filing.ticker} className="p-4 sm:p-5 space-y-3 border-border/70 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/15 text-primary border border-primary/25">
                  {filing.form}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">{filing.date}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground font-mono">{filing.ticker} — {filing.company}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{filing.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 text-[11px] leading-relaxed text-zinc-300">
                <span className="font-semibold text-cyan-400">MITIGATOR Synthesis: </span>
                {filing.impact}
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>CIK #{filing.cik}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> SEC Authenticated
                </span>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Autonomous AI Agent Swarm Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-card/25 border-y border-border/40">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-2.5 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Autonomous AI Agent Swarm Architecture
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
              Four specialized agent workers run continuous micro-evaluations across Solana liquidity pools and TradFi feeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AGENT_SWARM.map((agent) => (
              <GlassPanel key={agent.name} className="p-4 sm:p-5 space-y-3 hover:border-cyan-500/30 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{agent.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-mono">{agent.role}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-secondary border border-border text-foreground font-medium shrink-0">
                    {agent.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {agent.desc}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-card/70 to-emerald-500/5 p-6 sm:p-8 md:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
            Experience Live AI Due Diligence &amp; Alert Feeds
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Test the live intelligence scanner in our web terminal with zero setup.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <Link
              href="/discover"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
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
