'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Wallet, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { getAllAssets, getExecutionQuotes } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function ExecutionPage() {
  const assets = getAllAssets();
  const [symbol, setSymbol] = useState('NVDAx');
  const [amount, setAmount] = useState(2000);
  const [stage, setStage] = useState<'compare' | 'review' | 'sign' | 'confirmed'>('compare');

  const quotes = getExecutionQuotes(symbol, amount);
  const bestQuote = quotes.reduce((best, q) => q.slippage < best.slippage ? q : best, quotes[0]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Execution Router</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Compare execution venues, quotes, and routes before you sign</p>
      </div>

      {/* Trade config */}
      <GlassPanel className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Asset</label>
            <select
              value={symbol}
              onChange={(e) => { setSymbol(e.target.value); setStage('compare'); }}
              className="mt-1 w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm outline-none"
            >
              {assets.map((a) => (
                <option key={a.tokenizedAsset.symbol} value={a.tokenizedAsset.symbol}>
                  {a.tokenizedAsset.symbol} — {a.tokenizedAsset.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Amount (USD)</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2">
              <span className="text-sm text-muted-foreground">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(parseInt(e.target.value) || 0); setStage('compare'); }}
                className="flex-1 bg-transparent text-sm outline-none tabular-nums"
              />
            </div>
          </div>
          <div className="flex items-end">
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 text-sm">
              <span className="text-primary font-medium">BUY {symbol}</span>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Quote comparison */}
      <GlassPanel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground tracking-wider uppercase">
                <th className="text-left font-medium px-4 py-3">Venue</th>
                <th className="text-right font-medium px-4 py-3">Expected Price</th>
                <th className="text-right font-medium px-4 py-3">Received</th>
                <th className="text-right font-medium px-4 py-3">Spread</th>
                <th className="text-right font-medium px-4 py-3">Slippage</th>
                <th className="text-right font-medium px-4 py-3">Fee</th>
                <th className="text-center font-medium px-4 py-3">Quote Type</th>
                <th className="text-center font-medium px-4 py-3">Route</th>
                <th className="text-center font-medium px-4 py-3">Age</th>
                <th className="text-center font-medium px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {quotes.map((q, i) => (
                <motion.tr
                  key={q.venue}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'border-b border-border/50 hover:bg-card/50 transition-colors',
                    q.venue === bestQuote.venue && 'bg-emerald-500/5'
                  )}
                >
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {q.venue}
                      {q.venue === bestQuote.venue && <span className="text-[10px] text-emerald-400 font-semibold">BEST</span>}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{q.venueType}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">${q.expectedPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{q.expectedReceived.toFixed(4)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">${q.spread.toFixed(4)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{q.slippage.toFixed(3)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">${q.fee.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded',
                      q.quoteType === 'executable' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
                    )}>
                      {q.quoteType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      'text-[10px] font-medium',
                      q.routeComplexity === 'low' ? 'text-emerald-400' : q.routeComplexity === 'medium' ? 'text-amber-400' : 'text-red-400'
                    )}>
                      {q.routeComplexity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" />{q.quoteAge}s
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setStage('review')}
                      className="text-xs text-primary hover:underline"
                    >
                      Select
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Execution flow */}
      {stage !== 'compare' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel className="p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              {['review', 'sign', 'confirmed'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold',
                    stage === s || (stage === 'confirmed' && i < 2) ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
                  )}>
                    {i + 1}
                  </div>
                  <span className="text-xs capitalize">{s === 'confirmed' ? 'Confirmed' : s}</span>
                  {i < 2 && <div className="h-px w-8 bg-border" />}
                </div>
              ))}
            </div>

            {stage === 'review' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Review Trade</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Asset</span><span className="font-medium">{symbol}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium tabular-nums">${amount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Venue</span><span className="font-medium">{bestQuote.venue}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Expected Price</span><span className="font-medium tabular-nums">${bestQuote.expectedPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Expected Received</span><span className="font-medium tabular-nums">{bestQuote.expectedReceived.toFixed(4)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium tabular-nums">${bestQuote.fee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Settlement</span><span className="font-medium">{bestQuote.settlement}</span></div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 text-amber-400" />
                  Quote expires in 8 seconds. Indicative — not a confirmed execution.
                </div>
                <button
                  onClick={() => setStage('sign')}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet & Sign
                </button>
              </div>
            )}

            {stage === 'sign' && (
              <div className="space-y-4 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-ring">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">Awaiting Wallet Signature</h3>
                <p className="text-xs text-muted-foreground">Confirm the transaction in your Solana wallet. No seed phrase or private key is ever exposed.</p>
                <button
                  onClick={() => setStage('confirmed')}
                  className="w-full rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Simulate Confirmation (Demo)
                </button>
              </div>
            )}

            {stage === 'confirmed' && (
              <div className="space-y-4 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-emerald-400">Transaction Confirmed</h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Signature: 5xKf...3pQw9mBn2vD</p>
                  <p>Slot: 291,847,302</p>
                  <p>Block time: {new Date().toLocaleTimeString('en-US')}</p>
                </div>
                <button
                  onClick={() => setStage('compare')}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  New Trade <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 text-xs text-muted-foreground">
        <Zap className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
        Quotes are indicative in demo mode. Live execution requires wallet connection and fresh venue quotes. Never share your seed phrase.
      </div>
    </div>
  );
}
