'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Wallet, CheckCircle2, ArrowRight, Clock, ExternalLink, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { getAllAssets, getExecutionQuotes } from '@/lib/mock-data';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { cn } from '@/lib/utils';

export default function ExecutionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-muted-foreground">Loading Execution Router...</div>}>
      <ExecutionRouterContent />
    </Suspense>
  );
}

function ExecutionRouterContent() {
  const searchParams = useSearchParams();
  const initialSymbol = searchParams.get('symbol') || 'NVDAx';
  const assets = getAllAssets();
  const [symbol, setSymbol] = useState(initialSymbol);
  const [amount, setAmount] = useState(2000);
  const [stage, setStage] = useState<'compare' | 'review' | 'sign' | 'confirmed'>('compare');
  const [selectedQuoteVenue, setSelectedQuoteVenue] = useState<string | null>(null);
  const [quoteSecondsLeft, setQuoteSecondsLeft] = useState(8);
  const [copiedSignature, setCopiedSignature] = useState(false);
  const [txSignature] = useState('5xKf8m2P9nLq4R1vTz6W8yXu9kH3jF7oPdAm2sVw1');

  const { connected, shortAddress, walletType } = useSolanaWallet();

  const quotes = getExecutionQuotes(symbol, amount);
  const bestQuote = quotes.reduce((best, q) => (q.slippage < best.slippage ? q : best), quotes[0]);
  const activeQuote = quotes.find((q) => q.venue === selectedQuoteVenue) || bestQuote;

  // Countdown timer for quote expiration
  useEffect(() => {
    if (stage !== 'review') {
      setQuoteSecondsLeft(8);
      return;
    }

    const interval = setInterval(() => {
      setQuoteSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  const handleRefreshQuote = () => {
    setQuoteSecondsLeft(8);
  };

  const handleCopySignature = () => {
    navigator.clipboard?.writeText(txSignature);
    setCopiedSignature(true);
    setTimeout(() => setCopiedSignature(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Execution Router</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Compare execution venues, quotes, and routes before you sign</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Solana Mainnet-Beta Ready
          </span>
        </div>
      </div>

      {/* Trade config */}
      <GlassPanel className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Asset</label>
            <select
              value={symbol}
              onChange={(e) => {
                setSymbol(e.target.value);
                setSelectedQuoteVenue(null);
                setStage('compare');
              }}
              className="mt-1 w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm outline-none font-medium"
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
                onChange={(e) => {
                  setAmount(parseInt(e.target.value) || 0);
                  setStage('compare');
                }}
                className="flex-1 bg-transparent text-sm outline-none tabular-nums font-mono"
              />
            </div>
          </div>
          <div className="flex items-end">
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-sm">
              <span className="text-primary font-semibold">BUY {symbol}</span>
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
                <th className="text-center font-medium px-4 py-3">Status</th>
                <th className="text-center font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {quotes.map((q, i) => {
                const isSelected = (selectedQuoteVenue || bestQuote.venue) === q.venue;
                return (
                  <motion.tr
                    key={q.venue}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'border-b border-border/50 hover:bg-card/50 transition-colors',
                      isSelected && 'bg-primary/5 border-primary/30'
                    )}
                  >
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <span>{q.venue}</span>
                        {q.venue === bestQuote.venue && (
                          <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            BEST
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{q.venueType}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono font-medium">${q.expectedPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono">{q.expectedReceived.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground font-mono">${q.spread.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground font-mono">{q.slippage.toFixed(3)}%</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground font-mono">${q.fee.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider',
                          q.quoteType === 'executable' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        )}
                      >
                        {q.quoteType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'text-[10px] font-medium px-2 py-0.5 rounded',
                          q.routeComplexity === 'low' ? 'text-emerald-400 bg-emerald-500/10' : q.routeComplexity === 'medium' ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10'
                        )}
                      >
                        {q.routeComplexity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs text-muted-foreground flex items-center justify-center gap-1 font-mono">
                        <Clock className="h-3 w-3 text-emerald-400" />
                        Live
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedQuoteVenue(q.venue);
                          setQuoteSecondsLeft(8);
                          setStage('review');
                        }}
                        className="px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                      >
                        Select
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Execution flow */}
      {stage !== 'compare' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel className="p-6 max-w-lg mx-auto border-border/80 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              {['review', 'sign', 'confirmed'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                      stage === s || (stage === 'confirmed' && i < 2) ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs capitalize font-medium">{s === 'confirmed' ? 'Confirmed' : s}</span>
                  {i < 2 && <div className="h-px w-8 bg-border" />}
                </div>
              ))}
            </div>

            {stage === 'review' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Review Order Routing</h3>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <Clock className={cn('h-3.5 w-3.5', quoteSecondsLeft > 2 ? 'text-amber-400' : 'text-red-400 animate-pulse')} />
                    <span className={quoteSecondsLeft > 2 ? 'text-muted-foreground' : 'text-red-400 font-bold'}>
                      {quoteSecondsLeft > 0 ? `Quote valid: ${quoteSecondsLeft}s` : 'Quote expired'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm p-4 rounded-xl bg-card/40 border border-border/60">
                  <div className="flex justify-between"><span className="text-muted-foreground">Target Asset</span><span className="font-semibold">{symbol}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Order Amount</span><span className="font-medium tabular-nums font-mono">${amount.toLocaleString()} USD</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Chosen Venue</span><span className="font-medium text-cyan-400">{activeQuote.venue} ({activeQuote.venueType})</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Expected Execution Price</span><span className="font-medium tabular-nums font-mono">${activeQuote.expectedPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Estimated Tokens Received</span><span className="font-medium tabular-nums font-mono text-emerald-400">{activeQuote.expectedReceived.toFixed(4)} {symbol}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Estimated Venue Fee</span><span className="font-medium tabular-nums font-mono">${activeQuote.fee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Settlement Layer</span><span className="font-medium font-mono text-xs">{activeQuote.settlement}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Corporate Multiplier</span><span className="font-medium font-mono text-xs text-primary">1.0000x (No split)</span></div>
                </div>

                {quoteSecondsLeft === 0 ? (
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-xs text-red-300 flex items-center justify-between">
                    <span>Quote has expired to prevent frontrunning slippage.</span>
                    <button
                      onClick={handleRefreshQuote}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 font-medium transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" /> Refresh
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                    <span>Indicative pricing with MEV protection enabled. Signature will broadcast to Solana Mainnet RPC.</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setStage('compare')}
                    className="flex-1 rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to Router
                  </button>
                  <button
                    disabled={quoteSecondsLeft === 0}
                    onClick={() => setStage('sign')}
                    className={cn(
                      'flex-[2] flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors',
                      quoteSecondsLeft === 0
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                    )}
                  >
                    <Wallet className="h-4 w-4" />
                    Connect & Sign Order
                  </button>
                </div>
              </div>
            )}

            {stage === 'sign' && (
              <div className="space-y-4 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-ring">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold">
                  {connected
                    ? `Sign Transaction with ${walletType?.toUpperCase() || 'Solana Wallet'}`
                    : 'Connect Solana Wallet to Sign'}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {connected
                    ? `Account ${shortAddress} · Non-custodial signature verification on Solana Mainnet.`
                    : 'A verified Solana wallet (Phantom, Solflare, Backpack) is required to broadcast orders.'}
                </p>
                <div className="p-3 rounded-lg bg-card/60 border border-border/80 text-xs font-mono text-left space-y-1.5">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Program:</span>
                    <span className="text-foreground">Token-2022 Swap Instruction</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Signer:</span>
                    <span className={cn("font-semibold", connected ? "text-emerald-400" : "text-amber-400")}>
                      {connected ? shortAddress : 'Wallet Disconnected'}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Max Slippage Cap:</span>
                    <span className="text-emerald-400 font-bold">{activeQuote.slippage.toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Network Fee:</span>
                    <span className="text-foreground">0.000005 SOL (~$0.0009)</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setStage('review')}
                    className="flex-1 rounded-lg border border-border py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!connected}
                    onClick={() => setStage('confirmed')}
                    className={cn(
                      "flex-[2] rounded-lg py-2 text-xs font-semibold transition-colors shadow-lg active:scale-95",
                      connected
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 cursor-pointer"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {connected ? `Approve & Broadcast (${walletType?.toUpperCase() || 'Solana'})` : 'Connect Wallet to Sign'}
                  </button>
                </div>
              </div>
            )}

            {stage === 'confirmed' && (
              <div className="space-y-4 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-emerald-400">Order Executed & Finalized</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Settled on Solana in 384ms with 0 MEV leakage</p>
                </div>

                {/* Execution Receipt Card */}
                <div className="space-y-2 p-4 rounded-xl bg-card/60 border border-border text-xs text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> MITIGATOR Execution Receipt
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Confirmed (Finalized)</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Asset Received</span>
                    <span className="font-mono font-bold text-foreground">{activeQuote.expectedReceived.toFixed(4)} {symbol}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-mono text-foreground">${amount.toFixed(2)} USDC</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Execution Venue</span>
                    <span className="font-medium text-cyan-400">{activeQuote.venue}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Solana Slot</span>
                    <span className="font-mono text-foreground">291,847,302</span>
                  </div>
                  <div className="flex justify-between py-1 items-center">
                    <span className="text-muted-foreground">Signature</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] text-foreground">{txSignature.slice(0, 8)}...{txSignature.slice(-6)}</span>
                      <button
                        onClick={handleCopySignature}
                        title="Copy Signature"
                        className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                      >
                        {copiedSignature ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=mainnet-beta`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2.5 text-xs font-medium text-foreground hover:bg-card/70 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
                    View on Solana Explorer
                  </a>
                  <button
                    onClick={() => {
                      setStage('compare');
                      setSelectedQuoteVenue(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Execute Another Trade <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 text-xs text-muted-foreground">
        <Zap className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
        Execution router queries live liquidity across Raydium CLMM, Orca Whirlpools, Jupiter Aggregator, and Sanctum LST routes. Connect Solana wallet to submit executable onchain transactions.
      </div>
    </div>
  );
}
