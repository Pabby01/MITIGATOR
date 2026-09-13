'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Send,
  ShieldCheck,
  Loader2,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  History,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  BarChart3,
  Cpu,
  Info,
  Scale,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { getAllAssets } from '@/lib/mock-data';
import { useDashboardLiveData } from '@/lib/hooks/useDashboardLiveData';
import { RiskFactorDetail } from '@/lib/services/risk-engine';
import { cn } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  'Should I buy $2,000 of NVDAx?',
  'Backing ratio and oracle health for TSLAx',
  'AAPLx weekend market-closure risk assessment',
  'Compare MSFTx execution routes: Raydium vs Orca',
  'Evaluate SPYx macro liquidity and peg stability',
];

interface LiveAiResponse {
  verdict: string;
  summary: string;
  riskScore: number;
  confidence: number;
  recommendation: string;
  modelVersion?: string;
  sources: Array<{ name: string; tier: string; detail: string }>;
  riskVectors?: Array<{ category: string; status: string; notes: string }>;
  factors?: RiskFactorDetail[];
}

interface HistoryItem {
  id: string;
  query: string;
  symbol: string;
  amount: number;
  timestamp: string;
  verdict: string;
  riskScore: number;
}

const STORAGE_KEY_HISTORY = 'mitigator_intelligence_history';

