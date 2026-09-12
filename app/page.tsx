'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Users,
  Brain,
  ArrowRight,
  Activity,
  CheckCircle2,
  Globe,
  Layers,
  Target,
  Eye,
  Wallet,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Sliders,
  Clock,
} from 'lucide-react';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { GlassPanel, MetricCard } from '@/components/shared/GlassPanel';
import { SourceBadge, RiskBadge } from '@/components/shared/SourceBadge';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { AnimatedFactorBar } from '@/components/landing/AnimatedFactorBar';
import { getAllAssets } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const MarketUniverse = dynamic(
  () => import('@/components/three/MarketUniverse').then((m) => m.MarketUniverse),
  { ssr: false, loading: () => <div className="w-full h-full bg-background/50" /> }
);

const SimulatedTradeWindow = dynamic(
  () => import('@/components/landing/SimulatedTradeWindow').then((m) => m.SimulatedTradeWindow),
  { ssr: false }
);

const GsapScrollEffects = dynamic(
  () => import('@/components/landing/GsapScrollEffects').then((m) => m.GsapScrollEffects),
  { ssr: false }
);

const LiveExecutionRouter = dynamic(
  () => import('@/components/landing/LiveExecutionRouter').then((m) => m.LiveExecutionRouter),
  { ssr: false }
);

const InteractiveCtaSection = dynamic(
  () => import('@/components/landing/InteractiveCtaSection').then((m) => m.InteractiveCtaSection),
  { ssr: false }
);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const STEP_QUESTIONS = [
  {
    step: '01',
    title: 'What am I buying?',
    subtitle: 'Underlying Equity vs Tokenized Solana Mint',
    desc: 'Tokenized stocks bridge equity markets with Solana composability. MITIGATOR inspects canonical issuer backing, proof-of-reserves, and corporate-action multipliers so you know the exact asset backing your token.',
    tags: ['Canonical Issuer: xStocks', 'Backing: 1:1 Inspected', 'Multiplier: 1.00x'],
    metric: { label: 'Token Integrity', value: '98.4%', status: 'Audited' },
  },
  {
    step: '02',
    title: 'What could go wrong?',
    subtitle: 'Oracle Staleness, Liquidity & Event Risk',
    desc: 'TradFi equity markets close at 4:00 PM EST, but Solana trades 24/7. MITIGATOR monitors oracle confidence intervals, AMM depth, upcoming earnings, and off-market hours divergence before you trade.',
    tags: ['Pyth Hermes Oracle', 'Weekend Divergence Flag', 'Earnings Blackout'],
    metric: { label: 'Oracle Staleness', value: '0.4s', status: 'Healthy' },
  },
  {
    step: '03',
    title: 'How confident are we?',
    subtitle: 'Multi-Source Provenance & Corroboration',
    desc: 'Every piece of market data carries an explicit provenance tier (Canonical, Primary, Verified, Social). High-impact claims are cross-checked across SEC EDGAR, Bloomberg feeds, and primary issuers before alerting.',
    tags: ['SEC EDGAR XBRL', 'No Hallucinations', 'Tiered Verification'],
    metric: { label: 'Data Confidence', value: '94.2%', status: 'Corroborated' },
  },
  {
    step: '04',
    title: 'How do I mitigate the risk?',
    subtitle: 'Automated Position Sizing & DCA Guardrails',
    desc: 'Risk does not mean do not trade. MITIGATOR dynamically calculates your portfolio concentration, estimates price impact, and recommends staging large orders with DCA and slippage ceilings.',
    tags: ['DCA Staging', '0.50% Slippage Cap', 'Jupiter Best Route'],
    metric: { label: 'Recommended DCA', value: '62.5%', status: 'Active' },
  },
];

