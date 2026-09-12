'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Send, ShieldCheck, Loader2, ArrowUpRight, HelpCircle, CheckCircle } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { getAIInsight, getAllAssets, getAsset } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  'Should I buy $2,000 of NVDAx?',
  'Backing ratio and oracle health for TSLAx',
  'AAPLx weekend market-closure risk assessment',
  'Compare MSFTx execution routes: Raydium vs Orca',
  'Corporate action impact on GOOGLx 20:1 split history',
];

export default function IntelligencePage() {
  const assets = getAllAssets();
  const [query, setQuery] = useState('Should I buy $2,000 of NVDAx?');
  const [symbol, setSymbol] = useState('NVDAx');
  const [amount, setAmount] = useState(2000);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitted, setSubmitted] = useState(true);

  const asset = getAsset(symbol);
  const insight = getAIInsight(symbol, amount);

  const handleRunQuery = (queryString: string) => {
    setQuery(queryString);
    setIsAnalyzing(true);

    // 1. Extract symbol: check all asset symbols (and base tickers)
    const upperQuery = queryString.toUpperCase();
    let foundSymbol = '';
    for (const a of assets) {
      const fullSym = a.tokenizedAsset.symbol.toUpperCase();
      const baseSym = a.tokenizedAsset.underlying.ticker.toUpperCase();
      if (upperQuery.includes(fullSym) || upperQuery.includes(` ${baseSym} `) || upperQuery.endsWith(` ${baseSym}`)) {
        foundSymbol = fullSym;
        break;
      }
    }

    if (foundSymbol) {
      setSymbol(foundSymbol);
    }

    // 2. Extract dollar amount if present
    const amountMatch = queryString.match(/\$?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)/);
    if (amountMatch) {
      const parsed = parseInt(amountMatch[1].replace(/,/g, ''), 10);
      if (parsed > 0) {
        setAmount(parsed);
      }
    }

    // Simulate AI synthesis & provenance verification
    setTimeout(() => {
      setIsAnalyzing(false);
      setSubmitted(true);
    }, 450);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Intelligence Terminal</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Multi-source synthesis engine linking SEC filings, Solana onchain telemetry, and oracle health
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-primary/10 border border-primary/20 text-primary self-start">
          <Sparkles className="h-3 w-3" /> MITIGATOR Co-Pilot v2.6
        </div>
      </div>

      {/* Input box */}
      <GlassPanel className="p-4 border-border/80 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Brain className="h-5 w-5" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunQuery(query)}
            placeholder="Ask anything: 'Risk breakdown for $5,000 AAPLx' or 'Oracle delay on TSLAx'"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-medium"
          />
          <button
            onClick={() => handleRunQuery(query)}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Synthesizing...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Analyze
              </>
            )}
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="text-[11px] font-mono mr-1">Try:</span>
          {SUGGESTED_PROMPTS.map((promptText) => (
            <button
              key={promptText}
              onClick={() => handleRunQuery(promptText)}
              className="px-2.5 py-1 rounded-md bg-card/60 hover:bg-card border border-border/60 hover:border-primary/40 text-xs transition-colors text-left flex items-center gap-1"
            >
              <span>{promptText}</span>
              <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
            </button>
          ))}
        </div>
      </GlassPanel>

      {/* Loading state */}
      {isAnalyzing && (
        <div className="p-12 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="text-sm font-mono text-muted-foreground">
            Correlating SEC 10-Q filings with Solana Pyth/Switchboard oracle feeds for {symbol}...
          </p>
        </div>
      )}

      {/* Results view */}
      {!isAnalyzing && submitted && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Header insight banner */}
            <GlassPanel className="p-5 border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary mt-0.5">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {symbol}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Target: ${amount.toLocaleString()} USD
                    </span>
                  </div>
                  <p className="text-base font-semibold mt-1">{insight.query}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Model: {insight.modelVersion} · Provenance Citations: Verified · Latency: 128ms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">MITIGATOR Verdict</span>
                  <span className="text-base font-bold text-emerald-400">{insight.verdict}</span>
                </div>
                <div className="text-right pl-3 border-l border-border">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Model Confidence</span>
                  <span className="text-base font-bold font-mono text-primary">{(insight.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </GlassPanel>

            {/* Asset Quick Snapshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <GlassPanel className="p-3">
                <span className="text-[11px] text-muted-foreground block">Current Price</span>
                <span className="text-base font-mono font-bold">${asset.quote.price.toFixed(2)}</span>
              </GlassPanel>
              <GlassPanel className="p-3">
                <span className="text-[11px] text-muted-foreground block">MITIGATOR Risk Score</span>
                <span className="text-base font-mono font-bold text-emerald-400">{asset.riskScore.overall}/100</span>
              </GlassPanel>
              <GlassPanel className="p-3">
                <span className="text-[11px] text-muted-foreground block">Corporate Action Multiplier</span>
                <span className="text-base font-mono font-bold text-cyan-400">1.0000x (No split)</span>
              </GlassPanel>
              <GlassPanel className="p-3">
                <span className="text-[11px] text-muted-foreground block">Solana Token Standard</span>
                <span className="text-base font-mono font-bold text-emerald-400">Token-2022</span>
              </GlassPanel>
            </div>

            {/* Structured Insights with Multi-Tier Provenance */}
            <div className="space-y-3">
              {insight.sections.map((section, i) => (
                <motion.div
                  key={section.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassPanel className="p-5 hover:border-border transition-colors">
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-wider text-primary uppercase font-mono">
                          {section.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {(section.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-card-foreground/90">{section.content}</p>

                    <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center gap-3">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                        Grounding Citations:
                      </span>
                      {section.sources.map((source, j) => (
                        <span
                          key={j}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-card/60 border border-border/60"
                        >
                          <SourceBadge tier={source.tier} />
                          <span className="text-[11px] text-muted-foreground font-mono">{source.label}</span>
                        </span>
                      ))}
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>

            {/* Compliance & Risk Notice */}
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <ShieldCheck className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p className="font-semibold text-foreground">Provenance-Grounded Intelligence</p>
                <p>
                  All claims are anchored to Tier-1 filings (SEC EDGAR), onchain Solana RPC signatures, and oracle heartbeats. AI confidence scores indicate probabilistic model certainty, not financial advice. Verify all quotes in the Execution Router before signing.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
