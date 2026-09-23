'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  ExternalLink,
  X,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Globe,
  FlaskConical,
} from 'lucide-react';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { cn } from '@/lib/utils';

interface JudgeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JudgeGuideModal({ isOpen, onClose }: JudgeGuideModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Step 1: Test Smart Order Routing (Jupiter & Backpack RFQ)',
      route: '/execution',
      tag: 'Core Infrastructure',
      summary:
        'Compare institutional Backpack RFQ, Meteora DLMM, and Raydium CLMM execution in real-time. Notice how our router optimizes across AMMs with live priority fee calculation.',
      actionLabel: 'Go to Execution Router',
    },
    {
      title: 'Step 2: Inspect Pyth Dual-Feed & Peg Radar',
      route: '/execution',
      tag: 'Pyth Market Data Bounty',
      summary:
        'Verify our live dual-feed comparison: TradFi NAV (Equity.US.NVDA/USD) vs Solana On-Chain tokenized asset (Crypto.NVDAX/USD). Check the basis points spread meter and parity status.',
      actionLabel: 'View Pyth Peg Radar',
    },
    {
      title: 'Step 3: Execute Live Devnet Trade + 1-Click Faucet',
      route: '/paper',
      tag: 'Solana Web3 & Token-2022',
      summary:
        'Open "New Paper Trade" in the Paper Trading Terminal. Switch to "Live Devnet Wallet", click "⚡ Airdrop 1 Devnet SOL" for instant gas, and broadcast an authentic Solana on-chain memo & escrow transaction.',
      actionLabel: 'Launch Paper & Devnet Terminal',
    },
    {
      title: 'Step 4: Explore Tessera Pre-IPO Assets & Venue Directory',
      route: '/venues',
      tag: 'Tessera $6,000 Bounty',
      summary:
        'Navigate the Venues Directory to view Tessera (app.tessera.pe) alongside Backpack, Meteora, and Dinari. Examine OPENAI.T and KALSHI.T pre-IPO token listings with secondary market metrics.',
      actionLabel: 'Explore Venues & Tessera',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-card border border-primary/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] my-auto"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-border/80 bg-gradient-to-r from-primary/10 via-card to-purple-500/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">Stocklana 2026 Judge Guide</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400">
                      Evaluation Checklist
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fast 3-minute interactive guide to evaluating MITIGATOR&apos;s key tracks &amp; bounties
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">
              {/* Bounties Alignment Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl border border-primary/25 bg-primary/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Main Track</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    RWA Equities, 8-Factor Risk Engine, Multi-DEX Smart Order Routing.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-purple-500/25 bg-purple-500/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                    <Activity className="h-3.5 w-3.5" />
                    <span>Pyth Market Data</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Live Hermes feeds + Dual-Feed TradFi vs On-Chain Peg Parity Radar.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Tessera Bounty ($6k)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Pre-IPO token catalog (OPENAI.T, KALSHI.T) and Tessera venue integration.
                  </p>
                </div>
              </div>

              {/* 4-Step Interactive Roadmap */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Interactive Evaluation Steps
                </h3>

                <div className="space-y-2.5">
                  {steps.map((s, idx) => (
                    <div
                      key={s.title}
                      onClick={() => setActiveStep(idx)}
                      className={cn(
                        'p-4 rounded-2xl border transition-all cursor-pointer',
                        activeStep === idx
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                          : 'border-border/70 bg-card/60 hover:border-border hover:bg-card'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 mt-0.5',
                              activeStep === idx
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {idx + 1}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-muted/80 text-muted-foreground font-medium">
                                {s.tag}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {s.summary}
                            </p>
                          </div>
                        </div>

                        {activeStep === idx && (
                          <Link
                            href={s.route}
                            onClick={onClose}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90 transition-all flex-shrink-0"
                          >
                            <span>Open</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro-Tips for Hackathon Evaluation */}
              <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Key Architectural Innovations to Test:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px] leading-relaxed">
                  <li>
                    <strong className="text-foreground">True Web3 Wallet Signing:</strong> Connect Solflare, Phantom or Backpack in Devnet mode. All transactions generate real Solana block explorer hashes with verified SPL memos.
                  </li>
                  <li>
                    <strong className="text-foreground">Zero-Setup Testing:</strong> Use the 1-click Devnet SOL airdrop button in the trade modal so you never have to search for an external faucet.
                  </li>
                  <li>
                    <strong className="text-foreground">No Synthetics / No Dummy Numbers:</strong> All quotes compute live against Pyth Hermes streams, Raydium Trade API v1, Meteora Concentrated Bins, and SEC EDGAR.
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-border/80 bg-card/90 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-mono text-muted-foreground">
                Stocklana 2026 Submission · Built for Solana
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all"
              >
                Close &amp; Explore
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
