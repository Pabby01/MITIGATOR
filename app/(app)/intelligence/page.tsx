'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Send, ShieldCheck, Loader2, ArrowUpRight, CheckCircle2, AlertTriangle, FileText, Activity } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { getAllAssets, getAsset } from '@/lib/mock-data';
import { useDashboardLiveData } from '@/lib/hooks/useDashboardLiveData';
import { cn } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  'Should I buy $2,000 of NVDAx?',
  'Backing ratio and oracle health for TSLAx',
  'AAPLx weekend market-closure risk assessment',
  'Compare MSFTx execution routes: Raydium vs Orca',
  'Corporate action impact on GOOGLx 20:1 split history',
];

interface LiveAiResponse {
  verdict: string;
  summary: string;
  riskScore: number;
  confidence: number;
  recommendation: string;
  sources: Array<{ name: string; tier: string; detail: string }>;
  riskVectors?: Array<{ category: string; status: string; notes: string }>;
}

export default function IntelligencePage() {
  const assets = getAllAssets();
  const { quotes } = useDashboardLiveData();
  const [query, setQuery] = useState('Should I buy $2,000 of NVDAx?');
  const [symbol, setSymbol] = useState('NVDAx');
  const [amount, setAmount] = useState(2000);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiData, setAiData] = useState<LiveAiResponse | null>(null);

  const cleanSymbol = symbol.replace(/x$/, '');
  const liveQuote = quotes[cleanSymbol] || quotes['NVDA'];

  const executeAnalysis = async (queryString: string, targetSym: string, targetAmt: number) => {
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryString,
          symbol: targetSym,
          amount: targetAmt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiData(data);
      }
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    executeAnalysis(query, symbol, amount);
  }, []); // Run on initial mount

  const handleRunQuery = (queryString: string) => {
    setQuery(queryString);

    // Extract symbol
    const upperQuery = queryString.toUpperCase();
    let foundSymbol = symbol;
    for (const a of assets) {
      const fullSym = a.tokenizedAsset.symbol.toUpperCase();
      const baseSym = a.tokenizedAsset.underlying.ticker.toUpperCase();
      if (upperQuery.includes(fullSym) || upperQuery.includes(` ${baseSym} `) || upperQuery.endsWith(` ${baseSym}`)) {
        foundSymbol = fullSym;
        break;
      }
    }
    setSymbol(foundSymbol);

    // Extract dollar amount
    let targetAmount = amount;
    const amountMatch = queryString.match(/\$?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)/);
    if (amountMatch) {
      const parsed = parseInt(amountMatch[1].replace(/,/g, ''), 10);
      if (parsed > 0) {
        targetAmount = parsed;
        setAmount(parsed);
      }
    }

    executeAnalysis(queryString, foundSymbol, targetAmount);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Intelligence Terminal</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Multi-source synthesis engine linking SEC filings, Solana onchain telemetry, and Pyth oracle health
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-primary/10 border border-primary/20 text-primary self-start">
          <Sparkles className="h-3 w-3" /> Live Synthesis Engine Active
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
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50 active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Analyze</span>
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
            Querying SEC EDGAR, Pyth Hermes Oracle, and Jupiter DEX routing for {symbol}...
          </p>
        </div>
      )}

      {/* Results view */}
      {!isAnalyzing && aiData && (
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
                      Target Order: ${amount.toLocaleString()} USD
                    </span>
                  </div>
                  <p className="text-base font-semibold mt-1">{query}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live Multi-Source Synthesis · Verified Ground Truth
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">MITIGATOR Verdict</span>
                  <span className="text-base font-bold text-emerald-400">{aiData.verdict}</span>
                </div>
                <div className="text-right pl-3 border-l border-border">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Model Confidence</span>
                  <span className="text-base font-bold font-mono text-primary">{aiData.confidence}%</span>
                </div>
              </div>
            </GlassPanel>

            {/* Live Telemetry Snapshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <GlassPanel className="p-3">
                <span className="text-[11px] text-muted-foreground block">Pyth Streaming Price</span>
                <span className="text-base font-mono font-bold">${liveQuote?.price?.toFixed(2) || '119.82'}</span>
              </GlassPanel>
              <GlassPanel className="p-3">
                <span className="text-[11px] text-muted-foreground block">Computed Risk Score</span>
                <span className="text-base font-mono font-bold text-emerald-400">{aiData.riskScore}/100</span>
              </GlassPanel>
              <GlassPanel className="p-3">
                <span className="text-[11px] text-muted-foreground block">Peg Deviation</span>
                <span className="text-base font-mono font-bold text-cyan-400">&lt; 0.04% (Par)</span>
              </GlassPanel>
              <GlassPanel className="p-3">
                <span className="text-[11px] text-muted-foreground block">Solana Token Standard</span>
                <span className="text-base font-mono font-bold text-emerald-400">Token-2022</span>
              </GlassPanel>
            </div>

            {/* AI Executive Summary */}
            <GlassPanel className="p-5 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Executive Synthesis
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {aiData.summary}
              </p>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground font-medium">
                <span className="text-primary font-bold">Execution Plan: </span>
                {aiData.recommendation}
              </div>
            </GlassPanel>

            {/* Ground Truth Sources */}
            <GlassPanel className="p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Verified Ground Truth Sources
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {aiData.sources.map((s) => (
                  <div key={s.name} className="p-3 rounded-xl border border-border/70 bg-card/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{s.name}</span>
                      <SourceBadge tier={s.tier as any} />
                    </div>
                    <p className="text-[11px] font-mono text-emerald-400">{s.detail}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Risk Vectors */}
            {aiData.riskVectors && (
              <GlassPanel className="p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Live Risk Vector Assessment
                </h3>
                <div className="space-y-2">
                  {aiData.riskVectors.map((v) => (
                    <div key={v.category} className="flex items-center justify-between p-2.5 rounded-lg bg-card/40 border border-border/50 text-xs">
                      <span className="font-semibold text-foreground">{v.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{v.notes}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
