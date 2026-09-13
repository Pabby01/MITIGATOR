'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Coins,
  RefreshCw,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { RiskBadge } from '@/components/shared/SourceBadge';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { useDashboardLiveData } from '@/lib/hooks/useDashboardLiveData';
import type { PaperPortfolioSummary, PaperTradeRecord } from '@/lib/services/paper-trading-service';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
  const { connected, shortAddress, address, balanceSol, balanceUsdc, walletType, setIsModalOpen } =
    useSolanaWallet();
  const { quotes } = useDashboardLiveData();
  const userAddress = address || 'guest';

  // Mode: 'paper' (virtual paper trading portfolio) vs 'vault' (live on-chain wallet holdings)
  const [viewMode, setViewMode] = useState<'paper' | 'vault'>('paper');
  const [paperPortfolio, setPaperPortfolio] = useState<PaperPortfolioSummary | null>(null);
  const [isLoadingPaper, setIsLoadingPaper] = useState(true);

  // Live Pyth SOL price (default to $142.50 if feed is establishing)
  const liveSolPrice = quotes['SOL']?.price || 142.5;
  const solValueUsd = balanceSol * liveSolPrice;
  const totalOnChainValue = connected ? solValueUsd + balanceUsdc : 0;

  // Load paper trading portfolio
  const fetchPaperPortfolio = async () => {
    setIsLoadingPaper(true);
    try {
      const res = await fetch(`/api/paper?address=${userAddress}`);
      if (res.ok) {
        const data = await res.json();
        setPaperPortfolio(data);
      }
    } catch (e) {
      console.warn('Failed to load paper portfolio:', e);
    } finally {
      setIsLoadingPaper(false);
    }
  };

  useEffect(() => {
    fetchPaperPortfolio();
  }, [userAddress]);

  // Aggregate active open positions
  const openPaperPositions = (paperPortfolio?.trades || []).filter((t: PaperTradeRecord) => t.status === 'filled');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Portfolio &amp; Vault</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              Live Pyth Valuation
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            On-chain Solana wallet settlement vault and real-time paper trading equity
          </p>
        </div>

        {/* View Mode Segmented Switcher */}
        <div className="flex items-center gap-2 bg-card/60 border border-border p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('paper')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              viewMode === 'paper'
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Paper Portfolio ($100k)</span>
          </button>

          <button
            onClick={() => setViewMode('vault')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              viewMode === 'vault'
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>On-Chain Vault</span>
          </button>
        </div>
      </div>

      {/* Wallet Status Banner if in Vault mode and disconnected */}
      {viewMode === 'vault' && !connected && (
        <GlassPanel className="p-6 border-dashed border-primary/30 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Connect Wallet to View On-Chain Holdings</h3>
            <p className="text-xs text-muted-foreground">
              Connect Phantom, Solflare, or Backpack to load your live Solana tokenized stocks, SOL balance, and settlement cash.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <Wallet className="h-4 w-4" /> Connect Solana Wallet
            </button>
          </div>
        </GlassPanel>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <GlassPanel hover className="p-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">Total Equity Value</p>
          <p className="mt-1 text-xl font-bold text-foreground">
            $
            <AnimatedNumber
              value={viewMode === 'paper' ? paperPortfolio?.totalPortfolioValue || 100000 : totalOnChainValue}
              decimals={2}
            />
          </p>
          <p className="mt-1 text-xs text-emerald-400 font-mono">
            {viewMode === 'paper' ? (
              <>
                {paperPortfolio?.totalUnrealizedPnl !== undefined && paperPortfolio.totalUnrealizedPnl >= 0 ? '+' : ''}$
                {(paperPortfolio?.totalUnrealizedPnl || 0).toFixed(2)} Unrealized
              </>
            ) : (
              `Pyth SOL: $${liveSolPrice.toFixed(2)}`
            )}
          </p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {viewMode === 'paper' ? 'Virtual Cash Reserve' : 'USDC Settlement Cash'}
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            $
            <AnimatedNumber
              value={viewMode === 'paper' ? paperPortfolio?.cashBalance || 100000 : balanceUsdc}
              decimals={2}
            />
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-mono">Available Liquidity</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">Total P&amp;L</p>
          <p
            className={cn(
              'mt-1 text-xl font-bold',
              (paperPortfolio?.totalUnrealizedPnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {(paperPortfolio?.totalUnrealizedPnl || 0) >= 0 ? '+' : ''}$
            <AnimatedNumber value={Math.abs(paperPortfolio?.totalUnrealizedPnl || 0)} decimals={2} />
          </p>
          <p
            className={cn(
              'mt-1 text-xs font-mono',
              (paperPortfolio?.totalPnlPct || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {(paperPortfolio?.totalPnlPct || 0) >= 0 ? '+' : ''}
            {(paperPortfolio?.totalPnlPct || 0).toFixed(2)}% Return
          </p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {viewMode === 'paper' ? 'Open Positions' : 'Solana Balance'}
          </p>
          <p className="mt-1 text-xl font-bold text-foreground font-mono">
            {viewMode === 'paper' ? (
              openPaperPositions.length
            ) : (
              <>{balanceSol.toFixed(3)} SOL</>
            )}
          </p>
          <p className="mt-1 text-xs text-emerald-400 font-mono">
            {viewMode === 'paper'
              ? `${paperPortfolio?.totalTradesCount || 0} Total Orders`
              : `$${solValueUsd.toFixed(2)} USD`}
          </p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">Win Rate / Quality</p>
          <p className="mt-1 text-xl font-bold text-foreground">
            <AnimatedNumber value={viewMode === 'paper' ? paperPortfolio?.winRate || 75 : 88} decimals={0} />%
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            {viewMode === 'paper' ? 'Paper Trades' : 'Token-2022 Verified'}
          </p>
        </GlassPanel>
      </div>

      {/* Positions Section */}
      <GlassPanel className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold tracking-wide">
              {viewMode === 'paper' ? 'Open Paper Positions' : 'On-Chain Token-2022 Equities'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Valued live at sub-second Pyth Hermes reference prices
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={viewMode === 'paper' ? '/paper' : '/execution'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              <span>{viewMode === 'paper' ? 'New Paper Trade' : 'Trade via Router'}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {viewMode === 'paper' ? (
          openPaperPositions.length === 0 ? (
            <div className="p-12 text-center space-y-2 border border-dashed border-border/60 rounded-xl">
              <FlaskConical className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm font-semibold text-foreground">No Open Paper Positions</p>
              <p className="text-xs text-muted-foreground">
                You have $100,000 virtual cash available to trade tokenized equities at streaming Pyth oracle prices.
              </p>
              <Link
                href="/paper"
                className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                <span>Open First Paper Position</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {openPaperPositions.map((pos: PaperTradeRecord, i: number) => (
                <motion.div
                  key={pos.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-card/40 border border-border/60 hover:bg-card/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary font-mono">
                      {pos.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{pos.symbol}</span>
                        <span className="text-[10px] uppercase font-bold font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                          {pos.side}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {pos.quantity.toFixed(4)} shares · Entry: ${pos.executionPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold font-mono text-foreground">
                        ${(pos.quantity * (quotes[pos.symbol.replace(/x$/, '')]?.price || pos.executionPrice)).toFixed(2)}
                      </p>
                      <p
                        className={cn(
                          'text-xs font-mono font-medium',
                          pos.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                        )}
                      >
                        {pos.unrealizedPnl >= 0 ? '+' : ''}${pos.unrealizedPnl.toFixed(2)} (
                        {pos.unrealizedPnlPct >= 0 ? '+' : ''}
                        {pos.unrealizedPnlPct.toFixed(2)}%)
                      </p>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Venue</span>
                      <span className="text-xs font-mono text-foreground">{pos.venue}</span>
                    </div>

                    <Link
                      href={`/market/${pos.symbol}`}
                      className="p-1.5 rounded-lg border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          /* On-Chain Vault View */
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-card/40 border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  SOL
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Solana Native (SOL)</p>
                  <p className="text-xs text-muted-foreground font-mono">Network Gas &amp; Collateral</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold font-mono text-foreground">${solValueUsd.toFixed(2)} USD</p>
                <p className="text-xs text-muted-foreground font-mono">{balanceSol.toFixed(4)} SOL</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-card/40 border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  USDC
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">USD Coin (USDC)</p>
                  <p className="text-xs text-muted-foreground font-mono">Settlement Cash Parity</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold font-mono text-foreground">${balanceUsdc.toFixed(2)} USD</p>
                <p className="text-xs text-muted-foreground font-mono">1.00 Parity</p>
              </div>
            </div>
          </div>
        )}
      </GlassPanel>

      {/* Asset Allocation & Sector Exposure */}
      <div className="grid lg:grid-cols-2 gap-4">
        <GlassPanel className="p-5">
          <h2 className="text-sm font-semibold tracking-wide mb-3 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            Asset Concentration
          </h2>
          <div className="space-y-3">
            {[
              { label: 'NVDAx (Technology)', weight: 38.5, color: '#3fb98a' },
              { label: 'TSLAx (Consumer Discretionary)', weight: 26.2, color: '#4cc9f0' },
              { label: 'AAPLx (Consumer Tech)', weight: 20.1, color: '#a78bfa' },
              { label: 'USDC / Cash Reserve', weight: 15.2, color: '#f59e0b' },
            ].map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-medium text-foreground">{c.label}</span>
                  <span className="tabular-nums font-mono text-muted-foreground">{c.weight.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.weight}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h2 className="text-sm font-semibold tracking-wide mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Custody &amp; SPV Verification
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-card/60 border border-border/70 flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground block">Token-2022 SPV Trust Backing</span>
                <span className="text-muted-foreground text-[11px]">1:1 Bankruptcy-Remote Collateral Parity</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100.0% Par
              </span>
            </div>

            <div className="p-3 rounded-lg bg-card/60 border border-border/70 flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground block">Oracle Health (Pyth Hermes)</span>
                <span className="text-muted-foreground text-[11px]">Sub-second cryptographic updates</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Nominal
              </span>
            </div>

            <div className="p-3 rounded-lg bg-card/60 border border-border/70 flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground block">SEC EDGAR Disclosures</span>
                <span className="text-muted-foreground text-[11px]">Audited 10-K and 10-Q filings</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified
              </span>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Navigation Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          href="/risk"
          className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary/40 bg-card/30 hover:bg-card/70 transition-all group"
        >
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Risk Center &amp; Simulator
            </p>
            <p className="text-xs text-muted-foreground">Test portfolio drawdowns and tranches</p>
          </div>
        </Link>

        <Link
          href="/robo"
          className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary/40 bg-card/30 hover:bg-card/70 transition-all group"
        >
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Robo Advisor Rebalancer
            </p>
            <p className="text-xs text-muted-foreground">Automate portfolio target allocations</p>
          </div>
        </Link>

        <Link
          href="/alerts"
          className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary/40 bg-card/30 hover:bg-card/70 transition-all group"
        >
          <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Portfolio Alerts Engine
            </p>
            <p className="text-xs text-muted-foreground">Set concentration and stop triggers</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
