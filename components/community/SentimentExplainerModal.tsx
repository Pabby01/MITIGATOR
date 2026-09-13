'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  X,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';

interface SentimentExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
}

export function SentimentExplainerModal({
  isOpen,
  onClose,
  symbol,
}: SentimentExplainerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin hairline-card rounded-2xl p-6 shadow-2xl space-y-5 bg-card/95 border border-border"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                Understanding AI Sentiment Consensus
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  NLP Engine
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                How MITIGATOR filters noise, models retail psychology, and detects exit liquidity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Core Definition */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> What Is It?
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed">
            The <strong>AI Sentiment Consensus</strong> is an autonomous natural language synthesis system. It continuously parses real-time research posts, trade ideas, and debates across the decentralized MITIGATOR board, X, and Stocktwits specifically for <strong>{symbol}</strong>.
          </p>
        </div>

        {/* The 3 Pillars */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            The 3 Pillars of the Consensus Engine
          </h4>

          {/* 1. Consensus */}
          <div className="p-3.5 rounded-xl border border-border/70 bg-card/50 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-foreground">1. Weighted Directional Consensus</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">e.g. 72% Bullish</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unlike simple social aggregators that can be gamed with bot spam, MITIGATOR applies a <strong>2.5x weight to Verified On-Chain Traders</strong> and verified SEC analysts. Posts with attached empirical evidence (Pyth charts, SEC filings) receive higher influence.
            </p>
          </div>

          {/* 2. Divergence */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400">2. Divergence Warning (Anti-Trap)</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Risk Guardian
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Divergence flags when <strong>retail sentiment clashes with hard financial reality</strong>. If the community is hyper-bullish, but MITIGATOR’s SEC agent detects insider selling on Form 4, or Pyth oracle confidence intervals widen, the system warns you not to become exit liquidity.
            </p>
          </div>

          {/* 3. Narratives */}
          <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400">3. Narrative Clustering</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Catalyst Mining</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Extracts and ranks the top fundamental drivers being discussed in real time (e.g., <em>Blackwell production schedules</em>, <em>FSD intervention rates</em>, or <em>data center capex</em>), saving you hours of reading.
            </p>
          </div>
        </div>

        {/* Practical Trading Advice */}
        <div className="p-3 rounded-xl border border-border/80 bg-muted/30 flex items-start gap-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <p>
            Always pair AI Sentiment with the <strong>12-Factor MITIGATOR Risk Score</strong>. If Sentiment is Bullish (&gt;70%) AND Risk Score is High (&gt;80), trade execution has the highest probabilistic edge.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Got It, Back to Community
          </button>
        </div>
      </motion.div>
    </div>
  );
}
