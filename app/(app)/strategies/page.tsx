'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  TrendingUp,
  Users,
  Copy,
  FlaskConical,
  CheckCircle2,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Layers,
  X,
  Loader2,
  ExternalLink,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { RiskBadge } from '@/components/shared/SourceBadge';
import { PageTipSection } from '@/components/shared/PageTipSection';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { getUserProfile, UserProfile } from '@/lib/services/user-profile';
import { MarketplaceStrategy, StrategySubscription } from '@/lib/services/strategies-service';
import { cn } from '@/lib/utils';

export default function StrategiesPage() {
  const { connected, address, setIsModalOpen } = useSolanaWallet();
  const userAddress = address || 'guest';
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserProfile(userAddress).then(setUserProfile);
  }, [userAddress]);

  const [strategies, setStrategies] = useState<MarketplaceStrategy[]>([]);
  const [subscriptions, setSubscriptions] = useState<StrategySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'low' | 'moderate' | 'elevated' | 'subscribed'>('all');

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Copy Modal State
  const [copyTargetStrat, setCopyTargetStrat] = useState<MarketplaceStrategy | null>(null);
  const [copyAmount, setCopyAmount] = useState<number>(2500);

  // Create Strategy Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStratName, setNewStratName] = useState('');
  const [newStratDesc, setNewStratDesc] = useState('');
  const [newStratRisk, setNewStratRisk] = useState<'low' | 'moderate' | 'elevated'>('moderate');
  const [newStratMethodology, setNewStratMethodology] = useState('');
  const [newStratAsset, setNewStratAsset] = useState('NVDAx');
  const [isCreatingStrat, setIsCreatingStrat] = useState(false);

  // Fetch strategies from API
  const fetchStrategies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/strategies?address=${userAddress}`);
      if (res.ok) {
        const data = await res.json();
        setStrategies(data.strategies || []);
        setSubscriptions(data.subscriptions || []);
      }
    } catch (err) {
      console.warn('Failed to load strategies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, [userAddress]);

  // Handle Follow / Unfollow
  const handleToggleFollow = async (strat: MarketplaceStrategy) => {
    if (!connected) {
      setIsModalOpen(true);
      return;
    }

    setActionLoadingId(strat.id);
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'follow',
          strategyId: strat.id,
          userAddress,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local subscriptions
        setSubscriptions((prev) => {
          const exists = prev.find((s) => s.strategyId === strat.id && s.type === 'follow');
          if (exists) {
            return prev.filter((s) => !(s.strategyId === strat.id && s.type === 'follow'));
          } else {
            return [
              ...prev,
              {
                id: `sub-${Date.now()}`,
                userAddress,
                strategyId: strat.id,
                type: 'follow',
                allocationUsd: 0,
                createdAt: new Date().toISOString(),
              },
            ];
          }
        });

        // Update followers count
        setStrategies((prev) =>
          prev.map((s) =>
            s.id === strat.id
              ? { ...s, followers: s.followers + (data.isFollowing ? 1 : -1) }
              : s
          )
        );

        setStatusMessage({
          type: 'success',
          text: data.isFollowing ? `Now following ${strat.name}` : `Unfollowed ${strat.name}`,
        });
      }
    } catch (err) {
      console.error('Follow error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to update follow state.' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Handle Copy Execution
  const handleExecuteCopy = async () => {
    if (!copyTargetStrat) return;

    if (!connected) {
      setIsModalOpen(true);
      return;
    }

    setActionLoadingId(copyTargetStrat.id);
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'copy',
          strategyId: copyTargetStrat.id,
          allocationUsd: copyAmount,
          userAddress,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubscriptions((prev) => [
          ...prev.filter((s) => !(s.strategyId === copyTargetStrat.id && s.type === 'copy')),
          {
            id: `copy-${Date.now()}`,
            userAddress,
            strategyId: copyTargetStrat.id,
            type: 'copy',
            allocationUsd: copyAmount,
            createdAt: new Date().toISOString(),
          },
        ]);

        setStatusMessage({
          type: 'success',
          text: data.message || `Copy trading initiated with $${copyAmount.toLocaleString()} allocation.`,
        });
        setCopyTargetStrat(null);
      }
    } catch (err) {
      console.error('Copy error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to configure copy trade.' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Handle Deploy to Paper Trading
  const handleDeployPaper = async (strat: MarketplaceStrategy) => {
    setActionLoadingId(strat.id);
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'paper',
          strategyId: strat.id,
          allocationUsd: 2500,
          userAddress,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubscriptions((prev) => [
          ...prev.filter((s) => !(s.strategyId === strat.id && s.type === 'paper')),
          {
            id: `paper-${Date.now()}`,
            userAddress,
            strategyId: strat.id,
            type: 'paper',
            allocationUsd: 2500,
            createdAt: new Date().toISOString(),
          },
        ]);

        setStatusMessage({
          type: 'success',
          text: `Deployed $2,500 virtual allocation to ${strat.name} in Paper Trading!`,
        });
      }
    } catch (err) {
      console.error('Paper deploy error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to deploy to Paper Trading.' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Handle Delete Custom Strategy
  const handleDeleteStrategy = async (stratId: string) => {
    if (!confirm('Are you sure you want to delete this custom strategy?')) return;
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          strategyId: stratId,
        }),
      });
      if (res.ok) {
        setStrategies((prev) => prev.filter((s) => s.id !== stratId));
        setSubscriptions((prev) => prev.filter((s) => s.strategyId !== stratId));
        setStatusMessage({ type: 'success', text: 'Custom strategy deleted.' });
      }
    } catch (err) {
      console.error('Delete strategy error:', err);
    }
  };

  // Handle Cancel Copy
  const handleCancelCopy = async (stratId: string) => {
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel_copy',
          strategyId: stratId,
          userAddress,
        }),
      });
      if (res.ok) {
        setSubscriptions((prev) => prev.filter((s) => s.strategyId !== stratId));
        setStatusMessage({ type: 'success', text: 'Copy trading subscription cancelled.' });
        setCopyTargetStrat(null);
      }
    } catch (err) {
      console.error('Cancel copy error:', err);
    }
  };

  // Handle Create Strategy
  const handleCreateCustomStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStratName.trim()) return;

    setIsCreatingStrat(true);
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userAddress,
          strategyData: {
            name: newStratName,
            description: newStratDesc || 'Rule-based quantitative momentum model.',
            riskLevel: newStratRisk,
            methodology: newStratMethodology || 'Volatility-scaled breakout with stop-loss protection.',
            targetAssets: [newStratAsset],
            roi: 0,
            drawdown: 0,
            sharpe: 0,
            winRate: 0,
            volatility: 0,
            tradeFrequency: 0,
            holdingPeriod: 'Active',
            concentration: 0,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.strategy) {
          setStrategies((prev) => [data.strategy, ...prev]);
          setStatusMessage({ type: 'success', text: `Strategy "${data.strategy.name}" registered successfully!` });
          setIsCreateModalOpen(false);
          setNewStratName('');
          setNewStratDesc('');
          setNewStratMethodology('');
        }
      }
    } catch (err) {
      console.error('Create strategy error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to register custom strategy.' });
    } finally {
      setIsCreatingStrat(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Filter strategies
  const filteredStrategies = strategies.filter((strat) => {
    if (filter === 'verified') return strat.verified;
    if (filter === 'low') return strat.riskLevel === 'low';
    if (filter === 'moderate') return strat.riskLevel === 'moderate';
    if (filter === 'elevated') return strat.riskLevel === 'elevated' || strat.riskLevel === 'high';
    if (filter === 'subscribed') {
      return subscriptions.some((s) => s.strategyId === strat.id);
    }
    return true;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium shadow-lg',
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            )}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            {statusMessage.text.includes('Paper Trading') && (
              <Link
                href="/paper"
                className="flex items-center gap-1 font-bold text-primary hover:underline"
              >
                <span>Go to Paper Terminal</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Strategy Marketplace</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              Autonomous Co-Pilot
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Transparent, quantitative strategies. Follow telemetry, copy with risk guardrails, or paper trade in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Strategy</span>
          </button>
        </div>
      </div>

      {/* Interactive Guide & Defense Section */}
      <PageTipSection
        pageTitle="Strategy Marketplace & Quantitative Copy Trading"
        subtitle="How algorithmic stock strategies, risk guardrails, and automated copy execution work"
        badge="Quant Marketplace"
        storageKey="strategies"
        tips={[
          {
            title: 'Verified Quantitative Models',
            description:
              'Browse rule-based strategies designed specifically for tokenized equities, including delta-neutral market making, volatility-breakout momentum, and mean-reversion.',
            badge: 'On-Chain Quant',
          },
          {
            title: 'Client-Side Risk-Bounded Copy Trading',
            description:
              'Copy verified strategies with strict user-defined parameters: maximum allocation caps, stop-loss triggers, and slippage ceilings so you never risk more than intended.',
            badge: 'Capital Safety',
          },
          {
            title: 'Virtual Paper Simulation & Backtesting',
            description:
              'Test any strategy directly in the Paper Trading terminal before allocating real USDC or SOL, observing performance across live Pyth market movements.',
            badge: 'Zero Risk Sandbox',
          },
        ]}
        hackathonDefense="While social trading platforms expose retail users to unverified 'signal callers' and hidden frontrunning, MITIGATOR's Strategy Marketplace requires verifiable rule-based code, transparent on-chain performance tracking, and client-enforced stop-loss guardrails."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Strategies' },
          { id: 'verified', label: 'Audited & Verified' },
          { id: 'low', label: 'Low Risk' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'elevated', label: 'High Volatility' },
          { id: 'subscribed', label: `My Subscriptions (${subscriptions.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap',
              filter === tab.id
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-card/40 hover:bg-card border-border/60 text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Strategy Grid */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="text-xs font-mono text-muted-foreground">Syncing strategy marketplace registry...</p>
        </div>
      ) : filteredStrategies.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-border/60 rounded-2xl bg-card/20 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Cpu className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-semibold">No Strategies Registered Yet</h3>
            <p className="text-xs text-muted-foreground">
              {filter === 'subscribed'
                ? "You haven't followed or copied any strategies yet."
                : "The decentralized strategy marketplace currently has no registered models. Click '+ Create Strategy' above to register your quantitative algorithm or connect your Supabase database."}
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Create First Strategy
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStrategies.map((strat, i) => {
            const isFollowing = subscriptions.some((s) => s.strategyId === strat.id && s.type === 'follow');
            const copySub = subscriptions.find((s) => s.strategyId === strat.id && s.type === 'copy');
            const isPaper = subscriptions.some((s) => s.strategyId === strat.id && s.type === 'paper');
            const isActing = actionLoadingId === strat.id;

            return (
              <motion.div
                key={strat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassPanel hover className="p-5 h-full flex flex-col justify-between relative overflow-hidden">
                  {/* Status Banner Tag */}
                  <div className="flex items-center gap-1.5 absolute top-3 right-4">
                    {copySub && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-primary/15 text-primary border border-primary/30">
                        Copying ${copySub.allocationUsd.toLocaleString()}
                      </span>
                    )}
                    {isPaper && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        Paper Active
                      </span>
                    )}
                    <RiskBadge level={strat.riskLevel} />
                    {strat.id.startsWith('strat-custom') && (
                      <button
                        onClick={() => handleDeleteStrategy(strat.id)}
                        className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete custom strategy"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex items-start gap-3 mb-3 pr-24">
                      <div className="rounded-lg bg-primary/10 p-2.5 flex-shrink-0">
                        <Cpu className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-foreground">{strat.name}</p>
                          {strat.verified && (
                            <span title="Audited quantitative strategy">
                              <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">{strat.creator}</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {strat.description}
                    </p>

                    {/* Target assets pills */}
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      <span className="text-[10px] font-mono text-muted-foreground">Assets:</span>
                      {strat.targetAssets?.map((a) => (
                        <span key={a} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border/80 text-foreground font-semibold">
                          {a}
                        </span>
                      ))}
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div className="rounded-lg bg-card/50 p-2 border border-border/40">
                        <p className="text-muted-foreground text-[11px]">Historic ROI</p>
                        <p className="font-bold tabular-nums text-emerald-400">+{strat.roi.toFixed(1)}%</p>
                      </div>
                      <div className="rounded-lg bg-card/50 p-2 border border-border/40">
                        <p className="text-muted-foreground text-[11px]">Max Drawdown</p>
                        <p className="font-bold tabular-nums text-red-400">{strat.drawdown.toFixed(1)}%</p>
                      </div>
                      <div className="rounded-lg bg-card/50 p-2 border border-border/40">
                        <p className="text-muted-foreground text-[11px]">Sharpe Ratio</p>
                        <p className="font-bold tabular-nums text-foreground">{strat.sharpe.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg bg-card/50 p-2 border border-border/40">
                        <p className="text-muted-foreground text-[11px]">Win Rate</p>
                        <p className="font-bold tabular-nums text-cyan-400">{strat.winRate}%</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-muted-foreground mb-4">
                      <p><span className="font-medium text-foreground">Hold:</span> {strat.holdingPeriod}</p>
                      <p><span className="font-medium text-foreground">Concentration:</span> {strat.concentration}%</p>
                      <p className="truncate"><span className="font-medium text-foreground">Method:</span> {strat.methodology}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pt-2 border-t border-border/40">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {strat.followers} followers
                      </span>
                      <span>{strat.copiers} copiers</span>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleToggleFollow(strat)}
                        disabled={isActing}
                        className={cn(
                          'flex items-center justify-center gap-1 rounded-lg border py-2 text-xs transition-colors font-medium',
                          isFollowing
                            ? 'bg-primary/15 border-primary/40 text-primary'
                            : 'border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <TrendingUp className="h-3 w-3" />
                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setCopyTargetStrat(strat);
                          const maxCap = userProfile?.maxOrderSizeUsd || 5000;
                          setCopyAmount(Math.min(2500, maxCap));
                        }}
                        disabled={isActing}
                        className="flex items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs hover:border-primary/40 text-foreground transition-colors font-medium"
                      >
                        <Copy className="h-3 w-3" />
                        <span>{copySub ? 'Edit Copy' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => handleDeployPaper(strat)}
                        disabled={isActing}
                        className="flex items-center justify-center gap-1 rounded-lg bg-primary/10 border border-primary/25 py-2 text-xs text-primary hover:bg-primary/20 transition-colors font-medium"
                      >
                        {isActing ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <FlaskConical className="h-3 w-3" />
                        )}
                        <span>Paper</span>
                      </button>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Copy Allocation Modal */}
      {/* Copy Strategy Modal */}
      <AnimatePresence>
        {copyTargetStrat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md max-h-[90dvh] my-auto overflow-hidden flex flex-col"
            >
              <GlassPanel className="p-5 sm:p-6 border-border shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto scrollbar-thin">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Copy Strategy Allocation</h3>
                    <p className="text-xs text-muted-foreground">{copyTargetStrat.name} · {copyTargetStrat.creator}</p>
                  </div>
                  <button
                    onClick={() => setCopyTargetStrat(null)}
                    className="p-1 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Pre-trade Risk Policy Guardrail Check */}
                <div className="p-3 rounded-xl bg-card/60 border border-border/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">User Risk Profile:</span>
                    <span className="font-bold text-primary capitalize">{userProfile?.riskTolerance || 'balanced'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Configured Max Order Cap:</span>
                    <span className="font-mono font-bold text-foreground">${(userProfile?.maxOrderSizeUsd || 5000).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Strategy Risk Level:</span>
                    <span className="font-mono font-bold text-amber-400 capitalize">{copyTargetStrat.riskLevel}</span>
                  </div>
                </div>

                {/* Input Allocation Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Allocation Cap (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">$</span>
                    <input
                      type="number"
                      value={copyAmount}
                      onChange={(e) => setCopyAmount(Math.max(100, parseInt(e.target.value) || 0))}
                      className="w-full bg-card/40 border border-border rounded-lg pl-7 pr-3 py-2 text-sm font-mono font-bold outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Policy Warning if above user max order cap */}
                {copyAmount > (userProfile?.maxOrderSizeUsd || 5000) && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Allocation exceeds your configured safety threshold of ${(userProfile?.maxOrderSizeUsd || 5000).toLocaleString()}. Consider adjusting allocation or your settings.
                    </span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between gap-2">
                  {subscriptions.some((s) => s.strategyId === copyTargetStrat.id && s.type === 'copy') && (
                    <button
                      type="button"
                      onClick={() => handleCancelCopy(copyTargetStrat.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30 text-xs font-medium transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Stop Copying</span>
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => setCopyTargetStrat(null)}
                      className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-card transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExecuteCopy}
                      disabled={actionLoadingId === copyTargetStrat.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                    >
                      {actionLoadingId === copyTargetStrat.id ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Deploying Policy...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Confirm Copy Allocation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Custom Strategy Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg max-h-[90dvh] my-auto overflow-hidden flex flex-col"
            >
              <GlassPanel className="p-5 sm:p-6 border-border shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto scrollbar-thin">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Register Quantitative Strategy</h3>
                    <p className="text-xs text-muted-foreground">Define your custom rule-based model on Solana tokenized equities</p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateCustomStrategy} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Strategy Name</label>
                    <input
                      required
                      value={newStratName}
                      onChange={(e) => setNewStratName(e.target.value)}
                      placeholder="e.g. Volatility Breakout Alpha"
                      className="w-full bg-card/40 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Target Equity</label>
                      <select
                        value={newStratAsset}
                        onChange={(e) => setNewStratAsset(e.target.value)}
                        className="w-full bg-card/60 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary text-foreground"
                      >
                        <option value="NVDAx">NVDAx (Nvidia)</option>
                        <option value="TSLAx">TSLAx (Tesla)</option>
                        <option value="AAPLx">AAPLx (Apple)</option>
                        <option value="MSFTx">MSFTx (Microsoft)</option>
                        <option value="SPYx">SPYx (S&P 500)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Risk Category</label>
                      <select
                        value={newStratRisk}
                        onChange={(e) => setNewStratRisk(e.target.value as any)}
                        className="w-full bg-card/60 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary text-foreground"
                      >
                        <option value="low">Low (Capital Preservation)</option>
                        <option value="moderate">Moderate (Balanced Alpha)</option>
                        <option value="elevated">Elevated (Momentum/Scalp)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Description</label>
                    <textarea
                      rows={2}
                      value={newStratDesc}
                      onChange={(e) => setNewStratDesc(e.target.value)}
                      placeholder="Explain what market conditions trigger entries and exits..."
                      className="w-full bg-card/40 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Quantitative Methodology</label>
                    <input
                      value={newStratMethodology}
                      onChange={(e) => setNewStratMethodology(e.target.value)}
                      placeholder="e.g. Pyth latency < 500ms + MITIGATOR Score >= 80 + RSI < 35"
                      className="w-full bg-card/40 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-card transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingStrat || !newStratName.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
                    >
                      {isCreatingStrat ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Publish Strategy</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 text-xs text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
        Copy sizing considers your risk profile and portfolio concentration. Past performance does not guarantee future results.
      </div>
    </div>
  );
}
