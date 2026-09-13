'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  X,
  CheckCircle2,
  RefreshCw,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { GlassPanel, MetricCard } from '@/components/shared/GlassPanel';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { PaperPortfolioSummary, PaperTradeRecord } from '@/lib/services/paper-trading-service';
import { getAllAssets } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function PaperTradingPage() {
  const assets = getAllAssets();
  const { address } = useSolanaWallet();
  const userAddr = address || 'guest';

  const [portfolio, setPortfolio] = useState<PaperPortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  // New trade state
  const [tradeSymbol, setTradeSymbol] = useState('NVDAx');
  const [tradeSide, setTradeSide] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState(2500);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`/api/paper?address=${userAddr}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.warn('Failed to load paper portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // Poll every 8s for live Pyth oracle updates
    const interval = setInterval(fetchPortfolio, 8000);
    return () => clearInterval(interval);
  }, [userAddr]);

  const handleExecuteTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeAmount <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          userAddress: userAddr,
          symbol: tradeSymbol,
          side: tradeSide,
          amountUsd: tradeAmount,
          venue: 'Jupiter DLMM',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.portfolio) {
          setPortfolio(data.portfolio);
        }
        setIsTradeModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to submit paper trade:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePosition = async (tradeId: string) => {
    try {
      const res = await fetch('/api/paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'close',
          userAddress: userAddr,
          tradeId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.portfolio) {
          setPortfolio(data.portfolio);
        }
      }
    } catch (err) {
      console.warn('Failed to close paper position:', err);
    }
  };

  const trades = portfolio?.trades || [];
  const balance = portfolio?.cashBalance || 100000;
  const totalVal = portfolio?.totalPortfolioValue || 100000;
  const totalPnl = (portfolio?.totalUnrealizedPnl || 0) + (portfolio?.totalRealizedPnl || 0);
  const totalTradesCount = portfolio?.totalTradesCount ?? trades.length;
  const winRate = totalTradesCount > 0 ? (portfolio?.winRate ?? 0) : 0;

  // Real dynamic metrics computed from actual trades
  const avgSlippage = trades.length > 0
    ? (trades.reduce((sum, t) => sum + (t.slippagePct || 0), 0) / trades.length).toFixed(2)
    : '0.00';

  const totalFees = trades.length > 0
    ? (trades.length * 0.05).toFixed(2)
    : '0.00';

  const bestTrade = trades.length > 0
    ? [...trades].sort((a, b) => (b.unrealizedPnlPct || 0) - (a.unrealizedPnlPct || 0))[0]
    : null;

  const bestPerformerDisplay = bestTrade
    ? `${bestTrade.symbol} (${bestTrade.unrealizedPnlPct >= 0 ? '+' : ''}${bestTrade.unrealizedPnlPct.toFixed(2)}%)`
    : 'None (0 Trades)';

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paper Trading Terminal</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Forward-test tokenized equity strategies with live Pyth oracle prices and zero capital risk.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTradeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> New Paper Trade
          </button>
        </div>
      </div>

      {/* Top metrics with live AnimatedNumber */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassPanel hover className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Virtual Cash Balance</p>
          <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
            $<AnimatedNumber value={balance} decimals={2} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-mono">Available Liquidity</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Portfolio Value</p>
          <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
            $<AnimatedNumber value={totalVal} decimals={2} />
          </p>
          <p className={cn('mt-1 text-xs font-mono', totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)} ({((totalPnl / 100000) * 100).toFixed(2)}%)
          </p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Simulated Win Rate</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400 tabular-nums">
            {totalTradesCount > 0 ? `${winRate}%` : '0%'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-mono">{totalTradesCount} Total Executions</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Open Positions</p>
          <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
            {portfolio?.openPositionsCount || 0}
          </p>
          <p className="mt-1 text-xs text-cyan-400 font-mono">Streaming Pyth Oracle</p>
        </GlassPanel>
      </div>

      {/* Trade journal */}
      <GlassPanel className="overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide">Simulated Trade Journal</h2>
          <span className="text-xs font-mono text-muted-foreground">
            Latency Grounded in Pyth Hermes
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground tracking-wider uppercase">
                <th className="text-left font-medium px-4 py-3">Symbol</th>
                <th className="text-center font-medium px-4 py-3">Side</th>
                <th className="text-right font-medium px-4 py-3">Size (USD)</th>
                <th className="text-right font-medium px-4 py-3">Entry Price</th>
                <th className="text-right font-medium px-4 py-3">Live Pyth Price</th>
                <th className="text-right font-medium px-4 py-3">Venue</th>
                <th className="text-right font-medium px-4 py-3">Slippage</th>
                <th className="text-right font-medium px-4 py-3">Floating P&L</th>
                <th className="text-center font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-xs text-muted-foreground">
                    No simulated trades yet. Click &quot;New Paper Trade&quot; to practice executing orders.
                  </td>
                </tr>
              ) : (
                trades.map((trade, i) => (
                  <motion.tr
                    key={trade.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-border/50 hover:bg-card/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">{trade.symbol}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded uppercase',
                          trade.side === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        )}
                      >
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono">${trade.amountUsd.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono">${trade.executionPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono text-cyan-400">
                      ${trade.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">{trade.venue}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-xs text-muted-foreground">
                      {trade.slippagePct.toFixed(2)}%
                    </td>
                    <td
                      className={cn(
                        'px-4 py-3 text-right tabular-nums font-semibold font-mono',
                        trade.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {trade.unrealizedPnl >= 0 ? '+' : ''}${trade.unrealizedPnl.toFixed(2)} ({trade.unrealizedPnlPct >= 0 ? '+' : ''}
                      {trade.unrealizedPnlPct.toFixed(1)}%)
                    </td>
                    <td className="px-4 py-3 text-center">
                      {trade.status === 'filled' ? (
                        <button
                          onClick={() => handleClosePosition(trade.id)}
                          className="px-2.5 py-1 rounded-lg text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                        >
                          Close
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Closed</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Strategy performance */}
      <GlassPanel className="p-5">
        <h2 className="text-sm font-semibold tracking-wide mb-4">Simulated Execution Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Total Executions</p>
            <p className="text-xl font-bold tabular-nums">{totalTradesCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Simulated Slippage</p>
            <p className="text-xl font-bold tabular-nums text-amber-400">
              {avgSlippage}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Simulated Fees</p>
            <p className="text-xl font-bold tabular-nums text-muted-foreground">
              ${totalFees}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Best Performer</p>
            <p
              className={cn(
                'text-base font-bold tabular-nums truncate',
                bestTrade ? 'text-emerald-400' : 'text-muted-foreground font-normal'
              )}
            >
              {bestPerformerDisplay}
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* New Paper Trade Modal */}
      <AnimatePresence>
        {isTradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-base">New Paper Order</h3>
                </div>
                <button
                  onClick={() => setIsTradeModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleExecuteTrade} className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Asset Symbol</label>
                  <select
                    value={tradeSymbol}
                    onChange={(e) => setTradeSymbol(e.target.value)}
                    className="w-full rounded-xl bg-background/60 border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  >
                    {assets.map((a) => (
                      <option key={a.tokenizedAsset.symbol} value={a.tokenizedAsset.symbol}>
                        {a.tokenizedAsset.symbol} — {a.tokenizedAsset.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Action</label>
                    <div className="grid grid-cols-2 gap-1 rounded-xl bg-background/60 border border-border p-1">
                      <button
                        type="button"
                        onClick={() => setTradeSide('buy')}
                        className={cn(
                          'py-1.5 text-xs font-semibold rounded-lg transition-colors',
                          tradeSide === 'buy' ? 'bg-emerald-500 text-white' : 'text-muted-foreground'
                        )}
                      >
                        Buy
                      </button>
                      <button
                        type="button"
                        onClick={() => setTradeSide('sell')}
                        className={cn(
                          'py-1.5 text-xs font-semibold rounded-lg transition-colors',
                          tradeSide === 'sell' ? 'bg-red-500 text-white' : 'text-muted-foreground'
                        )}
                      >
                        Sell
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Order Size (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm text-muted-foreground">$</span>
                      <input
                        type="number"
                        min="10"
                        max="50000"
                        step="100"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(Number(e.target.value))}
                        className="w-full rounded-xl bg-background/60 border border-border pl-7 pr-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Execution Feed:</span>
                    <span className="text-emerald-400">Pyth Hermes Low-Latency</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Simulated Venue:</span>
                    <span className="text-foreground">Jupiter v6 Aggregator</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Simulated Slippage Cap:</span>
                    <span className="text-foreground">0.15%</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Executing against Pyth Oracle...' : `Simulate ${tradeSide.toUpperCase()} Order`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