export default function LandingPage() {
  const assets = getAllAssets();
  const [activeStep, setActiveStep] = useState(0);
  const [tradeAmount, setTradeAmount] = useState(2000);
  const [tradeDca, setTradeDca] = useState(true);

  const dcaInitial = tradeDca ? Math.round(tradeAmount * 0.375) : tradeAmount;
  const dcaStaged = tradeDca ? Math.round(tradeAmount * 0.625) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* GSAP Scroll Trigger Controller */}
      <GsapScrollEffects />

      {/* ─── TOP NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo size={30} glow withText textSize="text-lg" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/discover" className="hover:text-foreground transition-colors">Markets</Link>
          <Link href="/intelligence" className="hover:text-foreground transition-colors">Intelligence</Link>
          <Link href="/risk" className="hover:text-foreground transition-colors">Risk Engine</Link>
          <Link href="/execution" className="hover:text-foreground transition-colors">Execution</Link>
          <Link href="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
          <Link href="/provenance" className="hover:text-foreground transition-colors">Provenance</Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/discover"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/50 px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-card transition-all"
          >
            <Wallet className="h-4 w-4 text-primary" />
            Connect
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4.5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
          >
            Launch App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* ─── 3D HERO SECTION ─── */}
      <section className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
        <div className="absolute inset-0 mesh-gradient-ambient pointer-events-none" />

        {/* 3D WebGL Canvas Layer */}
        <div className="absolute inset-0 z-0">
          <MarketUniverse className="w-full h-full" interactive={true} />
        </div>

        {/* Top/Bottom Soft Gradient Fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl relative p-6 sm:p-8 md:p-10 rounded-3xl hero-text-scrim">
            {/* Subtle inner accent glow */}
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Hackathon Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/60 px-3.5 py-1.5 backdrop-blur-md shadow-lg"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-emerald-300">STOCKLANA 2026 • SOLANA TOKENIZED STOCKS</span>
            </motion.div>

            {/* Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.95] text-foreground"
            >
              KNOW THE RISK.
              <br />
              <span className="text-gradient-primary">BEFORE YOU TRADE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl"
            >
              AI-powered pre-trade intelligence, multi-factor risk analysis, automated mitigation guardrails, and execution routing for tokenized equities on Solana.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-3.5"
            >
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-xl shadow-primary/25"
              >
                Explore Markets
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/risk"
                className="inline-flex items-center justify-center gap-2 rounded-xl hairline-card px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-all"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Simulate Risk
              </Link>
            </motion.div>
          </div>

          {/* Monie-Style 3 Floating Hero Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="hairline-card rounded-2xl p-5 group hover:border-emerald-500/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">01 / DISCOVERY</span>
                <Globe className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-foreground">Verified Asset Constellation</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                7 institutional tokenized equities tracked live with canonical issuer metadata, backing verification, and Pyth oracle feeds.
              </p>
            </div>

            <div className="hairline-card rounded-2xl p-5 group hover:border-cyan-500/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">02 / ANALYSIS</span>
                <Brain className="h-4 w-4 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-foreground">8-Factor MITIGATOR Score</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Proprietary 0–100 trade readiness index weighting market quality, fundamentals, event risk, onchain liquidity, and portfolio fit.
              </p>
            </div>

            <div className="hairline-card rounded-2xl p-5 group hover:border-amber-500/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">03 / EXECUTION</span>
                <Zap className="h-4 w-4 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-foreground">Guardrail Execution Router</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Smart order splitting, automated DCA recommendations, and cross-venue quote comparisons across Jupiter, Orca, and Raydium.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── LIVE RUNNING TICKER MARQUEE ─── */}
      <section className="relative border-y border-border/50 bg-card/20 backdrop-blur-md overflow-hidden py-3">
        <div className="animate-marquee flex items-center gap-8">
          {[...assets, ...assets].map((asset, i) => (
            <Link
              key={`${asset.tokenizedAsset.symbol}-${i}`}
              href={`/market/${asset.tokenizedAsset.symbol}`}
              className="flex items-center gap-3 px-3 py-1 rounded-lg hover:bg-white/5 transition-colors group flex-shrink-0"
            >
              <span className="font-bold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
                {asset.tokenizedAsset.symbol}
              </span>
              <span className="text-xs font-mono tabular-nums text-muted-foreground">
                ${asset.quote.price.toFixed(2)}
              </span>
              <span className={cn('text-xs font-mono font-semibold', asset.quote.changePct24h >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                {asset.quote.changePct24h >= 0 ? '+' : ''}{asset.quote.changePct24h.toFixed(2)}%
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border/70 text-zinc-300">
                SCORE {asset.riskScore.overall}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── SECTION 1: THE PROBLEM (MONIE-STYLE INTERACTIVE STORYTELLING) ─── */}
      <section className="relative py-28 px-6 border-b border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono font-semibold tracking-widest text-primary uppercase">The Information Problem</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
              Trading is easy.<br />Knowing what you&apos;re trading isn&apos;t.
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Tokenized stocks merge Wall Street equities with Solana DeFi. But they also introduce combined failure modes: oracle staleness, off-hours liquidity traps, unverified issuer claims, and onchain price divergence.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Vertical Step Selector */}
            <div className="lg:col-span-6 space-y-3">
              {STEP_QUESTIONS.map((q, idx) => (
                <div
                  key={q.step}
                  onClick={() => setActiveStep(idx)}
                  className={cn(
                    'cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden',
                    activeStep === idx
                      ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/5'
                      : 'border-border/60 hover:border-border bg-card/30'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <span className={cn(
                      'font-mono text-sm font-bold px-2 py-0.5 rounded',
                      activeStep === idx ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      {q.step}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{q.title}</h3>
                      <p className="text-xs font-medium text-primary mt-0.5">{q.subtitle}</p>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{q.desc}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {q.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border/80 text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Dynamic Live Preview Card */}
            <div className="lg:col-span-6 sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassPanel className="p-7 hairline-card rounded-3xl space-y-6">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">DEEP INSPECTION</p>
                          <h4 className="text-base font-bold">{STEP_QUESTIONS[activeStep].title}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-mono">{STEP_QUESTIONS[activeStep].metric.label}</p>
                        <p className="text-lg font-bold tabular-nums text-emerald-400">
                          {STEP_QUESTIONS[activeStep].metric.value}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-card/60 border border-border/70">
                        <span className="text-muted-foreground">Target Security</span>
                        <p className="text-sm font-bold mt-1 text-foreground">NVDAx (NVIDIA)</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-card/60 border border-border/70">
                        <span className="text-muted-foreground">Verification Layer</span>
                        <p className="text-sm font-bold mt-1 text-emerald-400">Canonical Tier 0</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border border-border/40">
                        <span className="text-muted-foreground">Oracle Verification</span>
                        <span className="font-mono text-emerald-400">Pyth Hermes 0.4s Staleness</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border border-border/40">
                        <span className="text-muted-foreground">TradFi Market State</span>
                        <span className="font-mono text-cyan-400">Active · 24/7 Solana Secondary</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border border-border/40">
                        <span className="text-muted-foreground">Corporate Split Multiplier</span>
                        <span className="font-mono text-foreground">1.0000x (No adjustment)</span>
                      </div>
                    </div>

                    <Link
                      href="/discover"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Audit Full Model in App <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </GlassPanel>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: INTELLIGENCE ACROSS 7 DIMENSIONS ─── */}
      <section className="relative py-28 px-6 border-b border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono font-semibold tracking-widest text-primary uppercase">Multi-Dimensional Data</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
              Every angle of every asset.<br />Before you commit.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              MITIGATOR synthesizes data from canonical issuers, primary SEC filings, live Pyth oracles, onchain Solana orderbooks, and corroborating social signals.
            </p>
          </div>

          <div id="dimension-container" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
            {[
              { icon: TrendingUp, label: 'Market Depth', tier: 'VERIFIED' as const, desc: 'Real-time orderbooks' },
              { icon: Layers, label: 'Fundamentals', tier: 'CANONICAL' as const, desc: 'P/E, Beta, Earnings' },
              { icon: Globe, label: 'News Wires', tier: 'PRIMARY' as const, desc: 'Corroborated news' },
              { icon: Users, label: 'Social Sentiment', tier: 'SOCIAL' as const, desc: 'Reputation-scored' },
              { icon: Activity, label: 'Onchain Liquidity', tier: 'CANONICAL' as const, desc: 'Raydium & Orca' },
              { icon: Target, label: 'Corporate Catalysts', tier: 'PRIMARY' as const, desc: 'Splits & Dividends' },
              { icon: ShieldCheck, label: 'Portfolio Fit', tier: 'VERIFIED' as const, desc: 'Correlation analysis' },
            ].map((item, i) => (
              <GlassPanel key={i} hover className="dimension-box p-4.5 text-center hairline-card rounded-2xl">
                <div className="mx-auto rounded-xl bg-primary/10 p-2.5 w-fit">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">{item.label}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{item.desc}</p>
                <div className="mt-3 flex justify-center">
                  <SourceBadge tier={item.tier} />
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 2.5: ARCHITECTURE & TELEMETRY SHOWCASE (GENERATED IMAGES) ─── */}
      <section id="showcase-section" style={{ perspective: 1400 }} className="relative py-28 px-6 border-b border-border/30 overflow-hidden bg-card/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono text-primary mb-3">
              <Sparkles className="h-3 w-3" /> INSTITUTIONAL ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Designed for Solana. <span className="text-gradient-primary">Engineered for Capital.</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Explore MITIGATOR&apos;s dual-engine interface: real-time institutional multi-factor risk radar and 1:1 cryptographic collateral vaults.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Image Card 1 */}
            <div className="showcase-card-left hairline-card rounded-3xl overflow-hidden p-3.5 border border-white/10 flex flex-col justify-between group">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] w-full bg-card/60">
                <img
                  src="/images/terminal-preview.jpg"
                  alt="MITIGATOR 3D Institutional Risk Radar Terminal"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/30 text-xs font-mono text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Risk Radar Terminal
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-foreground">Multi-Factor Risk Radar &amp; Telemetry</h3>
                  <span className="text-xs font-mono text-primary font-bold">8 Dimensions</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Continuous multi-source telemetry monitoring Pyth Hermes oracle freshness, AMM liquidity depth across Raydium &amp; Orca, and off-market hours divergence.
                </p>
              </div>
            </div>

            {/* Image Card 2 */}
            <div className="showcase-card-right hairline-card rounded-3xl overflow-hidden p-3.5 border border-white/10 flex flex-col justify-between group">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] w-full bg-card/60">
                <img
                  src="/images/vault-preview.jpg"
                  alt="Solana Tokenized Stock Cryptographic Collateral Vault"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  Token-2022 Verified Vaults
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-foreground">Cryptographic Collateral Reserve</h3>
                  <span className="text-xs font-mono text-cyan-400 font-bold">1:1 Backed</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time custodian attestation matching onchain token supply with prime broker collateral holdings. Instant redemption rails with sub-second finality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: MITIGATOR SCORE (8-FACTOR MODEL) ─── */}
      <section className="relative py-28 px-6 border-b border-border/30 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono font-semibold tracking-widest text-primary uppercase">Signature Algorithm</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
                One number. Eight factors.<br />Total clarity.
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                The MITIGATOR Score (0–100) eliminates emotional trading by objectively computing trade readiness across eight distinct, transparently-weighted risk dimensions.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { label: 'Market Quality & Spread', weight: '15%', score: 86 },
                  { label: 'Fundamental / Business Health', weight: '15%', score: 88 },
                  { label: 'News & Sentiment Corroboration', weight: '15%', score: 78 },
                  { label: 'Event / Catalyst Risk', weight: '10%', score: 62 },
                  { label: 'Liquidity & Execution Depth', weight: '15%', score: 91 },
                  { label: 'Token / Onchain Backing Integrity', weight: '15%', score: 94 },
                  { label: 'Portfolio Concentration Fit', weight: '10%', score: 74 },
                  { label: 'Data Confidence & Provenance', weight: '5%', score: 95 },
                ].map((f, i) => (
                  <AnimatedFactorBar
                    key={i}
                    index={i}
                    label={f.label}
                    weight={f.weight}
                    score={f.score}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 hairline-card p-10 rounded-3xl">
              <ScoreRing score={84} size={220} strokeWidth={14} />
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                <RiskBadge level="moderate" />
                <span className="text-muted-foreground">Confidence: <strong className="text-foreground font-mono">87%</strong></span>
                <span className="text-muted-foreground">Trend: <strong className="text-emerald-400 font-mono">+2 pts</strong></span>
                <span className="text-muted-foreground">Asset: <strong className="text-foreground">NVDAx</strong></span>
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-sm">
                Score indicates robust liquidity and backing integrity, with caution advised around upcoming earnings volatility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: INTERACTIVE MITIGATION SIMULATOR ─── */}
      <section className="relative py-28 px-6 border-b border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono font-semibold tracking-widest text-primary uppercase">Active Risk Mitigation</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
              Risk doesn&apos;t mean don&apos;t trade.<br />It means trade smarter.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Drag the proposed trade size below to simulate how MITIGATOR dynamically re-engineers your order to protect against front-running, high slippage, and concentration shocks.
            </p>
          </div>

          <GlassPanel className="p-6 md:p-8 max-w-3xl mx-auto hairline-card rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
              <div>
                <span className="text-xs font-mono text-muted-foreground uppercase">SIMULATED ASSET</span>
                <h3 className="text-xl font-bold">Buy NVDAx (NVIDIA Tokenized Equity)</h3>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-muted-foreground font-mono">REFERENCE PRICE</span>
                <p className="text-xl font-bold font-mono">$184.22 USD</p>
              </div>
            </div>

            {/* Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-muted-foreground">PROPOSED ORDER SIZE:</span>
                <span className="text-base font-bold text-primary">${tradeAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-border accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>$500</span>
                <span>$5,000</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Mitigation Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Unmitigated Entry</span>
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold font-mono">${tradeAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Single market order · High price impact risk</p>
                <p className="text-xs text-amber-400 font-mono mt-3">Est. Slippage: ~{(0.12 * (tradeAmount / 1000)).toFixed(2)}%</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">MITIGATOR Guardrail</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold font-mono text-emerald-400">${dcaInitial.toLocaleString()}</p>
                  <span className="text-xs text-muted-foreground font-mono">NOW</span>
                  <p className="text-2xl font-bold font-mono text-cyan-400 ml-2">${dcaStaged.toLocaleString()}</p>
                  <span className="text-xs text-muted-foreground font-mono">DCA (3x)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Staged execution · Slippage capped at 0.50%</p>
                <p className="text-xs text-emerald-400 font-mono mt-3">Max Price Impact: &lt; 0.05%</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['Position Sizing Guard', 'DCA 3-Tranche Split', 'Max Slippage 0.50%', 'Jupiter V6 Routing', 'Earnings Event Aware'].map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-zinc-300">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {tag}
                </span>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ─── SECTION 5: DYNAMIC LIVE EXECUTION ROUTER (MOVING FIGURES & AUTO-SORTING BEST ROUTE) ─── */}
      <LiveExecutionRouter />

      {/* ─── INTERACTIVE 3D SIMULATED TRADE COCKPIT ─── */}
      <div data-gsap="fade-up">
        <SimulatedTradeWindow />
      </div>

      {/* ─── SECTION 6: INTERACTIVE TYPEWRITER CTA & CURSOR-REACTIVE GLOW ─── */}
      <InteractiveCtaSection />

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/40 py-10 px-6 bg-card/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandLogo size={24} glow />
            <span className="text-sm font-bold tracking-tight">MITIGATOR</span>
            <span className="text-xs text-muted-foreground">· Built for Stocklana 2026</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Decentralized intelligence &amp; risk platform. Non-custodial. Not financial advice.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/provenance" className="hover:text-foreground transition-colors">Provenance</Link>
            <Link href="/risk" className="hover:text-foreground transition-colors">Risk Methodology</Link>
            <Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
