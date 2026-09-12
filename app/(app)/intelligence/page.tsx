'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { getAIInsight, getAllAssets } from '@/lib/mock-data';

export default function IntelligencePage() {
  const assets = getAllAssets();
  const [query, setQuery] = useState('Should I buy $2,000 of NVDAx?');
  const [symbol, setSymbol] = useState('NVDAx');
  const [amount, setAmount] = useState(2000);
  const [submitted, setSubmitted] = useState(true);

  const insight = getAIInsight(symbol, amount);

  const handleSubmit = () => {
    const match = query.match(/\$?([\d,]+)\s*(?:of\s+)?(\w+)/i);
    if (match) {
      const parsedAmount = parseInt(match[1].replace(/,/g, ''));
      const sym = match[2].toUpperCase();
      if (assets.find((a) => a.tokenizedAsset.symbol === sym)) {
        setSymbol(sym);
        if (parsedAmount > 0) setAmount(parsedAmount);
      }
    }
    setSubmitted(true);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Research terminal with source-backed analysis and uncertainty signals</p>
      </div>

      <GlassPanel className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask: Should I buy $2,000 of NVDAx?"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            Analyze
          </button>
        </div>
      </GlassPanel>

      {submitted && (
        <>
          <GlassPanel className="p-4 flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{insight.query}</p>
              <p className="text-xs text-muted-foreground">Model: {insight.modelVersion} · Confidence: {(insight.confidence * 100).toFixed(0)}%</p>
            </div>
            <span className="text-sm font-bold text-emerald-400">{insight.verdict}</span>
          </GlassPanel>

          <div className="space-y-3">
            {insight.sections.map((section, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassPanel className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs font-bold tracking-widest text-primary uppercase">{section.label}</p>
                    <span className="text-[10px] text-muted-foreground">{(section.confidence * 100).toFixed(0)}% confidence</span>
                  </div>
                  <p className="text-sm leading-relaxed">{section.content}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {section.sources.map((source, j) => (
                      <span key={j} className="flex items-center gap-1.5">
                        <SourceBadge tier={source.tier} />
                        <span className="text-[10px] text-muted-foreground">{source.label}</span>
                      </span>
                    ))}
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <ShieldCheck className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">AI analysis is probabilistic, not financial advice. Every claim has a source. Verify before trading.</p>
          </div>
        </>
      )}
    </div>
  );
}
