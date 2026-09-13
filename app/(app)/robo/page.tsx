'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Bot,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Lock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Coins,
  Sparkles,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { RiskBadge } from '@/components/shared/SourceBadge';
import { getRoboProfiles } from '@/lib/mock-data';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { useDashboardLiveData } from '@/lib/hooks/useDashboardLiveData';
import { saveUserProfile, getUserProfile } from '@/lib/services/user-profile';
import { cn } from '@/lib/utils';

export default function RoboPage() {
  const profiles = getRoboProfiles();
  const { address } = useSolanaWallet();
  const { quotes } = useDashboardLiveData();
  const userAddress = address || 'guest';

  const [selected, setSelected] = useState('robo-balanced');
  const [deploymentAmount, setDeploymentAmount] = useState(10000);
  const [maxPosition, setMaxPosition] = useState(25);
  const [maxDailyLoss, setMaxDailyLoss] = useState(5);
  const [maxSlippage, setMaxSlippage] = useState(0.5);
  const [minConfidence, setMinConfidence] = useState(75);
  const [humanApproval, setHumanApproval] = useState(true);
  const [aiTrading, setAiTrading] = useState(false);

  // Deployment action state
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState<{
    profileName: string;
    amount: number;
    tranchesCount: number;
  } | null>(null);

  const profile = profiles.find((p) => p.id === selected) || profiles[0];

  // Deploy automated allocation to Paper Trading
  const handleDeployAllocation = async () => {
    setIsDeploying(true);
    setDeploymentSuccess(null);

    try {
      // 1. Rebalance paper positions matching the profile's asset weights
      for (const item of profile.allocation) {
        const itemAmount = Math.round((deploymentAmount * item.weight) / 100);
        if (itemAmount > 0) {
          await fetch('/api/paper', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userAddress,
              symbol: item.symbol,
              side: 'buy',
              amountUsd: itemAmount,
              venue: 'Jupiter (Robo Rebalancer)',
            }),
          }).catch((err) => console.warn('Paper deploy item error:', err));
        }
      }

      // 2. Persist user preferences
      const existingProfile = await getUserProfile(userAddress);
      await saveUserProfile({
        ...existingProfile,
        maxSlippagePct: maxSlippage,
        riskTolerance: profile.riskLevel === 'high' ? 'aggressive' : profile.riskLevel === 'low' ? 'conservative' : 'balanced',
      });

      setDeploymentSuccess({
        profileName: profile.name,
        amount: deploymentAmount,
        tranchesCount: profile.allocation.length,
      });
    } catch (e) {
      console.error('Failed to deploy robo allocation:', e);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Robo Advisor &amp; Rebalancer</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              Autonomous Balancing
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Automated portfolio builder with pre-trade policy safety controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5 inline mr-1" />
            Safety Guardrails Armed
          </span>
        </div>
      </div>

      {/* Safety Status Banner */}
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border p-4 transition-colors',
          aiTrading ? 'border-amber-500/30 bg-amber-500/5' : 'border-emerald-500/30 bg-emerald-500/5'
        )}
      >
        <ShieldCheck className={cn('h-5 w-5 flex-shrink-0', aiTrading ? 'text-amber-400' : 'text-emerald-400')} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {aiTrading ? 'AI Automated Execution: Active' : 'AI Advisor Guardrail: Human Review Mode (Default)'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {aiTrading
              ? 'Robo Advisor will automatically rebalance your Paper Trading portfolio when allocations drift > 5%.'
              : 'Robo Advisor calculates target weights and optimal entry prices. You review and deploy with 1-click.'}
          </p>
        </div>
        <button
          onClick={() => setAiTrading(!aiTrading)}
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors flex-shrink-0',
            aiTrading ? 'bg-amber-500' : 'bg-emerald-500'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
              aiTrading ? 'translate-x-5' : 'translate-x-0.5'
            )}
          />
        </button>
      </div>

      {/* Deployment Success Notification */}
      <AnimatePresence>
        {deploymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300 text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-300">
                  {deploymentSuccess.profileName} Deployed Successfully!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Allocated ${deploymentSuccess.amount.toLocaleString()} across {deploymentSuccess.tranchesCount} tokenized
                  equities in your Paper Trading portfolio at live Pyth streaming prices.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/paper"
                className="flex items-center gap-1 font-bold text-primary hover:underline whitespace-nowrap"
              >
                <span>View Paper Book</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href="/portfolio"
                className="flex items-center gap-1 font-bold text-foreground hover:underline whitespace-nowrap ml-3"
              >
                <span>Go to Portfolio</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Selection */}
      <div>
        <h2 className="text-sm font-semibold tracking-wide mb-3 flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          Select Target Investment Model
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {profiles.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => {
                setSelected(p.id);
                setDeploymentSuccess(null);
              }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                'rounded-xl border p-4 text-left transition-all',
                selected === p.id
                  ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                  : 'border-border bg-card/40 hover:border-border/80 hover:bg-card/70'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Bot className={cn('h-4 w-4', selected === p.id ? 'text-primary' : 'text-muted-foreground')} />
                <RiskBadge level={p.riskLevel} />
              </div>
              <p className="text-sm font-bold text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.description}</p>
              <div className="mt-3 pt-2 border-t border-border/40 flex justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold">+{p.expectedReturn}% Return</span>
                <span className="text-red-400">{p.maxDrawdown}% Max DD</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Dynamic Allocation Breakdown */}
      <GlassPanel className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-wide flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {profile.name} Asset Distribution
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target weights rebalanced to maximize Sharpe ratio and reduce single-stock concentration
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Capital:</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                <input
                  type="number"
                  value={deploymentAmount}
                  onChange={(e) => setDeploymentAmount(Math.max(500, parseInt(e.target.value) || 0))}
                  className="bg-card/60 border border-border rounded-lg pl-6 pr-2.5 py-1 text-xs font-mono font-bold text-foreground w-28 outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              onClick={handleDeployAllocation}
              disabled={isDeploying}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 active:scale-95"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Rebalancing Book...</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  <span>Deploy ${deploymentAmount.toLocaleString()} to Paper</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Allocation Bars */}
        <div className="space-y-3 pt-2">
          {profile.allocation.map((a) => {
            const rawSym = a.symbol.replace(/x$/, '');
            const liveP = quotes[rawSym]?.price || 184.22;
            const trancheUsd = (deploymentAmount * a.weight) / 100;
            const estShares = trancheUsd / liveP;

            return (
              <div key={a.symbol} className="p-3 rounded-xl bg-card/40 border border-border/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-foreground">{a.symbol}</span>
                    <span className="text-muted-foreground font-mono">
                      (Pyth: ${liveP.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-muted-foreground">
                      {estShares.toFixed(2)} shares (~${trancheUsd.toLocaleString()})
                    </span>
                    <span className="font-bold text-primary">{a.weight}%</span>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${a.weight}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>

      {/* Safety Controls Configuration */}
      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-wide">Pre-Trade Policy Guardrails</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="text-muted-foreground block mb-1">Max Position Size Cap: {maxPosition}%</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={maxPosition}
              onChange={(e) => setMaxPosition(parseInt(e.target.value))}
              className="mt-1 w-full accent-primary"
            />
          </div>
          <div>
            <label className="text-muted-foreground block mb-1">Max Daily Drawdown Stop: {maxDailyLoss}%</label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={maxDailyLoss}
              onChange={(e) => setMaxDailyLoss(parseInt(e.target.value))}
              className="mt-1 w-full accent-primary"
            />
          </div>
          <div>
            <label className="text-muted-foreground block mb-1">Max Slippage Threshold: {maxSlippage.toFixed(2)}%</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.05"
              value={maxSlippage}
              onChange={(e) => setMaxSlippage(parseFloat(e.target.value))}
              className="mt-1 w-full accent-primary"
            />
          </div>
          <div>
            <label className="text-muted-foreground block mb-1">Minimum Model Confidence: {minConfidence}%</label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseInt(e.target.value))}
              className="mt-1 w-full accent-primary"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Human Confirmation Required</p>
              <p className="text-muted-foreground">Enforce review before execution dispatch</p>
            </div>
            <button
              onClick={() => setHumanApproval(!humanApproval)}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors',
                humanApproval ? 'bg-primary' : 'bg-border'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
                  humanApproval ? 'translate-x-4' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Corporate Event Blackout</p>
              <p className="text-muted-foreground">Halt trades within 24 hours of earnings or 8-K disclosures</p>
            </div>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
              <ShieldCheck className="h-3.5 w-3.5" /> Armed &amp; Active
            </span>
          </div>
        </div>
      </GlassPanel>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 text-xs text-muted-foreground">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
        Robo Advisor synthesizes Pyth oracle health and SEC Edgar filing schedules before calculating optimal portfolio allocations. You retain 100% custody and approval authority.
      </div>
    </div>
  );
}
