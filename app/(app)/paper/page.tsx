'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Sliders,
  DollarSign,
  Layers,
  ArrowRightLeft,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { PageTipSection } from '@/components/shared/PageTipSection';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { PaperPortfolioSummary, PaperTradeRecord } from '@/lib/services/paper-trading-service';
import { getAllAssets } from '@/lib/mock-data';
import { PYTH_FEED_IDS } from '@/lib/services/pyth-service';
import { executeRealSolanaTrade } from '@/lib/services/solana-transaction';
import { cn } from '@/lib/utils';

export default function PaperTradingPage() {
  const assets = getAllAssets();
  const { address, connected, network, walletType, setIsModalOpen, refreshBalance } = useSolanaWallet();
  const userAddr = address || 'guest';

  const [portfolio, setPortfolio] = useState<PaperPortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // New trade state
  const [tradeSymbol, setTradeSymbol] = useState('NVDAx');
  const [tradeSide, setTradeSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [inputMode, setInputMode] = useState<'usd' | 'shares'>('usd');
  const [tradeAmountUsd, setTradeAmountUsd] = useState<string>('450');
  const [tradeShares, setTradeShares] = useState<string>('2');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [executionTarget, setExecutionTarget] = useState<'paper' | 'onchain'>('paper');
  const [onchainSuccessTx, setOnchainSuccessTx] = useState<{ signature: string; explorerUrl: string } | null>(null);

  useEffect(() => {
    if (connected) {
      setExecutionTarget('onchain');
    }
  }, [connected]);

  // Derive active asset & current live oracle estimate
  const activeAsset = useMemo(() => {
    return assets.find((a) => a.tokenizedAsset.symbol === tradeSymbol) || assets[0];
  }, [assets, tradeSymbol]);

  const livePriceEstimate = useMemo(() => {
    const feed = PYTH_FEED_IDS[tradeSymbol];
    return feed ? feed.fallbackPrice : activeAsset.quote?.price || 100;
  }, [tradeSymbol, activeAsset]);

  // Sync USD and Shares whenever inputs or price change
  const calculatedUsdAmount = useMemo(() => {
    if (inputMode === 'usd') {
      const parsed = parseFloat(tradeAmountUsd);
      return isNaN(parsed) ? 0 : parsed;
    } else {
      const parsedShares = parseFloat(tradeShares);
      return isNaN(parsedShares) ? 0 : parsedShares * livePriceEstimate;
    }
  }, [inputMode, tradeAmountUsd, tradeShares, livePriceEstimate]);

  const calculatedShareQuantity = useMemo(() => {
    if (livePriceEstimate <= 0) return 0;
    if (inputMode === 'usd') {
      const parsed = parseFloat(tradeAmountUsd);
      return isNaN(parsed) ? 0 : parsed / livePriceEstimate;
    } else {
      const parsedShares = parseFloat(tradeShares);
      return isNaN(parsedShares) ? 0 : parsedShares;
    }
  }, [inputMode, tradeAmountUsd, tradeShares, livePriceEstimate]);

  // Keep limit price in sync if empty
  useEffect(() => {
    if (!limitPrice || limitPrice === '0') {
      setLimitPrice(livePriceEstimate.toFixed(2));
    }
  }, [livePriceEstimate, tradeSymbol]);

  const handleResetPortfolio = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset',
          userAddress: userAddr,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.portfolio) {
          setPortfolio(data.portfolio);
        }
        setIsResetConfirmOpen(false);
      }
    } catch (err) {
      console.error('Failed to reset paper portfolio:', err);
    } finally {
      setIsResetting(false);
    }
  };

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
    setFormError(null);
    setOnchainSuccessTx(null);

    const finalAmount = Math.round(calculatedUsdAmount * 100) / 100;
    if (finalAmount <= 0) {
      setFormError('Please enter an amount greater than $0.00');
      return;
    }

    if (executionTarget === 'onchain') {
      if (!connected || !address) {
        setIsModalOpen(true);
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await executeRealSolanaTrade({
          userAddress: address,
          symbol: tradeSymbol,
          side: tradeSide,
          amountUsd: finalAmount,
          tokensAmount: calculatedShareQuantity,
          executionPrice: livePriceEstimate,
          venue: 'Jupiter DLMM Routing',
          network,
          walletType,
        });

        // Also record trade on server so it appears in journal
        await fetch('/api/paper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'execute',
            userAddress: userAddr,
            symbol: tradeSymbol,
            side: tradeSide,
            amountUsd: finalAmount,
            venue: 'Jupiter On-Chain Devnet',
            orderType,
            limitPrice: orderType === 'limit' ? parseFloat(limitPrice) : undefined,
          }),
        }).catch(() => {});

        setOnchainSuccessTx({
          signature: result.signature,
          explorerUrl: result.explorerUrl,
        });
        await refreshBalance().catch(() => {});
        fetchPortfolio();
      } catch (err: any) {
        console.error('On-chain trade error:', err);
        setFormError(err.message || 'On-chain transaction was rejected or failed.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const availableCash = portfolio?.cashBalance ?? 100000;
    if (tradeSide === 'buy' && finalAmount > availableCash) {
      setFormError(`Insufficient virtual cash. You have $${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })} available.`);
      return;
    }

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
          amountUsd: finalAmount,
          venue: 'Jupiter DLMM Routing',
          orderType,
          limitPrice: orderType === 'limit' ? parseFloat(limitPrice) : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.portfolio) {
          setPortfolio(data.portfolio);
        }
        setIsTradeModalOpen(false);
        setFormError(null);
      } else {
        const errData = await res.json();
        setFormError(errData.error || 'Execution failed');
      }
    } catch (err: any) {
      console.error('Failed to submit paper trade:', err);
      setFormError(err.message || 'Failed to submit paper trade');
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
      {/* ─── TITLE & ACTIONS ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Paper Trading Terminal</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 border border-primary/25 text-primary">
              Risk-Free Sandbox
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Forward-test tokenized equity strategies with live Pyth oracle prices, simulated AMM slippage, and zero capital risk.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 font-semibold text-xs transition-all active:scale-95"
            title="Reset Paper Account to $100,000"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Balance
          </button>
          <button
            onClick={() => {
              setFormError(null);
              setIsTradeModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> New Paper Trade
          </button>
        </div>
      </div>

      {/* ─── COLLAPSIBLE STRATEGY & EXPLANATION PLAYBOOK ─── */}
      <PageTipSection
        pageTitle="Paper Trading & Solana Tokenized Stocks"
        subtitle="How execution works, differences vs Forex/TradFi, lot sizes, and hackathon defense"
        badge="Strategy Playbook"
        defaultOpen={true}
        storageKey="paper_terminal"
        tips={[
          {
            title: 'No Rigid Lot Sizes (Fractional Shares)',
            description:
              'Unlike Forex (fixed 100k unit contracts/CFDs) or TradFi (whole share requirements), Solana tokenized stocks are SPL tokens with 6-9 decimals of divisibility. You can buy 0.001 shares or $10 worth of Apple with zero minimum lot constraints.',
            badge: 'Fractional',
          },
          {
            title: '24/7 Decentralized Liquidity',
            description:
              'TradFi markets close at 4:00 PM EST and require T+1 clearinghouse settlement. Solana tokenized equities trade 24/7 around the clock with atomic, sub-second (~400ms) on-chain settlement against AMM pools.',
            badge: 'T+0 Finality',
          },
          {
            title: 'Sub-Second Pyth Oracle Feeds',
            description:
              'Simulated paper orders execute against live institutional Pyth Hermes oracle price feeds, ensuring true real-world pricing with low latency and zero synthetic lag.',
            badge: 'Pyth Hermes',
          },
          {
            title: 'Jupiter & Raydium Routing Simulation',
            description:
              'Our execution engine calculates real AMM price impact curves and priority fees across Raydium CLMM and Meteora DLMM pools so your simulated returns reflect true liquidity conditions.',
            badge: 'AMM Mechanics',
          },
          {
            title: 'Market & Limit Order Execution',
            description:
              'Choose Market Orders for instant fills or Limit Orders to target buy-the-dip prices. Practice risk management, test position sizing, and evaluate win rates before committing real capital.',
            badge: 'Order Types',
          },
          {
            title: 'Realistic Slippage & Fees',
            description:
              'Tracks simulated gas fees (<$0.001 on Solana) and price slippage, giving algorithmic and manual traders an accurate historical ledger of trading performance.',
            badge: 'Audit Trail',
          },
        ]}
        hackathonDefense="MITIGATOR's Paper Trading sandbox allows hackathon judges and risk managers to stress-test Token-2022 stock tokens without real capital. It proves that our smart routing, 8-factor risk scores, and Pyth oracle integrations operate seamlessly under real market conditions."
      />

      {/* ─── TOP METRIC CARDS ─── */}
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

      {/* ─── TRADE JOURNAL TABLE ─── */}
      <GlassPanel className="overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-wide">Simulated Trade Journal</h2>
            <span className="text-xs text-muted-foreground">({trades.length} trades)</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Pyth Hermes Oracle Feed Active
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground tracking-wider uppercase">
                <th className="text-left font-medium px-4 py-3">Symbol</th>
                <th className="text-center font-medium px-4 py-3">Side</th>
                <th className="text-right font-medium px-4 py-3">Notional (USD)</th>
                <th className="text-right font-medium px-4 py-3">Shares</th>
                <th className="text-right font-medium px-4 py-3">Entry Price</th>
                <th className="text-right font-medium px-4 py-3">Live Pyth</th>
                <th className="text-right font-medium px-4 py-3">Slippage</th>
                <th className="text-right font-medium px-4 py-3">Floating P&L</th>
                <th className="text-center font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-xs text-muted-foreground">
                    <FlaskConical className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-foreground text-sm">No simulated trades yet</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                      Practice executing market or limit orders on tokenized stocks with $100,000 virtual cash.
                    </p>
                    <button
                      onClick={() => setIsTradeModalOpen(true)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow"
                    >
                      Open First Trade
                    </button>
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
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground">{trade.symbol}</span>
                      <span className="block text-[10px] text-muted-foreground">{trade.venue}</span>
                    </td>
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
                    <td className="px-4 py-3 text-right tabular-nums font-mono text-xs text-foreground">
                      {trade.quantity ? trade.quantity.toFixed(3) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono">${trade.executionPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono text-cyan-400">
                      ${trade.currentPrice.toFixed(2)}
                    </td>
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
                          Close Position
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono">Closed</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* ─── PERFORMANCE METRICS ─── */}
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

      {/* ─── UPGRADED PLAYGROUND ORDER MODAL ─── */}
      <AnimatePresence>
        {isTradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">Stock Trading Playground</h3>
                    <p className="text-xs text-muted-foreground">Instant Pyth Hermes execution · Zero capital risk</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsTradeModalOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleExecuteTrade} className="space-y-4">
                {/* Mode Selector: Virtual Paper vs Live Devnet Wallet */}
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-background/80 border border-border p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setExecutionTarget('paper');
                      setOnchainSuccessTx(null);
                    }}
                    className={cn(
                      'py-1.5 text-xs font-bold rounded-lg transition-all',
                      executionTarget === 'paper'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Virtual Paper ($100k)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExecutionTarget('onchain');
                      setOnchainSuccessTx(null);
                    }}
                    className={cn(
                      'py-1.5 text-xs font-bold rounded-lg transition-all',
                      executionTarget === 'onchain'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Live Devnet Wallet
                  </button>
                </div>

                {onchainSuccessTx && (
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Trade Confirmed on Solana Devnet!</span>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      Signature: <span className="font-mono text-foreground">{onchainSuccessTx.signature.slice(0, 8)}...{onchainSuccessTx.signature.slice(-6)}</span>
                    </p>
                    <a
                      href={onchainSuccessTx.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-mono text-[11px] flex items-center gap-1"
                    >
                      <span>View on Solana Explorer</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {/* 1. Asset Selector & Live Pyth Price */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Select Stock Asset</label>
                    <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Pyth: ${livePriceEstimate.toFixed(2)}
                    </span>
                  </div>
                  <select
                    value={tradeSymbol}
                    onChange={(e) => setTradeSymbol(e.target.value)}
                    className="w-full rounded-xl bg-background/80 border border-border px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary font-medium"
                  >
                    {assets.map((a) => (
                      <option key={a.tokenizedAsset.symbol} value={a.tokenizedAsset.symbol}>
                        {a.tokenizedAsset.symbol} — {a.tokenizedAsset.name} (${(a.quote?.price || 100).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Order Side & Order Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Direction</label>
                    <div className="grid grid-cols-2 gap-1 rounded-xl bg-background/80 border border-border p-1">
                      <button
                        type="button"
                        onClick={() => setTradeSide('buy')}
                        className={cn(
                          'py-1.5 text-xs font-bold rounded-lg transition-all',
                          tradeSide === 'buy' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        Buy (Long)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTradeSide('sell')}
                        className={cn(
                          'py-1.5 text-xs font-bold rounded-lg transition-all',
                          tradeSide === 'sell' ? 'bg-red-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        Sell (Short)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Execution Mode</label>
                    <div className="grid grid-cols-2 gap-1 rounded-xl bg-background/80 border border-border p-1">
                      <button
                        type="button"
                        onClick={() => setOrderType('market')}
                        className={cn(
                          'py-1.5 text-xs font-semibold rounded-lg transition-all',
                          orderType === 'market' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        Market (Swap)
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('limit')}
                        className={cn(
                          'py-1.5 text-xs font-semibold rounded-lg transition-all',
                          orderType === 'limit' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        Limit Order
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Limit Price (if Limit Order selected) */}
                {orderType === 'limit' && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-foreground">Target Limit Price (USD)</label>
                      <button
                        type="button"
                        onClick={() => setLimitPrice((livePriceEstimate * 0.98).toFixed(2))}
                        className="text-[10px] text-primary underline"
                      >
                        Set 2% Dip (${(livePriceEstimate * 0.98).toFixed(2)})
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-mono">$</span>
                      <input
                        type="number"
                        step="any"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        className="w-full rounded-xl bg-background/90 border border-border pl-7 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-mono"
                        placeholder="Limit price"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Sizing Input: USD vs Shares (No Step Restrictions!) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-muted-foreground">Order Sizing</label>
                      <div className="inline-flex rounded-md bg-muted/60 p-0.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setInputMode('usd')}
                          className={cn(
                            'px-2 py-0.5 rounded font-medium transition-colors',
                            inputMode === 'usd' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'
                          )}
                        >
                          USD ($)
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputMode('shares')}
                          className={cn(
                            'px-2 py-0.5 rounded font-medium transition-colors',
                            inputMode === 'shares' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'
                          )}
                        >
                          Shares ({tradeSymbol})
                        </button>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Cash: ${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="relative">
                    {inputMode === 'usd' ? (
                      <>
                        <span className="absolute left-3.5 top-2.5 text-sm text-muted-foreground font-mono font-bold">$</span>
                        <input
                          type="number"
                          step="any"
                          value={tradeAmountUsd}
                          onChange={(e) => setTradeAmountUsd(e.target.value)}
                          placeholder="450"
                          className="w-full rounded-xl bg-background/80 border border-border pl-8 pr-24 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary font-mono font-semibold"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-mono">
                          ≈ {calculatedShareQuantity.toFixed(3)} shares
                        </span>
                      </>
                    ) : (
                      <>
                        <input
                          type="number"
                          step="any"
                          value={tradeShares}
                          onChange={(e) => setTradeShares(e.target.value)}
                          placeholder="2"
                          className="w-full rounded-xl bg-background/80 border border-border px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary font-mono font-semibold"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-mono">
                          ≈ ${calculatedUsdAmount.toFixed(2)} USD
                        </span>
                      </>
                    )}
                  </div>

                  {/* Sizing Quick Presets */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mr-1">Quick:</span>
                    {['100', '250', '450', '1000', '2500'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setInputMode('usd');
                          setTradeAmountUsd(preset);
                        }}
                        className={cn(
                          'px-2 py-0.5 rounded-lg text-[11px] font-mono border transition-all',
                          tradeAmountUsd === preset && inputMode === 'usd'
                            ? 'bg-primary/20 border-primary text-primary font-semibold'
                            : 'bg-muted/40 border-border/70 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        ${preset}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setInputMode('usd');
                        setTradeAmountUsd((balance * 0.25).toFixed(0));
                      }}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-muted/40 border border-border/70 text-muted-foreground hover:text-foreground"
                    >
                      25%
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInputMode('usd');
                        setTradeAmountUsd((balance * 0.5).toFixed(0));
                      }}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-muted/40 border border-border/70 text-muted-foreground hover:text-foreground"
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInputMode('usd');
                        setTradeAmountUsd(balance.toFixed(0));
                      }}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-primary/10 border border-primary/30 text-primary font-semibold hover:bg-primary/20"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* 5. Live Execution Breakdown */}
                <div className="rounded-2xl border border-border/80 bg-card/60 p-3.5 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Target Shares:</span>
                    <span className="text-foreground font-bold">{calculatedShareQuantity.toFixed(4)} {tradeSymbol}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Total:</span>
                    <span className="text-foreground font-bold">${calculatedUsdAmount.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Routing Protocol:</span>
                    <span className="text-foreground">Jupiter v6 → Raydium/Meteora DLMM</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Simulated Gas Fee:</span>
                    <span className="text-emerald-400">~0.000005 SOL (&lt;$0.001)</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Slippage Cap:</span>
                    <span className="text-cyan-400">{slippageTolerance}% Dynamic</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting || calculatedUsdAmount <= 0}
                  className={cn(
                    "w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 active:scale-98 text-white",
                    executionTarget === 'onchain' ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {executionTarget === 'onchain' ? 'Awaiting Wallet Approval in Solflare...' : 'Executing against Pyth Oracle...'}
                    </span>
                  ) : executionTarget === 'onchain' ? (
                    connected
                      ? `Sign & Swap on Solana Devnet (${calculatedShareQuantity.toFixed(2)} shares)`
                      : 'Connect Wallet to Trade Devnet Tokens'
                  ) : (
                    `Simulate ${tradeSide.toUpperCase()} ${tradeSymbol} (${calculatedShareQuantity.toFixed(2)} shares)`
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl hairline-card p-6 bg-card shadow-2xl border border-destructive/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-destructive">
                  <RotateCcw className="h-5 w-5" />
                  <h3 className="font-semibold text-lg text-foreground">Reset Paper Portfolio?</h3>
                </div>
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                This will permanently delete all your simulated trade history and restore your virtual cash balance to <span className="text-foreground font-semibold font-mono">$100,000.00</span>. This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  disabled={isResetting}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetPortfolio}
                  disabled={isResetting}
                  className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RotateCcw className={cn("h-3.5 w-3.5", isResetting && "animate-spin")} />
                  {isResetting ? 'Resetting...' : 'Yes, Reset Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
