'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
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
} from 'lucide-react';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { GlassPanel, MetricCard } from '@/components/shared/GlassPanel';
import { SourceBadge, RiskBadge } from '@/components/shared/SourceBadge';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { getAllAssets } from '@/lib/mock-data';

const MarketUniverse = dynamic(
  () => import('@/components/three/MarketUniverse').then((m) => m.MarketUniverse),
  { ssr: false, loading: () => null }
);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  index,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="max-w-2xl"
    >
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground text-lg leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

export default function LandingPage() {
  const assets = getAllAssets();

  return (
    <div className="min-h-screen bg-background">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-background/60 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight">MITIGATOR</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="/discover" className="hover:text-foreground transition-colors">Markets</Link>
          <Link href="/intelligence" className="hover:text-foreground transition-colors">Intelligence</Link>
          <Link href="/risk" className="hover:text-foreground transition-colors">Risk</Link>
          <Link href="/execution" className="hover:text-foreground transition-colors">Execution</Link>
          <Link href="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/discover"
            className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Connect Wallet
            <Wallet className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Launch App
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 radial-fade" />
        <div className="absolute inset-0">
          <MarketUniverse className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Built for Stocklana 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none"
            >
              MITIGATOR
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-gradient-primary"
            >
              Know the risk. Before you trade.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              AI-powered intelligence, risk analysis and execution for tokenized stocks on Solana.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] glow-primary"
              >
                Explore Markets
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-3 text-sm font-semibold backdrop-blur-sm hover:border-primary/30 transition-all">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
        >
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronRight className="h-3 w-3 rotate-90 animate-bounce" />
        </motion.div>
      </section>

      {/* ─── SECTION 1: THE PROBLEM ─── */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            index={0}
            eyebrow="The Problem"
            title="Trading is easy. Knowing what you're trading isn't."
            subtitle="Tokenized stocks bridge TradFi and DeFi. But they also introduce new layers of risk — oracle failures, liquidity gaps, onchain divergence, and unverified information."
          />

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { icon: AlertTriangle, title: 'What am I buying?', desc: 'Is the token fully backed? Who is the issuer? Is the oracle healthy? Is the underlying equity what you think it is?' },
              { icon: Eye, title: 'What could go wrong?', desc: 'Liquidity crunches, oracle staleness, event risk, concentration, correlation breakdown, and onchain price divergence.' },
              { icon: Brain, title: 'How confident is the data?', desc: 'Is this a verified SEC filing or a social media rumor? Is the price from a primary oracle or a secondary aggregator?' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <GlassPanel hover className="p-6 h-full">
                  <div className="rounded-lg bg-amber-500/10 p-2.5 w-fit">
                    <item.icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: INTELLIGENCE ─── */}
      <section className="relative py-24 md:py-32 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            index={0}
            eyebrow="Intelligence"
            title="Every angle of every asset. Before you commit."
            subtitle="MITIGATOR aggregates and cross-verifies data from canonical, primary, and social sources — then layers AI analysis on top."
          />

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { icon: TrendingUp, label: 'Market', tier: 'VERIFIED' as const },
              { icon: Layers, label: 'Fundamentals', tier: 'CANONICAL' as const },
              { icon: Globe, label: 'News', tier: 'VERIFIED' as const },
              { icon: Users, label: 'Social', tier: 'SOCIAL' as const },
              { icon: Activity, label: 'Onchain', tier: 'CANONICAL' as const },
              { icon: Target, label: 'Events', tier: 'PRIMARY' as const },
              { icon: ShieldCheck, label: 'Portfolio', tier: 'VERIFIED' as const },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <GlassPanel hover className="p-4 text-center">
                  <div className="mx-auto rounded-lg bg-primary/10 p-2.5 w-fit">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-sm font-medium">{item.label}</p>
                  <div className="mt-1.5 flex justify-center">
                    <SourceBadge tier={item.tier} />
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: MITIGATOR SCORE ─── */}
      <section className="relative py-24 md:py-32 px-6 border-t border-border/30 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                index={0}
                eyebrow="The MITIGATOR Score"
                title="One number. Eight factors. Total clarity."
                subtitle="A composite 0–100 score that weighs market quality, fundamentals, news, events, liquidity, token integrity, portfolio fit, and data confidence."
              />

              <div className="mt-8 space-y-3">
                {[
                  { label: 'Market Quality', weight: '15%' },
                  { label: 'Fundamental / Business', weight: '15%' },
                  { label: 'News & Sentiment', weight: '15%' },
                  { label: 'Event / Catalyst', weight: '10%' },
                  { label: 'Liquidity & Execution', weight: '15%' },
                  { label: 'Token / Onchain Integrity', weight: '15%' },
                  { label: 'Portfolio Fit', weight: '10%' },
                  { label: 'Data Confidence', weight: '5%' },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-8 rounded-full bg-primary/30" />
                      <span className="text-sm text-muted-foreground">{f.label}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground tabular-nums">{f.weight}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <ScoreRing score={84} size={200} strokeWidth={12} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <RiskBadge level="moderate" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Confidence: <span className="text-foreground font-medium">87%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Trend: <span className="text-emerald-400 font-medium">+2</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: MITIGATION ─── */}
      <section className="relative py-24 md:py-32 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            index={0}
            eyebrow="Risk Mitigation"
            title="Risk doesn't mean don't trade. It means trade smarter."
            subtitle="MITIGATOR doesn't just flag risk — it recommends actionable mitigation strategies before you execute."
          />

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12"
          >
            <GlassPanel className="p-6 md:p-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase">Example Trade</p>
                  <p className="mt-1 text-2xl font-bold">Buy $2,000 of NVDAx</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Current Price</p>
                  <p className="text-xl font-bold tabular-nums">$184.22</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-2">Initial Request</p>
                  <p className="text-2xl font-bold tabular-nums">$2,000</p>
                  <p className="text-sm text-muted-foreground mt-1">Single entry, no slippage cap</p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-2">MITIGATOR Recommends</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold tabular-nums text-emerald-400">$750</p>
                    <span className="text-sm text-muted-foreground">now</span>
                    <p className="text-2xl font-bold tabular-nums text-emerald-400 ml-2">$1,250</p>
                    <span className="text-sm text-muted-foreground">DCA</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Max slippage: 0.50% · Event awareness: enabled</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {['Smaller initial position', 'DCA over 3 entries', 'Max slippage 0.50%', 'Jupiter routing', 'Event blackout enabled'].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 5: EXECUTION ─── */}
      <section className="relative py-24 md:py-32 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            index={0}
            eyebrow="Execution"
            title="Route every trade to the best venue."
            subtitle="Compare indicative and executable quotes across Solana DEXs and RFQ providers. See spread, slippage, and price impact before you sign."
          />

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12"
          >
            <GlassPanel className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground tracking-wider uppercase">
                      <th className="text-left font-medium px-4 py-3">Venue</th>
                      <th className="text-right font-medium px-4 py-3">Expected Price</th>
                      <th className="text-right font-medium px-4 py-3">Spread</th>
                      <th className="text-right font-medium px-4 py-3">Slippage</th>
                      <th className="text-right font-medium px-4 py-3">Fee</th>
                      <th className="text-center font-medium px-4 py-3">Quote Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { venue: 'Jupiter', price: '$184.31', spread: '0.05%', slip: '0.08%', fee: '0.00%', type: 'Indicative', best: true },
                      { venue: 'Orca', price: '$184.37', spread: '0.08%', slip: '0.10%', fee: '0.20%', type: 'Indicative' },
                      { venue: 'Raydium', price: '$184.44', spread: '0.12%', slip: '0.15%', fee: '0.25%', type: 'Indicative' },
                      { venue: 'Meteora', price: '$184.40', spread: '0.10%', slip: '0.12%', fee: '0.22%', type: 'Indicative' },
                      { venue: 'xChange RFQ', price: '$184.28', spread: '0.03%', slip: '0.02%', fee: '0.10%', type: 'Executable' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          <div className="flex items-center gap-2">
                            {row.venue}
                            {row.best && <span className="text-[10px] text-emerald-400 font-semibold">BEST</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.price}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.spread}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.slip}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.fee}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${row.type === 'Executable' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                            {row.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 6: COMMUNITY ─── */}
      <section className="relative py-24 md:py-32 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            index={0}
            eyebrow="Community"
            title="Stock-specific discussion with built-in trust signals."
            subtitle="Every tokenized stock gets its own community timeline. AI-generated consensus, disagreement, and emerging narratives — clearly separated from verified fact."
          />

          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {[
              { author: 'QuantResearcher', handle: '@quant_research', type: 'Trade Idea', content: 'NVDAx showing strong momentum with RSI at 62. Blackwell cycle should drive sustained data center demand. 15-20% upside to next resistance.', sentiment: 'bullish', evidence: true },
              { author: 'MacroAnalyst', handle: '@macro_analyst', type: 'Analysis', content: 'Export restriction risk is real but overblown. Compliant variants are already shipping. Net impact to revenue is maybe 3-4%.', sentiment: 'bullish', evidence: true },
            ].map((post, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <GlassPanel hover className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30" />
                      <div>
                        <p className="text-sm font-medium">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.handle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-card border border-border">{post.type}</span>
                      <SourceBadge tier="SOCIAL" />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className={post.sentiment === 'bullish' ? 'text-emerald-400' : 'text-red-400'}>
                      {post.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}
                    </span>
                    {post.evidence && <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Evidence attached</span>}
                    <span>· 2h ago</span>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: PORTFOLIO ─── */}
      <section className="relative py-24 md:py-32 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            index={0}
            eyebrow="Portfolio Intelligence"
            title="See your exposure. Not just your balance."
            subtitle="Concentration, correlation, sector exposure, drawdown, and risk budget — all in one view. Know what you own and why it moves together."
          />

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid md:grid-cols-4 gap-4"
          >
            <MetricCard label="Portfolio Value" value="$42,840.24" change="+$762.18" changePct={1.82} icon={Wallet} />
            <MetricCard label="Total P&L" value="+$5,142.82" change="+13.68%" changePct={13.68} icon={TrendingUp} />
            <MetricCard label="Risk Exposure" value="Moderate" icon={ShieldCheck} />
            <MetricCard label="MITIGATOR Avg" value="82" icon={Brain} />
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 8: FINAL CTA ─── */}
      <section className="relative py-32 md:py-40 px-6 border-t border-border/30 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            Trade with context.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 text-xl text-muted-foreground"
          >
            Not just another trading dashboard. A risk-aware intelligence and execution layer for tokenized stocks.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] glow-primary"
            >
              Explore Markets
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/risk"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card/50 px-8 py-3.5 text-sm font-semibold backdrop-blur-sm hover:border-primary/30 transition-all"
            >
              <ShieldCheck className="h-4 w-4" />
              Risk Center
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">MITIGATOR</span>
            <span className="text-xs text-muted-foreground ml-2">Know the risk. Before you trade.</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for Stocklana 2026 · Solana-native tokenized stock intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