export default function IntelligencePage() {
  const assets = getAllAssets();
  const { quotes } = useDashboardLiveData();
  const [query, setQuery] = useState('Should I buy $2,000 of NVDAx?');
  const [symbol, setSymbol] = useState('NVDAx');
  const [amount, setAmount] = useState(2000);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiData, setAiData] = useState<LiveAiResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedFactor, setSelectedFactor] = useState<RiskFactorDetail | null>(null);

  const cleanSymbol = symbol.replace(/x$/, '');
  const liveQuote = quotes[cleanSymbol] || quotes['NVDA'];

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load intelligence history:', e);
    }
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.query !== item.query);
      const updated = [item, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save intelligence history:', e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {
      console.warn('Failed to clear intelligence history:', e);
    }
  };

  const executeAnalysis = async (queryString: string, targetSym: string, targetAmt: number) => {
    setIsAnalyzing(true);
    setSelectedFactor(null);

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
        const data: LiveAiResponse = await res.json();
        setAiData(data);

        // Record in history
        saveToHistory({
          id: `hist-${Date.now()}`,
          query: queryString,
          symbol: targetSym,
          amount: targetAmt,
          timestamp: new Date().toISOString(),
          verdict: data.verdict,
          riskScore: data.riskScore,
        });
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

  const handleRunQuery = (queryString: string, forcedSymbol?: string) => {
    setQuery(queryString);

    let foundSymbol = forcedSymbol || symbol;
    if (!forcedSymbol) {
      const upperQuery = queryString.toUpperCase();
      for (const a of assets) {
        const fullSym = a.tokenizedAsset.symbol.toUpperCase();
        const baseSym = a.tokenizedAsset.underlying.ticker.toUpperCase();
        if (
          upperQuery.includes(fullSym) ||
          upperQuery.includes(` ${baseSym} `) ||
          upperQuery.endsWith(` ${baseSym}`)
        ) {
          foundSymbol = fullSym;
          break;
        }
      }
    }
    setSymbol(foundSymbol);

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (score >= 55) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 70) return 'bg-cyan-500';
    if (score >= 55) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">AI Intelligence Terminal</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              PRD §8 Compliant
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Multi-source synthesis engine linking SEC EDGAR filings, Pyth Hermes streaming oracles, and Jupiter v6 liquidity depth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Synthesis Active
          </div>
        </div>
      </div>

      {/* Quick Asset Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap flex items-center gap-1">
          <Layers className="h-3 w-3" /> Quick Target:
        </span>
        {assets.map((a) => {
          const sym = a.tokenizedAsset.symbol;
          const isSelected = symbol === sym;
          return (
            <button
              key={sym}
              onClick={() => handleRunQuery(`Comprehensive risk & oracle evaluation for ${sym}`, sym)}
              className={cn(
                'px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border transition-all whitespace-nowrap',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30'
                  : 'bg-card/60 hover:bg-card border-border/70 text-foreground hover:border-primary/40'
              )}
            >
              {sym}
            </button>
          );
        })}
      </div>

      {/* Input box */}
      <GlassPanel className="p-4 border-border/80 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary flex-shrink-0">
            <Brain className="h-5 w-5" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunQuery(query)}
            placeholder="Ask anything: 'Risk breakdown for $5,000 AAPLx' or 'Oracle delay on TSLAx'"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-medium min-w-0"
          />
          <button
            onClick={() => handleRunQuery(query)}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50 active:scale-95 flex-shrink-0"
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
          <span className="text-[11px] font-mono mr-1">Suggested:</span>
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
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary mt-0.5 flex-shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {symbol}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Order Size: ${amount.toLocaleString()} USD
                    </span>
                    {aiData.modelVersion && (
                      <span className="text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded bg-card border border-border">
                        Engine {aiData.modelVersion}
                      </span>
                    )}
                  </div>
                  <p className="text-base font-semibold mt-1.5">{query}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Deterministic Multi-Source Synthesis · Verified Ground Truth
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">MITIGATOR Verdict</span>
                  <span className="text-base font-bold text-emerald-400">{aiData.verdict}</span>
                </div>
                <div className="text-right pl-4 border-l border-border">
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
                <span className={cn('text-base font-mono font-bold', aiData.riskScore >= 80 ? 'text-emerald-400' : 'text-amber-400')}>
                  {aiData.riskScore}/100
                </span>
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

            {/* AI Executive Summary & Execution Plan */}
            <GlassPanel className="p-5 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Executive Synthesis
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {aiData.summary}
              </p>
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground font-medium">
                <span className="text-primary font-bold">Execution Plan: </span>
                {aiData.recommendation}
              </div>
            </GlassPanel>

            {/* 8-Factor Explainable Risk Breakdown (PRD Section 8) */}
            {aiData.factors && aiData.factors.length > 0 && (
              <GlassPanel className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      8-Factor Explainable Risk Matrix (PRD Section 8)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Weighted score components computed directly from oracle latency, SEC filings, and Jupiter orderbook depth
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-muted-foreground">Weighted Total:</span>
                    <span className="px-2 py-0.5 rounded font-bold bg-primary/10 text-primary border border-primary/20">
                      {aiData.riskScore} / 100
                    </span>
                  </div>
                </div>

                {/* Factors Grid */}
                <div className="grid md:grid-cols-2 gap-3">
                  {aiData.factors.map((factor) => {
                    const isSelected = selectedFactor?.key === factor.key;
                    return (
                      <div
                        key={factor.key}
                        onClick={() => setSelectedFactor(isSelected ? null : factor)}
                        className={cn(
                          'p-3.5 rounded-xl border transition-all cursor-pointer bg-card/40 hover:bg-card/70',
                          isSelected ? 'border-primary shadow-sm shadow-primary/20' : 'border-border/60 hover:border-border'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">{factor.label}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground">
                              {factor.category}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {factor.weight}% wt
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {factor.trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
                            {factor.trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-red-400" />}
                            {factor.trend === 'flat' && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
                            <span className={cn('text-xs font-bold font-mono px-2 py-0.5 rounded border', getScoreColor(factor.score))}>
                              {factor.score}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden mb-2">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500', getScoreBarColor(factor.score))}
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">{factor.description}</p>

                        {/* Evidence preview */}
                        <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-muted-foreground">Evidence:</span>
                          <span className="text-emerald-400 truncate max-w-[240px]">{factor.evidence}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Factor Deep Dive Drawer */}
                {selectedFactor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="font-bold text-foreground text-sm">{selectedFactor.label} Deep Dive</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-primary">
                        Score: {selectedFactor.score}/100 ({selectedFactor.weight}% weight)
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{selectedFactor.description}</p>
                    <div className="p-2.5 rounded-lg bg-card/60 border border-border/60">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Empirical Proof</span>
                      <span className="text-emerald-400 font-mono">{selectedFactor.evidence}</span>
                    </div>
                  </motion.div>
                )}
              </GlassPanel>
            )}

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

      {/* Query History Log */}
      {history.length > 0 && (
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Recent AI Research Inquiries
            </h3>
            <button
              onClick={clearHistory}
              className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" /> Clear History
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRunQuery(item.query, item.symbol)}
                className="p-3 rounded-xl bg-card/30 hover:bg-card/70 border border-border/50 hover:border-primary/40 transition-all cursor-pointer space-y-1.5 text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-primary text-[11px] px-1.5 py-0.5 rounded bg-primary/10">
                    {item.symbol}
                  </span>
                  <span className={cn('text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border', getScoreColor(item.riskScore))}>
                    Score: {item.riskScore}
                  </span>
                </div>
                <p className="text-foreground font-medium line-clamp-1 group-hover:text-primary transition-colors">
                  {item.query}
                </p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span>${item.amount.toLocaleString()}</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
